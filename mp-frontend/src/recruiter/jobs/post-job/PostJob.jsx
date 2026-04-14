import { usePostJob } from "./usePostJob";
import PostJobHeader from "./PostJobHeader";
import StepIndicator from "./StepIndicator";
import StepCompany from "./StepCompany";
import StepJobDetails from "./StepJobDetails";
import StepRequirements from "./StepRequirements";
import StepReview from "./StepReview";
import StepNavigation from "./StepNavigation";

const PostJob = () => {
  const {
    step,
    loading,
    formData,
    handleChange,
    handleSkills,
    nextStep,
    prevStep,
    handleSubmit,
  } = usePostJob();

  return (
    <div className="min-h-screen bg-white">

      <PostJobHeader companyLogo={formData.companyLogo} />

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-8">

          <StepIndicator current={step} />

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">

            {step === 0 && (
              <StepCompany formData={formData} onChange={handleChange} />
            )}

            {step === 1 && (
              <StepJobDetails formData={formData} onChange={handleChange} />
            )}

            {step === 2 && (
              <StepRequirements
                formData={formData}
                onChange={handleChange}
                onSkillsChange={handleSkills}
              />
            )}

            {step === 3 && <StepReview formData={formData} />}

            <StepNavigation
              step={step}
              loading={loading}
              onPrev={prevStep}
              onNext={nextStep}
              onSubmit={handleSubmit}
            />

          </form>
        </div>
      </div>

    </div>
  );
};

export default PostJob;