import { Field, SectionCard } from "./SharedUI";
import { inputCls } from "./editJobConstants";

export default function ExperienceSalarySection({ formData, onChange }) {
  return (
    <SectionCard title="Experience & Salary">
      <div className="px-5 md:px-6 py-5 grid grid-cols-2 gap-5">

        <Field label="Min Experience (yrs)">
          <input
            name="experienceMin"
            type="number"
            min="0"
            value={formData.experienceMin}
            onChange={onChange}
            className={inputCls}
          />
        </Field>

        <Field label="Max Experience (yrs)">
          <input
            name="experienceMax"
            type="number"
            min="0"
            value={formData.experienceMax}
            onChange={onChange}
            placeholder="Optional"
            className={inputCls}
          />
        </Field>

        <Field label="Min Salary (₹)">
          <input
            name="salaryMin"
            type="number"
            value={formData.salaryMin}
            onChange={onChange}
            placeholder="e.g. 300000"
            className={inputCls}
          />
        </Field>

        <Field label="Max Salary (₹)">
          <input
            name="salaryMax"
            type="number"
            value={formData.salaryMax}
            onChange={onChange}
            placeholder="e.g. 700000"
            className={inputCls}
          />
        </Field>

      </div>
    </SectionCard>
  );
}