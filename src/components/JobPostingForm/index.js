import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { useForm, Controller } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import skillsData from '../../skills.json';
import './index.css';

const technicalSkillsOptions = skillsData.map(({ name }) => ({ value: name, label: name }));

const initialJobPosting = {
  jobTitle: null,
  jobLocation: [],
  jobType: '',
  department: '',
  jobLevel: '',
  salaryRange: { currency: 'USD', min: '', max: '', isVisible: true },
  jobDescription: '',
  jobResponsibilities: '',
  keySkillsRequired: '',
  preferredQualifications: '',
  minimumExperienceRequired: '',
  educationRequirements: '',
  certificationsRequired: '',
  companyName: '',
  companyWebsite: '',
  companyLogo: '',
  companySize: '',
  companyLocation: null,
  applicationDeadline: '',
  recruiterName: '',
  recruiterContactEmail: '',
  recruiterContactPhoneNumber: '',
  technicalSkills: [],
  languagesRequired: '',
  benefitsAndPerks: '',
  workingHours: '',
  interviewProcessDescription: '',
  backgroundCheckRequirements: '',
  status: 'active',
  customFields: []
};

const JobPostingForm = (props) => {
  const {
    onSubmit,
    onPreview,
    onClose,
    jobOptions,
    cities,
    currencies,
    editingJob,
    template,
    setSavedTemplates,
    setIsPopupOpen,
    setShowConfirmation,
  } = props


  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: template || initialJobPosting
  });

  const [customFields, setCustomFields] = useState([]);

  useEffect(() => {
    if (editingJob) {
      Object.entries(editingJob).forEach(([key, value]) => setValue(key, value));
      setCustomFields(Array.isArray(editingJob.customFields) ? editingJob.customFields : []);
    }
  }, [editingJob, setValue]);

  const handleSaveTemplate = () => {
    const currentValues = watch();
    if (!currentValues.jobTitle) {
      alert("Please fill all mandatory fields!");
      return;
    }

    const templateToSave = {
      ...currentValues,
      id: uuidv4(),
      customFields
    };
    setSavedTemplates(prev => [...prev, templateToSave]);
    setIsPopupOpen(false);
    setShowConfirmation(true);
  };

  const loadCityOptions = useCallback((inputValue, callback) => {
    setTimeout(() => {
      const filteredCities = cities
        .filter(city => city.city_name.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 100)
        .map(city => ({ value: city.city_id, label: city.city_name }));
      callback(filteredCities);
    }, 300);
  }, [cities]);

    const handleCustomFieldChange = (index, field, value) => {
    setCustomFields(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const onSubmitForm = (data) => {
    if (!data.jobTitle || data.jobLocation.length === 0 || !data.companyName || !data.companyWebsite) {
      alert('Please fill in all required fields.');
      return;
    }
    const formattedJobPosting = {
      ...data,
      salaryRange: {
        ...data.salaryRange,
        formatted: `${data.salaryRange.currency} ${data.salaryRange.min || '0'}-${data.salaryRange.max || '0'}`
      },
      customFields: customFields.reduce((acc, { key, value }) => {
        if (key && value) acc[key] = value;
        return acc;
      }, {})
    };
    onSubmit(formattedJobPosting);
  };

  const handlePreview = () => {
    const currentValues = watch();
    if (!currentValues.jobTitle || currentValues.jobLocation.length === 0 || !currentValues.companyName || !currentValues.companyWebsite) {
      alert('Please fill in all required fields.');
      return;
    }
    const previewJobPosting = {
      ...currentValues,
      salaryRange: `${currentValues.salaryRange.currency} ${currentValues.salaryRange.min}-${currentValues.salaryRange.max}`,
      customFields: customFields.reduce((acc, { key, value }) => {
        if (key && value) acc[key] = value;
        return acc;
      }, {})
    };
    onPreview(previewJobPosting);
  };

  const renderField = (name, label, type = 'text', options = null, isMulti = false, isRequired = false) => (
    <Controller
      name={name}
      control={control}
      rules={{ required: isRequired }}
      render={({ field }) => (
        <div className="input-field">
          <label>{label}{isRequired && <span className='star'>*</span>}</label>
          {type === 'select' ? (
            <Select
              {...field}
              options={options}
              isMulti={isMulti}
              placeholder={`Select ${label}`}
            />
          ) : type === 'textarea' ? (
            <textarea {...field} className="textarea" placeholder={label} />
          ) : (
            <input {...field} type={type} placeholder={label} />
          )}
        </div>
      )}
    />
  );

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>{editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}</h2>
        <form onSubmit={handleSubmit(onSubmitForm)} className="job-posting-form">
          {renderField('jobTitle', 'Job Title', 'select', jobOptions, false, true)}
          <Controller
            name="jobLocation"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div className="input-field">
                <label>Job Locations<span className='star'>*</span></label>
                <AsyncSelect
                  {...field}
                  isMulti
                  loadOptions={loadCityOptions}
                  placeholder="Search and select cities..."
                  noOptionsMessage={() => "Type to search cities"}
                />
              </div>
            )}
          />
          {renderField('jobType', 'Job Type', 'select', [
            { value: 'Full-Time', label: 'Full-Time' },
            { value: 'Part-Time', label: 'Part-Time' },
            { value: 'Contract', label: 'Contract' },
            { value: 'Temporary', label: 'Temporary' },
            { value: 'Internship', label: 'Internship' },
            { value: 'Remote', label: 'Remote' },
          ], false, true)}
          {renderField('department', 'Department')}
          {renderField('jobLevel', 'Job Level', 'select', [
            { value: 'Entry-Level', label: 'Entry-Level' },
            { value: 'Mid-Level', label: 'Mid-Level' },
            { value: 'Senior-Level', label: 'Senior-Level' },
            { value: 'Executive', label: 'Executive' },
            { value: 'Managerial', label: 'Managerial' },
          ])}

          <div className="input-field">
            <label>Salary Range</label>
            <div className="salary-range">
              <Controller
                name="salaryRange.currency"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={currencies.map(curr => ({ value: curr, label: curr }))}
                    placeholder="Currency"
                    className="currency-select"
                  />
                )}
              />
              <Controller
                name="salaryRange.min"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    placeholder="Min Salary"
                    className="salary-input"
                  />
                )}
              />
              <Controller
                name="salaryRange.max"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    placeholder="Max Salary"
                    className="salary-input"
                  />
                )}
              />
              <Controller
                name="salaryRange.isVisible"
                control={control}
                render={({ field }) => (
                  <label className="salary-visibility">
                    <input
                      type="checkbox"
                      {...field}
                      checked={field.value}
                    />
                    Visible to candidates
                  </label>
                )}
              />
            </div>
          </div>

          {renderField('applicationDeadline', 'Application Deadline', 'date')}
          {renderField('jobDescription', 'Job Description', 'textarea')}
          {renderField('jobResponsibilities', 'Job Responsibilities', 'textarea')}
          {renderField('keySkillsRequired', 'Key Skills Required', 'textarea')}
          {renderField('preferredQualifications', 'Preferred Qualifications', 'textarea')}
          {renderField('minimumExperienceRequired', 'Minimum Experience Required')}
          {renderField('educationRequirements', 'Education Requirements')}
          {renderField('certificationsRequired', 'Certifications Required', 'textarea')}

          <h2>Company Details</h2>
          {renderField('companyName', 'Company Name', 'text', null, false, true)}
          {renderField('companyWebsite', 'Company Website', 'url', null, false, true)}
          {renderField('companyLogo', 'Company Logo URL', 'url')}
          {renderField('companySize', 'Company Size', 'select', [
            { value: '1-10', label: '1-10 employees' },
            { value: '11-50', label: '11-50 employees' },
            { value: '51-200', label: '51-200 employees' },
            { value: '201-500', label: '201-500 employees' },
            { value: '501-1000', label: '501-1000 employees' },
            { value: '1001+', label: '1001+ employees' },
          ])}
          <Controller
            name="companyLocation"
            control={control}
            render={({ field }) => (
              <div className="input-field">
                <label>Company Location</label>
                <AsyncSelect
                  {...field}
                  loadOptions={loadCityOptions}
                  placeholder="Company Location..."
                  noOptionsMessage={() => "Type to search cities"}
                />
              </div>
            )}
          />

          <h2>Contact Information</h2>
          {renderField('recruiterName', 'Recruiter Name')}
          {renderField('recruiterContactEmail', 'Recruiter Contact Email', 'email')}
          {renderField('recruiterContactPhoneNumber', 'Recruiter Contact Phone Number', 'tel')}

          <h2>Job Requirements</h2>
          {renderField('technicalSkills', 'Technical Skills', 'select', technicalSkillsOptions, true)}
          {renderField('languagesRequired', 'Languages Required')}

          <h2>Additional Information</h2>
          {renderField('benefitsAndPerks', 'Benefits and Perks', 'textarea')}
          {renderField('workingHours', 'Working Hours')}
          {renderField('interviewProcessDescription', 'Interview Process Description', 'textarea')}
          {renderField('backgroundCheckRequirements', 'Background Check Requirements', 'textarea')}

          <div className="input-field">
            <label>Custom Fields</label>
            {Array.isArray(customFields) && customFields.map((field, index) => (
              <div key={index} className="custom-field">
                <input
                  type="text"
                  placeholder="Field Name"
                  value={field.key}
                  onChange={(e) => handleCustomFieldChange(index, 'key', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Field Value"
                  value={field.value}
                  onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                />
                <button type="button" onClick={() => setCustomFields(prev => prev.filter((_, i) => i !== index))}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => setCustomFields(prev => [...prev, { key: '', value: '' }])}>Add Custom Field</button>
          </div>

          <div className="form-actions">
            <button type="submit">
              {editingJob ? 'Update Job Posting' : 'Create Job Posting'}
            </button>
            {!template && (
              <button type="button" onClick={handleSaveTemplate}>
                Save Template
              </button>
            )}
            <button type="button" onClick={handlePreview}>Preview</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPostingForm;