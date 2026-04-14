import {
  FiBriefcase, FiMapPin, FiUsers, FiDollarSign, FiCalendar,
} from "react-icons/fi";
import { Field, SectionCard } from "./SharedUI";
import { inputCls, JOB_TYPES } from "./postJobConstants";

export default function StepJobDetails({ formData, onChange }) {
  return (
    <SectionCard title="Job Details">
      <Field label="Job Title" required icon={FiBriefcase}>
        <input
          name="title"
          value={formData.title}
          onChange={onChange}
          placeholder="Senior Frontend Engineer"
          className={inputCls}
          required
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Location" required icon={FiMapPin}>
          <input
            name="location"
            value={formData.location}
            onChange={onChange}
            placeholder="Remote / Bangalore"
            className={inputCls}
            required
          />
        </Field>

        <Field label="Job Type" icon={FiBriefcase}>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={onChange}
            className={inputCls}
          >
            {JOB_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="Min Experience (yrs)" icon={FiUsers}>
          <input
            type="number"
            name="experienceMin"
            value={formData.experienceMin}
            onChange={onChange}
            min={0}
            className={inputCls}
          />
        </Field>

        <Field label="Max Experience (yrs)" icon={FiUsers}>
          <input
            type="number"
            name="experienceMax"
            value={formData.experienceMax}
            onChange={onChange}
            placeholder="Optional"
            className={inputCls}
          />
        </Field>

        <Field label="Min Salary (₹)" icon={FiDollarSign}>
          <input
            type="number"
            name="salaryMin"
            value={formData.salaryMin}
            onChange={onChange}
            placeholder="e.g. 300000"
            className={inputCls}
          />
        </Field>

        <Field label="Max Salary (₹)" icon={FiDollarSign}>
          <input
            type="number"
            name="salaryMax"
            value={formData.salaryMax}
            onChange={onChange}
            placeholder="e.g. 700000"
            className={inputCls}
          />
        </Field>

        <Field label="Vacancies" icon={FiUsers}>
          <input
            type="number"
            name="vacancies"
            value={formData.vacancies}
            onChange={onChange}
            min={1}
            className={inputCls}
          />
        </Field>

        <Field label="Application Deadline" icon={FiCalendar}>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={onChange}
            className={inputCls}
          />
        </Field>
      </div>
    </SectionCard>
  );
}