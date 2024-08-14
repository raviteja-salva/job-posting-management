import React from 'react';
import './index.css';

const JobPostingPreview = ({ jobPosting, onClose }) => {
  if (!jobPosting) {
    return null;
  }

  const renderField = (label, value) => {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    
    let displayValue;
    if (label === 'Salary Range') {
      displayValue = value.formatted || 'Not specified';
    } else {
      displayValue = typeof value === 'object' && value !== null
        ? (value.label || JSON.stringify(value))
        : value;
    }
    return <p key={label}><strong>{label}:</strong> {displayValue}</p>;
  };

  const renderArrayField = (label, array, key = 'label') => {
    if (!Array.isArray(array) || array.length === 0) {
      return null;
    }
    const displayValue = array.map(item => 
      typeof item === 'object' && item !== null ? (item[key] || JSON.stringify(item)) : item
    ).join(', ');
    return <p key={label}><strong>{label}:</strong> {displayValue}</p>;
  };

  const renderCustomFields = () => {
    if (!jobPosting.customFields) return null;
    
    if (Array.isArray(jobPosting.customFields)) {
      return jobPosting.customFields.map((field, index) => 
        renderField(field.key, field.value, `custom-${index}`)
      );
    } else if (typeof jobPosting.customFields === 'object') {
      return Object.entries(jobPosting.customFields).map(([key, value], index) => 
        renderField(key, value.value, `custom-${index}`)
      );
    }
    
    return null;
  };

  return (
    <div className="preview-overlay">
      <div className="preview-content">
        <h1>Job Posting Preview</h1>
        <div className="preview-job-posting">
          {renderField('Job Title', jobPosting.jobTitle)}
          {renderField('Company', jobPosting.companyName)}
          {renderArrayField('Location', jobPosting.jobLocation)}
          {renderArrayField('Job Type', jobPosting.jobType)}
          {renderField('Department', jobPosting.department)}
          {renderField('Job Level', jobPosting.jobLevel)}
          {renderField('Salary Range', jobPosting.salaryRange ? 
            `${jobPosting.salaryRange.currency} ${jobPosting.salaryRange.min}-${jobPosting.salaryRange.max}` : 
            null
          )}
           {renderField('Application Deadline', jobPosting.applicationDeadline)}
          {renderField('Job Description', jobPosting.jobDescription)}
          {renderField('Job Responsibilities', jobPosting.jobResponsibilities)}
          {renderField('Key Skills Required', jobPosting.keySkillsRequired)}
          {renderField('Preferred Qualifications', jobPosting.preferredQualifications)}
          {renderField('Minimum Experience Required', jobPosting.minimumExperienceRequired)}
          {renderField('Education Requirements', jobPosting.educationRequirements)}
          {renderField('Certifications Required', jobPosting.certificationsRequired)}

          

          {renderField('Company Website', jobPosting.companyWebsite)}
          {renderField('Company Size', jobPosting.companySize)}
          {renderField('Company Location', jobPosting.companyLocation)}
          
          

          {renderField('Recruiter Name', jobPosting.recruiterName)}
          {renderField('Recruiter Contact Email', jobPosting.recruiterContactEmail)}
          {renderField('Recruiter Contact Phone', jobPosting.recruiterContactPhoneNumber)}

          {renderArrayField('Technical Skills', jobPosting.technicalSkills)}
          {renderArrayField('Languages Required', jobPosting.languagesRequired)}

          {renderField('Benefits and Perks', jobPosting.benefitsAndPerks)}
          {renderField('Working Hours', jobPosting.workingHours)}
          {renderField('Interview Process', jobPosting.interviewProcessDescription)}
          {renderField('Background Check Requirements', jobPosting.backgroundCheckRequirements)}
          {renderField('Status', jobPosting.status)}
          {renderCustomFields()}
        </div>
        
        <button onClick={onClose}>Close</button>
        
      </div>
    </div>
  );
};

export default JobPostingPreview;










// import React from 'react';
// import './index.css';

// const JobPostingPreview = ({ jobPosting, onClose }) => {
//   if (!jobPosting) {
//     return null;
//   }

//   const renderField = (label, value) => {
//     if (value === undefined || value === null || value === '') {
//       return null;
//     }
    
//     let displayValue;
//     if (label === 'Salary Range') {
//       displayValue = value.formatted || 'Not specified';
//     } else {
//       displayValue = typeof value === 'object' && value !== null
//         ? (value.label || JSON.stringify(value))
//         : value;
//     }
//     return <p key={label}><strong>{label}:</strong> {displayValue}</p>;
//   };

//   const renderArrayField = (label, array, key = 'label') => {
//     if (!Array.isArray(array) || array.length === 0) {
//       return null;
//     }
//     const displayValue = array.map(item => 
//       typeof item === 'object' && item !== null ? (item[key] || JSON.stringify(item)) : item
//     ).join(', ');
//     return <p key={label}><strong>{label}:</strong> {displayValue}</p>;
//   };

//   const renderCustomFields = () => {
//     if (!jobPosting.customFields) return null;
    
//     if (Array.isArray(jobPosting.customFields)) {
//       return jobPosting.customFields.map((field, index) => 
//         renderField(`Custom Field ${index + 1}`, `${field.key}: ${field.value}`, `custom-${index}`)
//       );
//     } else if (typeof jobPosting.customFields === 'object') {
//       return Object.entries(jobPosting.customFields).map(([key, value], index) => 
//         renderField(`Custom Field ${index + 1}`, `${key}: ${value}`, `custom-${index}`)
//       );
//     }
    
//     return null;
//   };

//   return (
//     <div className="preview-overlay">
//       <div className="preview-content">
//         <h1>Job Posting Preview</h1>
//         <div className="preview-job-posting">
//           {renderField('Job Title', jobPosting.jobTitle)}
//           {renderField('Company', jobPosting.companyName)}
//           {renderArrayField('Location', jobPosting.jobLocation)}
//           {renderArrayField('Job Type', jobPosting.jobType)}
//           {renderField('Department', jobPosting.department)}
//           {renderField('Job Level', jobPosting.jobLevel)}
//           {renderField('Salary Range', jobPosting.salaryRange ? 
//             `${jobPosting.salaryRange.currency} ${jobPosting.salaryRange.min}-${jobPosting.salaryRange.max}` : 
//             null
//           )}
//            {renderField('Application Deadline', jobPosting.applicationDeadline)}
//           {renderField('Job Description', jobPosting.jobDescription)}
//           {renderField('Job Responsibilities', jobPosting.jobResponsibilities)}
//           {renderField('Key Skills Required', jobPosting.keySkillsRequired)}
//           {renderField('Preferred Qualifications', jobPosting.preferredQualifications)}
//           {renderField('Minimum Experience Required', jobPosting.minimumExperienceRequired)}
//           {renderField('Education Requirements', jobPosting.educationRequirements)}
//           {renderField('Certifications Required', jobPosting.certificationsRequired)}

          

//           {renderField('Company Website', jobPosting.companyWebsite)}
//           {renderField('Company Size', jobPosting.companySize)}
//           {renderField('Company Location', jobPosting.companyLocation)}
          
          

//           {renderField('Recruiter Name', jobPosting.recruiterName)}
//           {renderField('Recruiter Contact Email', jobPosting.recruiterContactEmail)}
//           {renderField('Recruiter Contact Phone', jobPosting.recruiterContactPhoneNumber)}

//           {renderArrayField('Technical Skills', jobPosting.technicalSkills)}
//           {renderArrayField('Languages Required', jobPosting.languagesRequired)}

//           {renderField('Benefits and Perks', jobPosting.benefitsAndPerks)}
//           {renderField('Working Hours', jobPosting.workingHours)}
//           {renderField('Interview Process', jobPosting.interviewProcessDescription)}
//           {renderField('Background Check Requirements', jobPosting.backgroundCheckRequirements)}
//           {renderField('Status', jobPosting.status)}
//           {renderCustomFields()}
//         </div>
        
//         <button onClick={onClose}>Close</button>
        
//       </div>
//     </div>
//   );
// };

// export default JobPostingPreview;
