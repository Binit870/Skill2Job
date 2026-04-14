import { useEditJob } from "./useEditJob";
import { LoadingScreen } from "./SharedUI";
import EditJobTopBar from "./EditJobTopBar";
import BasicInfoSection from "./BasicInfoSection";
import ExperienceSalarySection from "./ExperienceSalarySection";
import SkillsSection from "./SkillsSection";
import DescriptionSection from "./DescriptionSection";
import FormActions from "./FormActions";

export default function EditJob() {
  const {
    loading,
    saving,
    formData,
    skills,
    skillInput,
    setSkillInput,
    handleChange,
    handleSubmit,
    addSkill,
    removeSkill,
    navigate,
  } = useEditJob();

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gray-50">

      <EditJobTopBar onBack={() => navigate("/recruiter/my-jobs")} />

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          <BasicInfoSection formData={formData} onChange={handleChange} />

          <ExperienceSalarySection formData={formData} onChange={handleChange} />

          <SkillsSection
            skills={skills}
            skillInput={skillInput}
            setSkillInput={setSkillInput}
            addSkill={addSkill}
            removeSkill={removeSkill}
          />

          <DescriptionSection
            value={formData.description}
            onChange={handleChange}
          />

          <FormActions
            saving={saving}
            onCancel={() => navigate("/recruiter/my-jobs")}
          />

        </form>
      </div>

    </div>
  );
}