import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import skillsData from '../../skills.json';
import { v4 as uuidv4 } from 'uuid';
import './index.css';

const technicalSkillsOptions = skillsData.map(skill => ({value : skill.name, label: skill.name}));

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
 
  const [jobPosting, setJobPosting] = useState(template || initialJobPosting);
  const [checkedFields, setCheckedFields] = useState({});
  
  
  useEffect(() => {
    if (template) {
      setCheckedFields(
        Object.keys(template).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );
    }
  }, [template]);

  useEffect(() => {
    if (editingJob) {
      const customFields = editingJob.customFields
        ? (Array.isArray(editingJob.customFields)
          ? editingJob.customFields
          : Object.entries(editingJob.customFields).map(([key, value]) => ({ key, value })))
        : [];

      setJobPosting({
        ...editingJob,
        customFields: customFields
      });
    }
  }, [editingJob]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckedFields((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSaveTemplate = () => {
    if (jobPosting.jobTitle === null){
      alert("Please fill all mandatory fields!!")
      return null;
    }


    const templateToSave = {
      ...jobPosting,
      id: uuidv4(),
    };
    setSavedTemplates((prev) => [...prev, templateToSave]);
    setIsPopupOpen(false);
    setShowConfirmation(true);
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setJobPosting(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((selectedOption, { name }) => {
    setJobPosting(prev => ({ ...prev, [name]: selectedOption }));
  }, []);

  const handleSalaryChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setJobPosting(prev => ({
      ...prev,
      salaryRange: { 
        ...prev.salaryRange, 
        [name]: type === 'checkbox' ? checked : (name === 'currency' ? value : value === '' ? '' : Number(value))
      }
    }));
  }, []);

  const loadCityOptions = useCallback((inputValue, callback) => {
    setTimeout(() => {
      const filteredCities = cities
        .filter(city => city.city_name.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 100)
        .map(city => ({ value: city.city_id, label: city.city_name }));
      callback(filteredCities);
    }, 300);
  }, [cities]);

  const handleCustomFieldChange = useCallback((index, field, value) => {
    setJobPosting(prev => {
      const updatedCustomFields = [...(Array.isArray(prev.customFields) ? prev.customFields : [])];
      updatedCustomFields[index] = { ...updatedCustomFields[index], [field]: value };
      return { ...prev, customFields: updatedCustomFields };
    });
  }, []);

  const addCustomField = useCallback(() => {
    setJobPosting(prev => ({
      ...prev,
      customFields: [...(Array.isArray(prev.customFields) ? prev.customFields : []), { key: '', value: '' }]
    }));
  }, []);

  const removeCustomField = useCallback((index) => {
    setJobPosting(prev => ({
      ...prev,
      customFields: (Array.isArray(prev.customFields) ? prev.customFields : []).filter((_, i) => i !== index)
    }));
  }, []);

  const handleSubmit = useCallback((e, isDraft = false) => {
    e.preventDefault();
    if (!jobPosting.jobTitle || jobPosting.jobLocation.length === 0) {
      alert('Please fill in all required fields.');
      return;
    }
    const formattedJobPosting = {
      ...jobPosting,
      salaryRange: {
        ...jobPosting.salaryRange,
        formatted: `${jobPosting.salaryRange.currency} ${jobPosting.salaryRange.min || '0'}-${jobPosting.salaryRange.max || '0'}`
      },
      customFields: jobPosting.customFields.reduce((acc, field) => {
        if (field.key && field.value) acc[field.key] = field.value;
        return acc;
      }, {})
    };
    onSubmit(formattedJobPosting, isDraft);
  }, [jobPosting, onSubmit]);

  const handlePreview = useCallback((e) => {
    e.preventDefault();
    if (!jobPosting.jobTitle || jobPosting.jobLocation.length === 0) {
      alert('Please fill in all required fields.');
      return;
    }
    const previewJobPosting = {
      ...jobPosting,
      salaryRange: `${jobPosting.salaryRange.currency} ${jobPosting.salaryRange.min}-${jobPosting.salaryRange.max}`,
      customFields: jobPosting.customFields.reduce((acc, field) => {
        if (field.key && field.value) acc[field.key] = field.value;
        return acc;
      }, {})
    };
    onPreview(previewJobPosting);
  }, [jobPosting, onPreview]);

  const renderInputField = useCallback((label, name, type = 'text', options = null, isRequired = false) => (
    <div className="input-field" key={name}>
      <label>
            <input
              type="checkbox"
              name={name}
              checked={checkedFields.name}
              onChange={handleCheckboxChange}
            />
            {label}
            {(name === "jobTitle" || name === "jobLocations" || name === "jobType") && <span className='star'>*</span>}
      </label>
      {options ? (
        <Select
          id={name}
          name={name}
          value={jobPosting[name]}
          onChange={(selectedOption) => handleSelectChange(selectedOption, { name })}
          options={options}
          placeholder={`Select ${label}`}
          required={isRequired}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={jobPosting[name]}
          onChange={handleInputChange}
          placeholder={label}
          required={isRequired}
        />
      )}
    </div>
  ), [jobPosting, handleInputChange, handleSelectChange]);

  const renderTextArea = useCallback((label, name) => (
    <div className="input-field" key={name}>
      <label>
          <input
            type="checkbox"
            name={name}
            onChange={handleCheckboxChange}
          />
          {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={jobPosting[name]}
        onChange={handleInputChange}
        placeholder={label}
        className="textarea"
      />
    </div>
  ), [jobPosting, handleInputChange]);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>{editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}</h2>
        <form onSubmit={handleSubmit} className="job-posting-form">
          {renderInputField('Job Title', 'jobTitle', 'select', jobOptions, true)}
          
          <div className="input-field">
          <label>
            <input
              type="checkbox"
              name="jobLocations"
              checked={checkedFields.name}
              onChange={handleCheckboxChange}
            />
            Job Locations
            <span className='star'>*</span>
          </label>
            <AsyncSelect
              id="jobLocation"
              isMulti
              value={jobPosting.jobLocation}
              onChange={(selectedOptions) => handleSelectChange(selectedOptions, { name: 'jobLocation' })}
              loadOptions={loadCityOptions}
              placeholder="Search and select cities..."
              noOptionsMessage={() => "Type to search cities"}
            />
          </div>

          {renderInputField('Job Type', 'jobType', 'select', [
            { value: 'Full-Time', label: 'Full-Time' },
            { value: 'Part-Time', label: 'Part-Time' },
            { value: 'Contract', label: 'Contract' },
            { value: 'Temporary', label: 'Temporary' },
            { value: 'Internship', label: 'Internship' },
            { value: 'Remote', label: 'Remote' },
          ], true)}

          {renderInputField('Department', 'department')}

          {renderInputField('Job Level', 'jobLevel', 'select', [
            { value: 'Entry-Level', label: 'Entry-Level' },
            { value: 'Mid-Level', label: 'Mid-Level' },
            { value: 'Senior-Level', label: 'Senior-Level' },
            { value: 'Executive', label: 'Executive' },
            { value: 'Managerial', label: 'Managerial' },
          ])}

          <div className="input-field">
              <label>
                <input
                  type="checkbox"
                  name="salaryRange"
                  onChange={handleCheckboxChange}
                />
                Salary Range
              </label>
            <div className="salary-range">
              <Select
                name="currency"
                value={{ value: jobPosting.salaryRange.currency, label: jobPosting.salaryRange.currency }}
                onChange={(selectedOption) => handleSalaryChange({ target: { name: 'currency', value: selectedOption.value } })}
                options={currencies.map(curr => ({ value: curr, label: curr }))}
                placeholder="Currency"
                className="currency-select"
              />
              <input
                type="number"
                name="min"
                value={jobPosting.salaryRange.min}
                onChange={handleSalaryChange}
                placeholder="Min Salary"
                className="salary-input"
              />
              <input
                type="number"
                name="max"
                value={jobPosting.salaryRange.max}
                onChange={handleSalaryChange}
                placeholder="Max Salary"
                className="salary-input"
              />
              <label className="salary-visibility">
                <input
                  type="checkbox"
                  name="isVisible"
                  checked={jobPosting.salaryRange.isVisible}
                  onChange={handleSalaryChange}
                />
                Visible to candidates
              </label>
            </div>
          </div>
          
          {renderInputField('Application Deadline', 'applicationDeadline', 'date')}
          {renderTextArea('Job Description', 'jobDescription')}
          {renderTextArea('Job Responsibilities', 'jobResponsibilities')}
          {renderTextArea('Key Skills Required', 'keySkillsRequired')}
          {renderTextArea('Preferred Qualifications', 'preferredQualifications')}
          {renderInputField('Minimum Experience Required', 'minimumExperienceRequired')}
          {renderInputField('Education Requirements', 'educationRequirements')}
          {renderTextArea('Certifications Required', 'certificationsRequired')}

          <h2>Company Details</h2>
          {renderInputField('Company Name', 'companyName')}
          {renderInputField('Company Website', 'companyWebsite', 'url')}
          {renderInputField('Company Logo URL', 'companyLogo', 'url')}
          {renderInputField('Company Size', 'companySize', 'select', [
            { value: '1-10', label: '1-10 employees' },
            { value: '11-50', label: '11-50 employees' },
            { value: '51-200', label: '51-200 employees' },
            { value: '201-500', label: '201-500 employees' },
            { value: '501-1000', label: '501-1000 employees' },
            { value: '1001+', label: '1001+ employees' },
          ])}

          <div className="input-field">
            <label>
                <input
                  type="checkbox"
                  name="companyLocation"
                  onChange={handleCheckboxChange}
                />
                Company Location
              </label>
            <AsyncSelect
              id="companyLocation"
              name="companyLocation"
              value={jobPosting.companyLocation}
              onChange={(selectedOption) => handleSelectChange(selectedOption, { name: 'companyLocation' })}
              loadOptions={loadCityOptions}
              placeholder="Company Location..."
              noOptionsMessage={() => "Type to search cities"}
            />
          </div>

          <h2>Contact Information</h2>
          {renderInputField('Recruiter Name', 'recruiterName')}
          {renderInputField('Recruiter Contact Email', 'recruiterContactEmail', 'email')}
          {renderInputField('Recruiter Contact Phone Number', 'recruiterContactPhoneNumber', 'tel')}

          <h2>Job Requirements</h2>
          <div className="input-field">
            <label>
                <input
                  type="checkbox"
                  name="technicalSkills"
                  onChange={handleCheckboxChange}
                />
                 Technical Skills
              </label>
            <Select
              id="technicalSkills"
              name="technicalSkills"
              isMulti
              value={jobPosting.technicalSkills}
              onChange={(selectedOptions) => handleSelectChange(selectedOptions, { name: 'technicalSkills' })}
              options={technicalSkillsOptions}
              placeholder="Select Technical Skills"
            />
          </div>

          {renderInputField('Languages Required', 'languagesRequired')}

          <h2>Additional Information</h2>
          {renderTextArea('Benefits and Perks', 'benefitsAndPerks')}
          {renderInputField('Working Hours', 'workingHours')}
          {renderTextArea('Interview Process Description', 'interviewProcessDescription')}
          {renderTextArea('Background Check Requirements', 'backgroundCheckRequirements')}

          <div className="input-field">
            <label>Custom Fields</label>
            {(Array.isArray(jobPosting.customFields) ? jobPosting.customFields : []).map((field, index) => (
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
                  <button type="button" onClick={() => removeCustomField(index)}>Remove</button>
                </div>
              ))}
            <button type="button" onClick={addCustomField}>Add Custom Field</button>
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
