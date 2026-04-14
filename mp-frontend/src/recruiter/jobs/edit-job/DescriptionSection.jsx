import { Field, SectionCard } from "./SharedUI";
import { inputCls } from "./editJobConstants";

export default function DescriptionSection({ value, onChange }) {
  return (
    <SectionCard title="Job Description">
      <div className="px-5 md:px-6 py-5">
        <Field label="Description" required>
          <textarea
            name="description"
            value={value}
            onChange={onChange}
            required
            rows={7}
            placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity exciting…"
            className={`${inputCls} resize-none`}
          />
        </Field>
      </div>
    </SectionCard>
  );
}