import { FiBriefcase, FiGlobe, FiFileText } from "react-icons/fi";
import { Field, SectionCard } from "./SharedUI";
import { inputCls } from "./postJobConstants";

export default function StepCompany({ formData, onChange }) {
  return (
    <SectionCard title="Company Information">
      <Field label="Company Name" required icon={FiBriefcase}>
        <input
          name="company"
          value={formData.company}
          onChange={onChange}
          placeholder="Acme Inc."
          className={inputCls}
          required
        />
      </Field>
      <Field label="Company Website" icon={FiGlobe}>
        <input
          name="companyWebsite"
          value={formData.companyWebsite}
          onChange={onChange}
          placeholder="https://acme.com"
          className={inputCls}
        />
      </Field>
      <Field label="Company Description" icon={FiFileText}>
        <textarea
          name="companyDescription"
          rows={3}
          value={formData.companyDescription}
          onChange={onChange}
          placeholder="What does your company do?"
          className={`${inputCls} resize-none`}
        />
      </Field>
    </SectionCard>
  );
}