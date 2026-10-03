import API from "./api";

/**
 * Takes the response from POST /api/resume/analyze and applies the
 * extracted fields to the student's profile via PUT /api/profile/student.
 *
 * NOTE: the field names read from `analysisResponse` below (name, phone,
 * skills) are placeholders. Once you confirm the actual shape of the
 * /api/resume/analyze response, update the `parsed` object below to match
 * — this is the ONLY place that needs to change; both call sites
 * (OnboardingProfile.jsx and ResumeBuilder.jsx) will pick it up automatically.
 */
export async function applyAnalysisToProfile(analysisResponse, authHeaders = {}) {
  const parsed = analysisResponse?.analysis || analysisResponse || {};

  const profileFd = new FormData();
  if (parsed.name) profileFd.append("name", parsed.name);
  if (parsed.phone) profileFd.append("phone", parsed.phone);
  if (parsed.skills?.length) profileFd.append("skills", JSON.stringify(parsed.skills));

  return API.put("/api/profile/student", profileFd, {
    headers: { ...authHeaders, "Content-Type": "multipart/form-data" },
  });
}