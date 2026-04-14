import { Field, SectionCard } from "./SharedUI";
import { inputCls, JOB_TYPES } from "./editJobConstants";

export default function BasicInfoSection({ formData, onChange }) {
  return (
    <SectionCard title="Basic Information">
      <div className="px-5 md:px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

        <div className="col-span-1 sm:col-span-2">
          <Field label="Job Title" required>
            <input
              name="title"
              value={formData.title}
              onChange={onChange}
              required
              placeholder="e.g. Senior Frontend Developer"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Location" required>
          <input
            name="location"
            value={formData.location}
            onChange={onChange}
            required
            placeholder="e.g. Bangalore, India"
            className={inputCls}
          />
        </Field>

        <Field label="Job Type">
          <select
            name="jobType"
            value={formData.jobType}
            onChange={onChange}
            className={inputCls}
          >
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Vacancies">
          <input
            name="vacancies"
            type="number"
            min="1"
            value={formData.vacancies}
            onChange={onChange}
            className={inputCls}
          />
        </Field>

        <Field label="Application Deadline">
          <input
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={onChange}
            className={inputCls}
          />
        </Field>

      </div>
    </SectionCard>
  );
}