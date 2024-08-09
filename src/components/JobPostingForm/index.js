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









// import React, { useState, useEffect, useCallback } from 'react';
// import Select from 'react-select';
// import AsyncSelect from 'react-select/async';
// import { useForm, Controller } from 'react-hook-form';
// import { v4 as uuidv4 } from 'uuid';
// import skillsData from '../../skills.json';
// import './index.css';

// const technicalSkillsOptions = skillsData.map(({ name }) => ({ value: name, label: name }));

// const initialJobPosting = {
//   jobTitle: null,
//   jobLocation: [],
//   jobType: '',
//   department: '',
//   jobLevel: '',
//   salaryRange: { currency: 'USD', min: '', max: '', isVisible: true },
//   jobDescription: '',
//   jobResponsibilities: '',
//   keySkillsRequired: '',
//   preferredQualifications: '',
//   minimumExperienceRequired: '',
//   educationRequirements: '',
//   certificationsRequired: '',
//   companyName: '',
//   companyWebsite: '',
//   companyLogo: '',
//   companySize: '',
//   companyLocation: null,
//   applicationDeadline: '',
//   recruiterName: '',
//   recruiterContactEmail: '',
//   recruiterContactPhoneNumber: '',
//   technicalSkills: [],
//   languagesRequired: '',
//   benefitsAndPerks: '',
//   workingHours: '',
//   interviewProcessDescription: '',
//   backgroundCheckRequirements: '',
//   status: 'active',
//   customFields: []
// };

// const JobPostingForm = ({
//   onSubmit,
//   onPreview,
//   onClose,
//   jobOptions,
//   cities,
//   currencies,
//   editingJob,
//   template,
//   setSavedTemplates,
//   setIsPopupOpen,
//   setShowConfirmation,
// }) => {
//   const { control, handleSubmit, setValue, watch } = useForm({
//     defaultValues: template || initialJobPosting
//   });

//   const [customFields, setCustomFields] = useState([]);

//   useEffect(() => {
//     if (editingJob) {
//       Object.entries(editingJob).forEach(([key, value]) => setValue(key, value));
//       setCustomFields(editingJob.customFields || []);
//     }
//   }, [editingJob, setValue]);

//   const handleSaveTemplate = () => {
//     const currentValues = watch();
//     if (!currentValues.jobTitle) {
//       alert("Please fill all mandatory fields!");
//       return;
//     }

//     const templateToSave = {
//       ...currentValues,
//       id: uuidv4(),
//       customFields
//     };
//     setSavedTemplates(prev => [...prev, templateToSave]);
//     setIsPopupOpen(false);
//     setShowConfirmation(true);
//   };

//   const loadCityOptions = useCallback((inputValue, callback) => {
//     setTimeout(() => {
//       const filteredCities = cities
//         .filter(city => city.city_name.toLowerCase().includes(inputValue.toLowerCase()))
//         .slice(0, 100)
//         .map(city => ({ value: city.city_id, label: city.city_name }));
//       callback(filteredCities);
//     }, 300);
//   }, [cities]);

//   const handleCustomFieldChange = (index, field, value) => {
//     setCustomFields(prev => {
//       const updated = [...prev];
//       updated[index] = { ...updated[index], [field]: value };
//       return updated;
//     });
//   };

//   const onSubmitForm = (data) => {
//     if (!data.jobTitle || data.jobLocation.length === 0 || !data.companyName || !data.companyWebsite) {
//       alert('Please fill in all required fields.');
//       return;
//     }
//     const formattedJobPosting = {
//       ...data,
//       salaryRange: {
//         ...data.salaryRange,
//         formatted: `${data.salaryRange.currency} ${data.salaryRange.min || '0'}-${data.salaryRange.max || '0'}`
//       },
//       customFields: customFields.reduce((acc, { key, value }) => {
//         if (key && value) acc[key] = value;
//         return acc;
//       }, {})
//     };
//     onSubmit(formattedJobPosting);
//   };

//   const handlePreview = () => {
//     const currentValues = watch();
//     if (!currentValues.jobTitle || currentValues.jobLocation.length === 0 || !currentValues.companyName || !currentValues.companyWebsite) {
//       alert('Please fill in all required fields.');
//       return;
//     }
//     const previewJobPosting = {
//       ...currentValues,
//       salaryRange: `${currentValues.salaryRange.currency} ${currentValues.salaryRange.min}-${currentValues.salaryRange.max}`,
//       customFields: customFields.reduce((acc, { key, value }) => {
//         if (key && value) acc[key] = value;
//         return acc;
//       }, {})
//     };
//     onPreview(previewJobPosting);
//   };

//   const renderInputField = (name, label, type = 'text', options = null, isMulti = false, isRequired = false) => (
//     <Controller
//       name={name}
//       control={control}
//       rules={{ required: isRequired }}
//       render={({ field }) => (
//         <div className="input-field">
//           <label>{label}{isRequired && <span className='star'>*</span>}</label>
//           {options ? (
//             <Select
//               {...field}
//               options={options}
//               isMulti={isMulti}
//               placeholder={`Select ${label}`}
//             />
//           ) : (
//             <input {...field} type={type} placeholder={label} />
//           )}
//         </div>
//       )}
//     />
//   );

//   return (
//     <div className="popup-overlay">
//       <div className="popup-content">
//         <h2>{editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}</h2>
//         <form onSubmit={handleSubmit(onSubmitForm)} className="job-posting-form">
//           {renderInputField('jobTitle', 'Job Title', 'select', jobOptions, false, true)}
//           <Controller
//             name="jobLocation"
//             control={control}
//             rules={{ required: true }}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Job Locations<span className='star'>*</span></label>
//                 <AsyncSelect
//                   {...field}
//                   isMulti
//                   loadOptions={loadCityOptions}
//                   placeholder="Search and select cities..."
//                   noOptionsMessage={() => "Type to search cities"}
//                 />
//               </div>
//             )}
//           />
//           {renderInputField('jobType', 'Job Type', 'select', [
//             { value: 'Full-Time', label: 'Full-Time' },
//             { value: 'Part-Time', label: 'Part-Time' },
//             { value: 'Contract', label: 'Contract' },
//             { value: 'Temporary', label: 'Temporary' },
//             { value: 'Internship', label: 'Internship' },
//             { value: 'Remote', label: 'Remote' },
//           ], false, true)}
//           {renderInputField('department', 'Department')}
//           {renderInputField('jobLevel', 'Job Level', 'select', [
//             { value: 'Entry-Level', label: 'Entry-Level' },
//             { value: 'Mid-Level', label: 'Mid-Level' },
//             { value: 'Senior-Level', label: 'Senior-Level' },
//             { value: 'Executive', label: 'Executive' },
//             { value: 'Managerial', label: 'Managerial' },
//           ])}

//           <div className="input-field">
//             <label>Salary Range</label>
//             <div className="salary-range">
//               <Controller
//                 name="salaryRange.currency"
//                 control={control}
//                 render={({ field }) => (
//                   <Select
//                     {...field}
//                     options={currencies.map(curr => ({ value: curr, label: curr }))}
//                     placeholder="Currency"
//                     className="currency-select"
//                   />
//                 )}
//               />
//               <Controller
//                 name="salaryRange.min"
//                 control={control}
//                 render={({ field }) => (
//                   <input
//                     {...field}
//                     type="number"
//                     placeholder="Min Salary"
//                     className="salary-input"
//                   />
//                 )}
//               />
//               <Controller
//                 name="salaryRange.max"
//                 control={control}
//                 render={({ field }) => (
//                   <input
//                     {...field}
//                     type="number"
//                     placeholder="Max Salary"
//                     className="salary-input"
//                   />
//                 )}
//               />
//               <Controller
//                 name="salaryRange.isVisible"
//                 control={control}
//                 render={({ field }) => (
//                   <label className="salary-visibility">
//                     <input
//                       type="checkbox"
//                       {...field}
//                       checked={field.value}
//                     />
//                     Visible to candidates
//                   </label>
//                 )}
//               />
//             </div>
//           </div>

//           {renderInputField('applicationDeadline', 'Application Deadline', 'date')}
//           {renderInputField('jobDescription', 'Job Description', 'textarea')}
//           {renderInputField('jobResponsibilities', 'Job Responsibilities', 'textarea')}
//           {renderInputField('keySkillsRequired', 'Key Skills Required', 'textarea')}
//           {renderInputField('preferredQualifications', 'Preferred Qualifications', 'textarea')}
//           {renderInputField('minimumExperienceRequired', 'Minimum Experience Required')}
//           {renderInputField('educationRequirements', 'Education Requirements')}
//           {renderInputField('certificationsRequired', 'Certifications Required', 'textarea')}

//           <h2>Company Details</h2>
//           {renderInputField('companyName', 'Company Name', 'text', null, false, true)}
//           {renderInputField('companyWebsite', 'Company Website', 'url', null, false, true)}
//           {renderInputField('companyLogo', 'Company Logo URL', 'url')}
//           {renderInputField('companySize', 'Company Size', 'select', [
//             { value: '1-10', label: '1-10 employees' },
//             { value: '11-50', label: '11-50 employees' },
//             { value: '51-200', label: '51-200 employees' },
//             { value: '201-500', label: '201-500 employees' },
//             { value: '501-1000', label: '501-1000 employees' },
//             { value: '1001+', label: '1001+ employees' },
//           ])}
//           <Controller
//             name="companyLocation"
//             control={control}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Company Location</label>
//                 <AsyncSelect
//                   {...field}
//                   loadOptions={loadCityOptions}
//                   placeholder="Company Location..."
//                   noOptionsMessage={() => "Type to search cities"}
//                 />
//               </div>
//             )}
//           />

//           <h2>Contact Information</h2>
//           {renderInputField('recruiterName', 'Recruiter Name')}
//           {renderInputField('recruiterContactEmail', 'Recruiter Contact Email', 'email')}
//           {renderInputField('recruiterContactPhoneNumber', 'Recruiter Contact Phone Number', 'tel')}

//           <h2>Job Requirements</h2>
//           {renderInputField('technicalSkills', 'Technical Skills', 'select', technicalSkillsOptions, true)}
//           {renderInputField('languagesRequired', 'Languages Required')}

//           <h2>Additional Information</h2>
//           {renderInputField('benefitsAndPerks', 'Benefits and Perks', 'textarea')}
//           {renderInputField('workingHours', 'Working Hours')}
//           {renderInputField('interviewProcessDescription', 'Interview Process Description', 'textarea')}
//           {renderInputField('backgroundCheckRequirements', 'Background Check Requirements', 'textarea')}

//           <div className="input-field">
//             <label>Custom Fields</label>
//             {customFields.map((field, index) => (
//               <div key={index} className="custom-field">
//                 <input
//                   type="text"
//                   placeholder="Field Name"
//                   value={field.key}
//                   onChange={(e) => handleCustomFieldChange(index, 'key', e.target.value)}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Field Value"
//                   value={field.value}
//                   onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
//                 />
//                 <button type="button" onClick={() => setCustomFields(prev => prev.filter((_, i) => i !== index))}>Remove</button>
//               </div>
//             ))}
//             <button type="button" onClick={() => setCustomFields(prev => [...prev, { key: '', value: '' }])}>Add Custom Field</button>
//           </div>

//           <div className="form-actions">
//             <button type="submit">
//               {editingJob ? 'Update Job Posting' : 'Create Job Posting'}
//             </button>
//             {!template && (
//               <button type="button" onClick={handleSaveTemplate}>
//                 Save Template
//               </button>
//             )}
//             <button type="button" onClick={handlePreview}>Preview</button>
//             <button type="button" onClick={onClose}>Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default JobPostingForm;








// import React, { useState, useEffect, useCallback } from 'react';
// import Select from 'react-select';
// import AsyncSelect from 'react-select/async';
// import skillsData from '../../skills.json';
// import { useForm, Controller } from 'react-hook-form';
// import { v4 as uuidv4 } from 'uuid';
// import './index.css';

// const technicalSkillsOptions = skillsData.map(skill => ({value : skill.name, label: skill.name}));

// const initialJobPosting = {
//   jobTitle: null,
//   jobLocation: [],
//   jobType: '',
//   department: '',
//   jobLevel: '',
//   salaryRange: { currency: 'USD', min: '', max: '', isVisible: true },
//   jobDescription: '',
//   jobResponsibilities: '',
//   keySkillsRequired: '',
//   preferredQualifications: '',
//   minimumExperienceRequired: '',
//   educationRequirements: '',
//   certificationsRequired: '',
//   companyName: '',
//   companyWebsite: '',
//   companyLogo: '',
//   companySize: '',
//   companyLocation: null,
//   applicationDeadline: '',
//   recruiterName: '',
//   recruiterContactEmail: '',
//   recruiterContactPhoneNumber: '',
//   technicalSkills: [],
//   languagesRequired: '',
//   benefitsAndPerks: '',
//   workingHours: '',
//   interviewProcessDescription: '',
//   backgroundCheckRequirements: '',
//   status: 'active',
//   customFields: []
// };

// const JobPostingForm = (props) => {
//   const {
//     onSubmit,
//     onPreview,
//     onClose,
//     jobOptions,
//     cities,
//     currencies,
//     editingJob,
//     template,
//     setSavedTemplates,
//     setIsPopupOpen,
//     setShowConfirmation,
//   } = props;

//   const { control, handleSubmit, setValue, watch } = useForm({
//     defaultValues: template || initialJobPosting
//   });


//   const [customFields, setCustomFields] = useState([]);

//   useEffect(() => {
//     if (editingJob) {
//       Object.keys(editingJob).forEach(key => {
//         setValue(key, editingJob[key]);
//       });
//       setCustomFields(Array.isArray(editingJob.customFields) ? editingJob.customFields : []);
//     }
//   }, [editingJob, setValue]);

//   const handleSaveTemplate = () => {
//     const currentValues = watch();
//     if (currentValues.jobTitle === null) {
//       alert("Please fill all mandatory fields!!");
//       return null;
//     }

//     const templateToSave = {
//       ...currentValues,
//       id: uuidv4(),
//       customFields
//     };
//     setSavedTemplates((prev) => [...prev, templateToSave]);
//     setIsPopupOpen(false);
//     setShowConfirmation(true);
//   };

//   const loadCityOptions = useCallback((inputValue, callback) => {
//     setTimeout(() => {
//       const filteredCities = cities
//         .filter(city => city.city_name.toLowerCase().includes(inputValue.toLowerCase()))
//         .slice(0, 100)
//         .map(city => ({ value: city.city_id, label: city.city_name }));
//       callback(filteredCities);
//     }, 300);
//   }, [cities]);

//   const handleCustomFieldChange = (index, field, value) => {
//     const updatedFields = [...customFields];
//     updatedFields[index] = { ...updatedFields[index], [field]: value };
//     setCustomFields(updatedFields);
//   };

//   const addCustomField = () => {
//     setCustomFields([...customFields, { key: '', value: '' }]);
//   };

//   const removeCustomField = (index) => {
//     setCustomFields(customFields.filter((_, i) => i !== index));
//   };

//   const onSubmitForm = (data) => {
//     if (!data.jobTitle || data.jobLocation.length === 0) {
//       alert('Please fill in all required fields.');
//       return;
//     }
//     const formattedJobPosting = {
//       ...data,
//       salaryRange: {
//         ...data.salaryRange,
//         formatted: `${data.salaryRange.currency} ${data.salaryRange.min || '0'}-${data.salaryRange.max || '0'}`
//       },
//       customFields: customFields.reduce((acc, field) => {
//         if (field.key && field.value) acc[field.key] = field.value;
//         return acc;
//       }, {})
//     };
//     onSubmit(formattedJobPosting);
//   };

//   const handlePreview = () => {
//     const currentValues = watch();
//     if (!currentValues.jobTitle || currentValues.jobLocation.length === 0) {
//       alert('Please fill in all required fields.');
//       return;
//     }
//     const previewJobPosting = {
//       ...currentValues,
//       salaryRange: `${currentValues.salaryRange.currency} ${currentValues.salaryRange.min}-${currentValues.salaryRange.max}`,
//       customFields: customFields.reduce((acc, field) => {
//         if (field.key && field.value) acc[field.key] = field.value;
//         return acc;
//       }, {})
//     };
//     onPreview(previewJobPosting);
//   };

//   return (
//     <div className="popup-overlay">
//       <div className="popup-content">
//         <h2>{editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}</h2>
//         <form onSubmit={handleSubmit(onSubmitForm)} className="job-posting-form">
//           <Controller
//             name="jobTitle"
//             control={control}
//             rules={{ required: true }}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Job Title<span className='star'>*</span></label>
//                 <Select
//                   {...field}
//                   options={jobOptions}
//                   placeholder="Select Job Title"
//                 />
//               </div>
//             )}
//           />

//           <Controller
//             name="jobLocation"
//             control={control}
//             rules={{ required: true }}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Job Locations<span className='star'>*</span></label>
//                 <AsyncSelect
//                   {...field}
//                   isMulti
//                   loadOptions={loadCityOptions}
//                   placeholder="Search and select cities..."
//                   noOptionsMessage={() => "Type to search cities"}
//                 />
//               </div>
//             )}
//           />

//           <Controller
//             name="jobType"
//             control={control}
//             rules={{ required: true }}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Job Type<span className='star'>*</span></label>
//                 <Select
//                   {...field}
//                   options={[
//                     { value: 'Full-Time', label: 'Full-Time' },
//                     { value: 'Part-Time', label: 'Part-Time' },
//                     { value: 'Contract', label: 'Contract' },
//                     { value: 'Temporary', label: 'Temporary' },
//                     { value: 'Internship', label: 'Internship' },
//                     { value: 'Remote', label: 'Remote' },
//                   ]}
//                   placeholder="Select Job Type"
//                 />
//               </div>
//             )}
//           />

//           <Controller
//             name="department"
//             control={control}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Department</label>
//                 <input {...field} type="text" placeholder="Department" />
//               </div>
//             )}
//           />

//           <Controller
//             name="jobLevel"
//             control={control}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Job Level</label>
//                 <Select
//                   {...field}
//                   options={[
//                     { value: 'Entry-Level', label: 'Entry-Level' },
//                     { value: 'Mid-Level', label: 'Mid-Level' },
//                     { value: 'Senior-Level', label: 'Senior-Level' },
//                     { value: 'Executive', label: 'Executive' },
//                     { value: 'Managerial', label: 'Managerial' },
//                   ]}
//                   placeholder="Select Job Level"
//                 />
//               </div>
//             )}
//           />

//           <div className="input-field">
//             <label>Salary Range</label>
//             <div className="salary-range">
//               <Controller
//                 name="salaryRange.currency"
//                 control={control}
//                 render={({ field }) => (
//                   <Select
//                     {...field}
//                     options={currencies.map(curr => ({ value: curr, label: curr }))}
//                     placeholder="Currency"
//                     className="currency-select"
//                   />
//                 )}
//               />
//               <Controller
//                 name="salaryRange.min"
//                 control={control}
//                 render={({ field }) => (
//                   <input
//                     {...field}
//                     type="number"
//                     placeholder="Min Salary"
//                     className="salary-input"
//                   />
//                 )}
//               />
//               <Controller
//                 name="salaryRange.max"
//                 control={control}
//                 render={({ field }) => (
//                   <input
//                     {...field}
//                     type="number"
//                     placeholder="Max Salary"
//                     className="salary-input"
//                   />
//                 )}
//               />
//               <Controller
//                 name="salaryRange.isVisible"
//                 control={control}
//                 render={({ field }) => (
//                   <label className="salary-visibility">
//                     <input
//                       type="checkbox"
//                       {...field}
//                       checked={field.value}
//                     />
//                     Visible to candidates
//                   </label>
//                 )}
//               />
//             </div>
//           </div>

//           <Controller
//             name="applicationDeadline"
//             control={control}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Application Deadline</label>
//                 <input {...field} type="date" />
//               </div>
//             )}
//           />

//           <Controller
//             name="jobDescription"
//             control={control}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Job Description</label>
//                 <textarea {...field} className="textarea" placeholder="Job Description" />
//               </div>
//             )}
//           />

//           <Controller
//             name="jobResponsibilities"
//             control={control}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Job Responsibilities</label>
//                 <textarea {...field} className="textarea" placeholder="Job Responsibilities" />
//               </div>
//             )}
//           />

//           <Controller
//             name="keySkillsRequired"
//             control={control}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Key Skills Required</label>
//                 <textarea {...field} className="textarea" placeholder="Key Skills Required" />
//               </div>
//             )}
//           />

//           <Controller
//             name="preferredQualifications"
//             control={control}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Preferred Qualifications</label>
//                 <textarea {...field} className="textarea" placeholder="Preferred Qualifications" />
//               </div>
//             )}
//           />

//           <Controller
//             name="minimumExperienceRequired"
//             control={control}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Minimum Experience Required</label>
//                 <input {...field} type="text" placeholder="Minimum Experience Required" />
//               </div>
//             )}
//           />

//           <Controller
//             name="educationRequirements"
//             control={control}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Education Requirements</label>
//                 <input {...field} type="text" placeholder="Education Requirements" />
//               </div>
//             )}
//           />

//           <Controller
//             name="certificationsRequired"
//             control={control}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Certifications Required</label>
//                 <textarea {...field} className="textarea" placeholder="Certifications Required" />
//               </div>
//             )}
//           />

//           <h2>Company Details</h2>

//           <Controller
//             name="companyName"
//             control={control}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Company Name</label>
//                 <input {...field} type="text" placeholder="Company Name" />
//               </div>
//             )}
//           />

//           <Controller
//             name="companyWebsite"
//             control={control}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Company Website</label>
//                 <input {...field} type="url" placeholder="Company Website" />
//               </div>
//             )}
//           />

//           <Controller
//             name="companyLogo"
//             control={control}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Company Logo URL</label>
//                 <input {...field} type="url" placeholder="Company Logo URL" />
//               </div>
//             )}
//           />

//           <Controller
//             name="companySize"
//             control={control}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Company Size</label>
//                 <Select
//                   {...field}
//                   options={[
//                     { value: '1-10', label: '1-10 employees' },
//                     { value: '11-50', label: '11-50 employees' },
//                     { value: '51-200', label: '51-200 employees' },
//                     { value: '201-500', label: '201-500 employees' },
//                     { value: '501-1000', label: '501-1000 employees' },
//                     { value: '1001+', label: '1001+ employees' },
//                   ]}
//                   placeholder="Select Company Size"
//                 />
//               </div>
//             )}
//           />

//           <Controller
//             name="companyLocation"
//             control={control}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Company Location</label>
//                 <AsyncSelect
//                   {...field}
//                   loadOptions={loadCityOptions}
//                   placeholder="Company Location..."
//                   noOptionsMessage={() => "Type to search cities"}
//                 />
//               </div>
//             )}
//           />

//           <h2>Contact Information</h2>

//           <Controller
//             name="recruiterName"
//             control={control}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Recruiter Name</label>
//                 <input {...field} type="text" placeholder="Recruiter Name" />
//               </div>
//             )}
//           />

//           <Controller
//             name="recruiterContactEmail"
//             control={control}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Recruiter Contact Email</label>
//                 <input {...field} type="email" placeholder="Recruiter Contact Email" />
//               </div>
//             )}
//           />

//           <Controller
//             name="recruiterContactPhoneNumber"
//             control={control}
//             render={({ field }) => (
//               <div className="input-field">
//                 <label>Recruiter Contact Phone Number</label>
//                 <input {...field} type="tel" placeholder="Recruiter Contact Phone Number" />
//               </div>
//             )}
//             />

//             <h2>Job Requirements</h2>
  
//             <Controller
//               name="technicalSkills"
//               control={control}
//               render={({ field }) => (
//                 <div className="input-field">
//                   <label>Technical Skills</label>
//                   <Select
//                     {...field}
//                     isMulti
//                     options={technicalSkillsOptions}
//                     placeholder="Select Technical Skills"
//                   />
//                 </div>
//               )}
//             />
  
//             <Controller
//               name="languagesRequired"
//               control={control}
//               render={({ field }) => (
//                 <div className="input-field">
//                   <label>Languages Required</label>
//                   <input {...field} type="text" placeholder="Languages Required" />
//                 </div>
//               )}
//             />
  
//             <h2>Additional Information</h2>
  
//             <Controller
//               name="benefitsAndPerks"
//               control={control}
//               render={({ field }) => (
//                 <div className="input-field">
//                   <label>Benefits and Perks</label>
//                   <textarea {...field} className="textarea" placeholder="Benefits and Perks" />
//                 </div>
//               )}
//             />
  
//             <Controller
//               name="workingHours"
//               control={control}
//               render={({ field }) => (
//                 <div className="input-field">
//                   <label>Working Hours</label>
//                   <input {...field} type="text" placeholder="Working Hours" />
//                 </div>
//               )}
//             />
  
//             <Controller
//               name="interviewProcessDescription"
//               control={control}
//               render={({ field }) => (
//                 <div className="input-field">
//                   <label>Interview Process Description</label>
//                   <textarea {...field} className="textarea" placeholder="Interview Process Description" />
//                 </div>
//               )}
//             />
  
//             <Controller
//               name="backgroundCheckRequirements"
//               control={control}
//               render={({ field }) => (
//                 <div className="input-field">
//                   <label>Background Check Requirements</label>
//                   <textarea {...field} className="textarea" placeholder="Background Check Requirements" />
//                 </div>
//               )}
//             />
  
//           <div className="input-field">
//             <label>Custom Fields</label>
//             {customFields.map((field, index) => (
//               <div key={index} className="custom-field">
//                 <input
//                   type="text"
//                   placeholder="Field Name"
//                   value={field.key}
//                   onChange={(e) => handleCustomFieldChange(index, 'key', e.target.value)}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Field Value"
//                   value={field.value}
//                   onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
//                 />
//                 <button type="button" onClick={() => removeCustomField(index)}>Remove</button>
//               </div>
//             ))}
//             <button type="button" onClick={addCustomField}>Add Custom Field</button>
//           </div>
  
//             <div className="form-actions">
//               <button type="submit">
//                 {editingJob ? 'Update Job Posting' : 'Create Job Posting'}
//               </button>
//               {!template && (
//                 <button type="button" onClick={handleSaveTemplate}>
//                   Save Template
//                 </button>
//               )}
//               <button type="button" onClick={handlePreview}>Preview</button>
//               <button type="button" onClick={onClose}>Cancel</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };
  
//   export default JobPostingForm;















// import React, { useState, useEffect, useCallback } from 'react';
// import Select from 'react-select';
// import AsyncSelect from 'react-select/async';
// import skillsData from '../../skills.json';
// import { useForm } from 'react-hook-form';
// import { v4 as uuidv4 } from 'uuid';
// import './index.css';

// const technicalSkillsOptions = skillsData.map(skill => ({value : skill.name, label: skill.name}));

// const initialJobPosting = {
//   jobTitle: null,
//   jobLocation: [],
//   jobType: '',
//   department: '',
//   jobLevel: '',
//   salaryRange: { currency: 'USD', min: '', max: '', isVisible: true },
//   jobDescription: '',
//   jobResponsibilities: '',
//   keySkillsRequired: '',
//   preferredQualifications: '',
//   minimumExperienceRequired: '',
//   educationRequirements: '',
//   certificationsRequired: '',
//   companyName: '',
//   companyWebsite: '',
//   companyLogo: '',
//   companySize: '',
//   companyLocation: null,
//   applicationDeadline: '',
//   recruiterName: '',
//   recruiterContactEmail: '',
//   recruiterContactPhoneNumber: '',
//   technicalSkills: [],
//   languagesRequired: '',
//   benefitsAndPerks: '',
//   workingHours: '',
//   interviewProcessDescription: '',
//   backgroundCheckRequirements: '',
//   status: 'active',
//   customFields: []
// };

// const JobPostingForm = (props) => {

//   const {
//     onSubmit,
//     onPreview,
//     onClose,
//     jobOptions,
//     cities,
//     currencies,
//     editingJob,
//     template,
//     setSavedTemplates,
//     setIsPopupOpen,
//     setShowConfirmation,
//   } = props
 
//   const [jobPosting, setJobPosting] = useState(template || initialJobPosting);
//   const [checkedFields, setCheckedFields] = useState({});
  
  
//   useEffect(() => {
//     if (template) {
//       setCheckedFields(
//         Object.keys(template).reduce((acc, key) => {
//           acc[key] = true;
//           return acc;
//         }, {})
//       );
//     }
//   }, [template]);

//   useEffect(() => {
//     if (editingJob) {
//       const customFields = editingJob.customFields
//         ? (Array.isArray(editingJob.customFields)
//           ? editingJob.customFields
//           : Object.entries(editingJob.customFields).map(([key, value]) => ({ key, value })))
//         : [];

//       setJobPosting({
//         ...editingJob,
//         customFields: customFields
//       });
//     }
//   }, [editingJob]);

//   const handleCheckboxChange = (e) => {
//     const { name, checked } = e.target;
//     setCheckedFields((prev) => ({ ...prev, [name]: checked }));
//   };

//   const handleSaveTemplate = () => {
//     if (jobPosting.jobTitle === null){
//       alert("Please fill all mandatory fields!!")
//       return null;
//     }


//     const templateToSave = {
//       ...jobPosting,
//       id: uuidv4(),
//     };
//     setSavedTemplates((prev) => [...prev, templateToSave]);
//     setIsPopupOpen(false);
//     setShowConfirmation(true);
//   };

//   const handleInputChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setJobPosting(prev => ({ ...prev, [name]: value }));
//   }, []);

//   const handleSelectChange = useCallback((selectedOption, { name }) => {
//     setJobPosting(prev => ({ ...prev, [name]: selectedOption }));
//   }, []);

//   const handleSalaryChange = useCallback((e) => {
//     const { name, value, type, checked } = e.target;
//     setJobPosting(prev => ({
//       ...prev,
//       salaryRange: { 
//         ...prev.salaryRange, 
//         [name]: type === 'checkbox' ? checked : (name === 'currency' ? value : value === '' ? '' : Number(value))
//       }
//     }));
//   }, []);

//   const loadCityOptions = useCallback((inputValue, callback) => {
//     setTimeout(() => {
//       const filteredCities = cities
//         .filter(city => city.city_name.toLowerCase().includes(inputValue.toLowerCase()))
//         .slice(0, 100)
//         .map(city => ({ value: city.city_id, label: city.city_name }));
//       callback(filteredCities);
//     }, 300);
//   }, [cities]);

//   const handleCustomFieldChange = useCallback((index, field, value) => {
//     setJobPosting(prev => {
//       const updatedCustomFields = [...(Array.isArray(prev.customFields) ? prev.customFields : [])];
//       updatedCustomFields[index] = { ...updatedCustomFields[index], [field]: value };
//       return { ...prev, customFields: updatedCustomFields };
//     });
//   }, []);

//   const addCustomField = useCallback(() => {
//     setJobPosting(prev => ({
//       ...prev,
//       customFields: [...(Array.isArray(prev.customFields) ? prev.customFields : []), { key: '', value: '' }]
//     }));
//   }, []);

//   const removeCustomField = useCallback((index) => {
//     setJobPosting(prev => ({
//       ...prev,
//       customFields: (Array.isArray(prev.customFields) ? prev.customFields : []).filter((_, i) => i !== index)
//     }));
//   }, []);

//   const handleSubmit = useCallback((e, isDraft = false) => {
//     e.preventDefault();
//     if (!jobPosting.jobTitle || jobPosting.jobLocation.length === 0) {
//       alert('Please fill in all required fields.');
//       return;
//     }
//     const formattedJobPosting = {
//       ...jobPosting,
//       salaryRange: {
//         ...jobPosting.salaryRange,
//         formatted: `${jobPosting.salaryRange.currency} ${jobPosting.salaryRange.min || '0'}-${jobPosting.salaryRange.max || '0'}`
//       },
//       customFields: jobPosting.customFields.reduce((acc, field) => {
//         if (field.key && field.value) acc[field.key] = field.value;
//         return acc;
//       }, {})
//     };
//     onSubmit(formattedJobPosting, isDraft);
//   }, [jobPosting, onSubmit]);

//   const handlePreview = useCallback((e) => {
//     e.preventDefault();
//     if (!jobPosting.jobTitle || jobPosting.jobLocation.length === 0) {
//       alert('Please fill in all required fields.');
//       return;
//     }
//     const previewJobPosting = {
//       ...jobPosting,
//       salaryRange: `${jobPosting.salaryRange.currency} ${jobPosting.salaryRange.min}-${jobPosting.salaryRange.max}`,
//       customFields: jobPosting.customFields.reduce((acc, field) => {
//         if (field.key && field.value) acc[field.key] = field.value;
//         return acc;
//       }, {})
//     };
//     onPreview(previewJobPosting);
//   }, [jobPosting, onPreview]);

//   const renderInputField = useCallback((label, name, type = 'text', options = null, isRequired = false) => (
//     <div className="input-field" key={name}>
//       <label>
//             <input
//               type="checkbox"
//               name={name}
//               checked={checkedFields.name}
//               onChange={handleCheckboxChange}
//             />
//             {label}
//             {(name === "jobTitle" || name === "jobLocations" || name === "jobType") && <span className='star'>*</span>}
//       </label>
//       {options ? (
//         <Select
//           id={name}
//           name={name}
//           value={jobPosting[name]}
//           onChange={(selectedOption) => handleSelectChange(selectedOption, { name })}
//           options={options}
//           placeholder={`Select ${label}`}
//           required={isRequired}
//         />
//       ) : (
//         <input
//           id={name}
//           type={type}
//           name={name}
//           value={jobPosting[name]}
//           onChange={handleInputChange}
//           placeholder={label}
//           required={isRequired}
//         />
//       )}
//     </div>
//   ), [jobPosting, handleInputChange, handleSelectChange]);

//   const renderTextArea = useCallback((label, name) => (
//     <div className="input-field" key={name}>
//       <label>
//           <input
//             type="checkbox"
//             name={name}
//             onChange={handleCheckboxChange}
//           />
//           {label}
//       </label>
//       <textarea
//         id={name}
//         name={name}
//         value={jobPosting[name]}
//         onChange={handleInputChange}
//         placeholder={label}
//         className="textarea"
//       />
//     </div>
//   ), [jobPosting, handleInputChange]);

//   return (
//     <div className="popup-overlay">
//       <div className="popup-content">
//         <h2>{editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}</h2>
//         <form onSubmit={handleSubmit} className="job-posting-form">
//           {renderInputField('Job Title', 'jobTitle', 'select', jobOptions, true)}
          
//           <div className="input-field">
//           <label>
//             <input
//               type="checkbox"
//               name="jobLocations"
//               checked={checkedFields.name}
//               onChange={handleCheckboxChange}
//             />
//             Job Locations
//             <span className='star'>*</span>
//           </label>
//             <AsyncSelect
//               id="jobLocation"
//               isMulti
//               value={jobPosting.jobLocation}
//               onChange={(selectedOptions) => handleSelectChange(selectedOptions, { name: 'jobLocation' })}
//               loadOptions={loadCityOptions}
//               placeholder="Search and select cities..."
//               noOptionsMessage={() => "Type to search cities"}
//             />
//           </div>

//           {renderInputField('Job Type', 'jobType', 'select', [
//             { value: 'Full-Time', label: 'Full-Time' },
//             { value: 'Part-Time', label: 'Part-Time' },
//             { value: 'Contract', label: 'Contract' },
//             { value: 'Temporary', label: 'Temporary' },
//             { value: 'Internship', label: 'Internship' },
//             { value: 'Remote', label: 'Remote' },
//           ], true)}

//           {renderInputField('Department', 'department')}

//           {renderInputField('Job Level', 'jobLevel', 'select', [
//             { value: 'Entry-Level', label: 'Entry-Level' },
//             { value: 'Mid-Level', label: 'Mid-Level' },
//             { value: 'Senior-Level', label: 'Senior-Level' },
//             { value: 'Executive', label: 'Executive' },
//             { value: 'Managerial', label: 'Managerial' },
//           ])}

//           <div className="input-field">
//               <label>
//                 <input
//                   type="checkbox"
//                   name="salaryRange"
//                   onChange={handleCheckboxChange}
//                 />
//                 Salary Range
//               </label>
//             <div className="salary-range">
//               <Select
//                 name="currency"
//                 value={{ value: jobPosting.salaryRange.currency, label: jobPosting.salaryRange.currency }}
//                 onChange={(selectedOption) => handleSalaryChange({ target: { name: 'currency', value: selectedOption.value } })}
//                 options={currencies.map(curr => ({ value: curr, label: curr }))}
//                 placeholder="Currency"
//                 className="currency-select"
//               />
//               <input
//                 type="number"
//                 name="min"
//                 value={jobPosting.salaryRange.min}
//                 onChange={handleSalaryChange}
//                 placeholder="Min Salary"
//                 className="salary-input"
//               />
//               <input
//                 type="number"
//                 name="max"
//                 value={jobPosting.salaryRange.max}
//                 onChange={handleSalaryChange}
//                 placeholder="Max Salary"
//                 className="salary-input"
//               />
//               <label className="salary-visibility">
//                 <input
//                   type="checkbox"
//                   name="isVisible"
//                   checked={jobPosting.salaryRange.isVisible}
//                   onChange={handleSalaryChange}
//                 />
//                 Visible to candidates
//               </label>
//             </div>
//           </div>
          
//           {renderInputField('Application Deadline', 'applicationDeadline', 'date')}
//           {renderTextArea('Job Description', 'jobDescription')}
//           {renderTextArea('Job Responsibilities', 'jobResponsibilities')}
//           {renderTextArea('Key Skills Required', 'keySkillsRequired')}
//           {renderTextArea('Preferred Qualifications', 'preferredQualifications')}
//           {renderInputField('Minimum Experience Required', 'minimumExperienceRequired')}
//           {renderInputField('Education Requirements', 'educationRequirements')}
//           {renderTextArea('Certifications Required', 'certificationsRequired')}

//           <h2>Company Details</h2>
//           {renderInputField('Company Name', 'companyName')}
//           {renderInputField('Company Website', 'companyWebsite', 'url')}
//           {renderInputField('Company Logo URL', 'companyLogo', 'url')}
//           {renderInputField('Company Size', 'companySize', 'select', [
//             { value: '1-10', label: '1-10 employees' },
//             { value: '11-50', label: '11-50 employees' },
//             { value: '51-200', label: '51-200 employees' },
//             { value: '201-500', label: '201-500 employees' },
//             { value: '501-1000', label: '501-1000 employees' },
//             { value: '1001+', label: '1001+ employees' },
//           ])}

//           <div className="input-field">
//             <label>
//                 <input
//                   type="checkbox"
//                   name="companyLocation"
//                   onChange={handleCheckboxChange}
//                 />
//                 Company Location
//               </label>
//             <AsyncSelect
//               id="companyLocation"
//               name="companyLocation"
//               value={jobPosting.companyLocation}
//               onChange={(selectedOption) => handleSelectChange(selectedOption, { name: 'companyLocation' })}
//               loadOptions={loadCityOptions}
//               placeholder="Company Location..."
//               noOptionsMessage={() => "Type to search cities"}
//             />
//           </div>

//           <h2>Contact Information</h2>
//           {renderInputField('Recruiter Name', 'recruiterName')}
//           {renderInputField('Recruiter Contact Email', 'recruiterContactEmail', 'email')}
//           {renderInputField('Recruiter Contact Phone Number', 'recruiterContactPhoneNumber', 'tel')}

//           <h2>Job Requirements</h2>
//           <div className="input-field">
//             <label>
//                 <input
//                   type="checkbox"
//                   name="technicalSkills"
//                   onChange={handleCheckboxChange}
//                 />
//                  Technical Skills
//               </label>
//             <Select
//               id="technicalSkills"
//               name="technicalSkills"
//               isMulti
//               value={jobPosting.technicalSkills}
//               onChange={(selectedOptions) => handleSelectChange(selectedOptions, { name: 'technicalSkills' })}
//               options={technicalSkillsOptions}
//               placeholder="Select Technical Skills"
//             />
//           </div>

//           {renderInputField('Languages Required', 'languagesRequired')}

//           <h2>Additional Information</h2>
//           {renderTextArea('Benefits and Perks', 'benefitsAndPerks')}
//           {renderInputField('Working Hours', 'workingHours')}
//           {renderTextArea('Interview Process Description', 'interviewProcessDescription')}
//           {renderTextArea('Background Check Requirements', 'backgroundCheckRequirements')}

//           <div className="input-field">
//             <label>Custom Fields</label>
//             {(Array.isArray(jobPosting.customFields) ? jobPosting.customFields : []).map((field, index) => (
//                 <div key={index} className="custom-field">
//                   <input
//                     type="text"
//                     placeholder="Field Name"
//                     value={field.key}
//                     onChange={(e) => handleCustomFieldChange(index, 'key', e.target.value)}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Field Value"
//                     value={field.value}
//                     onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
//                   />
//                   <button type="button" onClick={() => removeCustomField(index)}>Remove</button>
//                 </div>
//               ))}
//             <button type="button" onClick={addCustomField}>Add Custom Field</button>
//           </div>

//           <div className="form-actions">
//             <button type="submit">
//               {editingJob ? 'Update Job Posting' : 'Create Job Posting'}
//             </button>
//             {!template && (
//                 <button type="button" onClick={handleSaveTemplate}>
//                   Save Template
//                 </button>
//             )}
//             <button type="button" onClick={handlePreview}>Preview</button>
//             <button type="button" onClick={onClose}>Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default JobPostingForm;
