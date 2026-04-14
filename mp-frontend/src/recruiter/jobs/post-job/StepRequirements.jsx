import { FiFileText, FiMail } from "react-icons/fi";
import { Field, SectionCard } from "./SharedUI";
import SkillsInput from "./SkillsInput";
import { inputCls } from "./postJobConstants";

export default function StepRequirements({ formData, onChange, onSkillsChange }) {
  return (
    <SectionCard title="Description & Requirements">
      <Field label="Required Skills" required>
        <SkillsInput value={formData.skills} onChange={onSkillsChange} />
      </Field>

      <Field label="Job Description" required icon={FiFileText}>
        <textarea
          name="description"
          rows={6}
          value={formData.description}
          onChange={onChange}
          placeholder="Describe responsibilities, requirements, and what makes this role exciting…"
          className={`${inputCls} resize-none`}
        />
      </Field>

      <Field label="Contact Email" required icon={FiMail}>
        <input
          type="email"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={onChange}
          placeholder="hr@company.com"
          className={inputCls}
        />
      </Field>
    </SectionCard>
  );
}