import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import cityData from '../../cities.json';
import jobList from '../../jobRoles.json';
import currencyData from '../../currencies.json';
import { Eye, Edit, Trash2, Copy } from 'lucide-react';
import { GrLinkPrevious , GrLinkNext } from "react-icons/gr";
import JobPostingForm from '../JobPostingForm';
import JobPostingPreview from '../JobPostingPreview';
import AuditTrail from '../AuditTrail';
import TemplateSelector from '../TemplateSelecter';
import './index.css';

const cities = cityData[2].data;
const currencies = currencyData.map(cur => cur.code);

const JobPostingDashboard = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [previewJobPosting, setPreviewJobPosting] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [auditTrail, setAuditTrail] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateWithTemplate, setIsCreateWithTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const postsPerPage = 10;

  useEffect(() => {
    const savedJobPostings = JSON.parse(localStorage.getItem('jobPostings')) || [];
    setJobPostings(savedJobPostings);
  }, []);

  useEffect(() => {
    localStorage.setItem('jobPostings', JSON.stringify(jobPostings));
  }, [jobPostings]);

  const handlePreviewJobPosting = (jobPosting) => {
    setPreviewJobPosting(jobPosting);
  };

  const handleClosePreview = () => {
    setPreviewJobPosting(null);
  };

  const handleStatusChange = (id, newStatus) => {
    setJobPostings(prev =>
      prev.map(posting =>
        posting.id === id ? { ...posting, status: newStatus } : posting
      )
    );
    addToAuditTrail(id, 'Status Change', `Status changed to ${newStatus}`);
  };

  const handleDeletePosting = (id) => {
    setJobPostings(prev => prev.filter(posting => posting.id !== id));
    addToAuditTrail(id, 'Deletion', 'Job posting deleted');
    setPreviewJobPosting(null);
  };

  const handleDuplicatePosting = (posting) => {
    const duplicatedPosting = { ...posting, id: uuidv4() };
    setJobPostings(prev => [...prev, duplicatedPosting]);
    addToAuditTrail(duplicatedPosting.id, 'Duplication', `Duplicated from job posting ${posting.id}`);
  };

  const handleCreateJobPosting = (newJobPosting, isDraft = false) => {
    const jobPostingWithId = { 
      ...newJobPosting, 
      id: uuidv4(),
      status: isDraft ? 'draft' : 'active',
      customFields: newJobPosting.customFields || [],
      salaryRange: {
        ...newJobPosting.salaryRange,
        formatted: `${newJobPosting.salaryRange.currency} ${newJobPosting.salaryRange.min || '0'}-${newJobPosting.salaryRange.max || '0'}`
      }
    };
    setJobPostings(prev => [jobPostingWithId , ...prev]);
    setIsPopupOpen(false);
    setShowConfirmation(true);
    addToAuditTrail(jobPostingWithId.id, 'Creation', `New job posting ${isDraft ? 'saved as draft' : 'published'}`);
  };
  
  const handleEditJobPosting = (updatedJobPosting, isDraft = false) => {
    const editedPosting = {
      ...updatedJobPosting,
      status: isDraft ? 'draft' : updatedJobPosting.status,
      salaryRange: {
        ...updatedJobPosting.salaryRange,
        formatted: `${updatedJobPosting.salaryRange.currency} ${updatedJobPosting.salaryRange.min || '0'}-${updatedJobPosting.salaryRange.max || '0'}`
      }
    };
    setJobPostings(prev =>
      prev.map(posting =>
        posting.id === editedPosting.id ? editedPosting : posting
      )
    );
    setIsPopupOpen(false);
    setShowConfirmation(true);
    setEditingJob(null);
    addToAuditTrail(editedPosting.id, 'Edit', `Job posting ${isDraft ? 'saved as draft' : 'updated'}`);
  };

  const addToAuditTrail = (jobId, action, description) => {
    const auditEntry = {
      id: uuidv4(),
      jobId,
      action,
      description,
      timestamp: new Date().toISOString(),
      recruiter: 'Current User',
    };
    setAuditTrail(prev => [auditEntry, ...prev]);
  };

  const handleOpenNewJobForm = () => {
    if (savedTemplates.length === 0) {
      setIsPopupOpen(true);
      setShowConfirmation(false);
      setEditingJob(null);
    } else {
      setIsCreateWithTemplate(true);
    }
  };

  const handleOpenEditJobForm = (jobPosting) => {
    setEditingJob(jobPosting);
    setIsPopupOpen(true);
    setShowConfirmation(false);
  };

  const filteredJobPostings = jobPostings.filter(posting =>
    (filterStatus === 'all' || posting.status === filterStatus) &&
    posting.jobTitle.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredJobPostings.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="job-posting-management">
      <div className="job-posting-dashboard">
        <h1>Job Postings</h1>

        {isCreateWithTemplate && (
            <TemplateSelector
              onSelect={(template) => {
                setSelectedTemplate(template);
                setIsCreateWithTemplate(false);
                setIsPopupOpen(true);
              }}
              onCancel={() => setIsCreateWithTemplate(false)}
              savedTemplates={savedTemplates}
            />
        )}

        {isPopupOpen && (
          <JobPostingForm
            onSubmit={editingJob ? handleEditJobPosting : handleCreateJobPosting}
            onPreview={handlePreviewJobPosting}
            onClose={() => {
              setIsPopupOpen(false);
              setEditingJob(null);
              setSelectedTemplate(null);
            }}
            jobOptions={jobList.map((job) => ({ value: job, label: job }))}
            cities={cities}
            currencies={currencies}
            editingJob={editingJob}
            template={selectedTemplate}
            savedTemplates={savedTemplates}
            setSavedTemplates={setSavedTemplates}
            setIsPopupOpen={setIsPopupOpen}
            setShowConfirmation={setShowConfirmation}
          />
        )}
          
          {previewJobPosting && (
          <JobPostingPreview
            jobPosting={previewJobPosting}
            onClose={handleClosePreview}
          />
        )}
          
        {showConfirmation && (
          <div className="confirmation-message">
            <p className="confirmation-para">Job Posting {editingJob ? 'Updated' : 'Created'} Successfully!</p>
            <div>
              <button onClick={handleOpenNewJobForm}>Create Another Job</button>
              <button onClick={() => setShowConfirmation(false)}>Close</button>
            </div>
          </div>
        )}
                                      
        <div className="top-controls">
          <input
            type="text"
            placeholder="Search job roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="job-status"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
          
          <button className="create-job-button" onClick={handleOpenNewJobForm}>
            Create New Job
          </button>
        </div>             
                
        <table className="job-postings-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Job Role</th>
              <th>Application Deadline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map(posting => (
              <tr key={posting.id}>
                <td className="company-cell">
                  <img src={posting.companyLogo || "/api/placeholder/40/40"} alt="Company Logo" className="company-logo" />
                  <span className="company-name">{posting.companyName}</span>
                </td>
                <td>{posting.jobTitle.label}</td>
                <td>{posting.applicationDeadline}</td>
                <td>
                  <select
                    value={posting.status}
                    onChange={(e) => handleStatusChange(posting.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                </td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handlePreviewJobPosting(posting)} className="action-button" title="View">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleOpenEditJobForm(posting)} className="action-button" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDeletePosting(posting.id)} className="action-button" title="Delete">
                      <Trash2 size={18} />
                    </button>
                    <button onClick={() => handleDuplicatePosting(posting)} className="action-button" title="Duplicate">
                      <Copy size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentPosts.length === 0 && (
          <div className="no-jobs-message">No job postings found</div>
        )}
                                      
        <div className="pagination">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-arrow"
          >
            <GrLinkPrevious />
          </button>
          
          {Array.from({ length: Math.ceil(filteredJobPostings.length / postsPerPage) }, (_, i) => (
            <button 
              key={i} 
              onClick={() => paginate(i + 1)} 
              className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === Math.ceil(filteredJobPostings.length / postsPerPage)}
            className="pagination-arrow"
          >
            <GrLinkNext />
          </button>
        </div>
        
      </div>
      <AuditTrail auditTrail={auditTrail} />
    </div>
  );
};

export default JobPostingDashboard;



// import React, { useState, useEffect } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import cityData from '../../cities.json';
// import jobList from '../../jobRoles.json';
// import currencyData from '../../currencies.json';
// import { Eye, Edit, Trash2, Copy } from 'lucide-react';
// import { GrLinkPrevious , GrLinkNext } from "react-icons/gr";
// import JobPostingForm from '../JobPostingForm';
// import JobPostingPreview from '../JobPostingPreview';
// import AuditTrail from '../AuditTrail';
// import TemplateSelector from '../TemplateSelecter';
// import './index.css';

// const cities = cityData[2].data;
// const currencies = currencyData.map(cur => cur.code);

// const JobPostingDashboard = () => {
//   const [jobPostings, setJobPostings] = useState([]);
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [previewJobPosting, setPreviewJobPosting] = useState(null);
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [editingJob, setEditingJob] = useState(null);
//   const [auditTrail, setAuditTrail] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isCreateWithTemplate, setIsCreateWithTemplate] = useState(false);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [savedTemplates, setSavedTemplates] = useState([]);
//   const postsPerPage = 10;

//   useEffect(() => {
//     const savedJobPostings = JSON.parse(localStorage.getItem('jobPostings')) || [];
//     setJobPostings(savedJobPostings);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('jobPostings', JSON.stringify(jobPostings));
//   }, [jobPostings]);

//   const handlePreviewJobPosting = (jobPosting) => {
//     setPreviewJobPosting(jobPosting);
//   };

//   const handleClosePreview = () => {
//     setPreviewJobPosting(null);
//   };

//   const handleStatusChange = (id, newStatus) => {
//     setJobPostings(prev =>
//       prev.map(posting =>
//         posting.id === id ? { ...posting, status: newStatus } : posting
//       )
//     );
//     addToAuditTrail(id, 'Status Change', `Status changed to ${newStatus}`);
//   };

//   const handleDeletePosting = (id) => {
//     setJobPostings(prev => prev.filter(posting => posting.id !== id));
//     addToAuditTrail(id, 'Deletion', 'Job posting deleted');
//     setPreviewJobPosting(null);
//   };

//   const handleDuplicatePosting = (posting) => {
//     const duplicatedPosting = { ...posting, id: uuidv4() };
//     setJobPostings(prev => [...prev, duplicatedPosting]);
//     addToAuditTrail(duplicatedPosting.id, 'Duplication', `Duplicated from job posting ${posting.id}`);
//   };

//   const handleCreateJobPosting = (newJobPosting, isDraft = false) => {
//     const jobPostingWithId = { 
//       ...newJobPosting, 
//       id: uuidv4(),
//       status: isDraft ? 'draft' : 'active',
//       customFields: newJobPosting.customFields || [],
//       salaryRange: {
//         ...newJobPosting.salaryRange,
//         formatted: `${newJobPosting.salaryRange.currency} ${newJobPosting.salaryRange.min || '0'}-${newJobPosting.salaryRange.max || '0'}`
//       }
//     };
//     setJobPostings(prev => [jobPostingWithId , ...prev]);
//     setIsPopupOpen(false);
//     setShowConfirmation(true);
//     addToAuditTrail(jobPostingWithId.id, 'Creation', `New job posting ${isDraft ? 'saved as draft' : 'published'}`);
//   };
  
//   const handleEditJobPosting = (updatedJobPosting, isDraft = false) => {
//     const editedPosting = {
//       ...updatedJobPosting,
//       status: isDraft ? 'draft' : updatedJobPosting.status,
//       salaryRange: {
//         ...updatedJobPosting.salaryRange,
//         formatted: `${updatedJobPosting.salaryRange.currency} ${updatedJobPosting.salaryRange.min || '0'}-${updatedJobPosting.salaryRange.max || '0'}`
//       }
//     };
//     setJobPostings(prev =>
//       prev.map(posting =>
//         posting.id === editedPosting.id ? editedPosting : posting
//       )
//     );
//     setIsPopupOpen(false);
//     setShowConfirmation(true);
//     setEditingJob(null);
//     addToAuditTrail(editedPosting.id, 'Edit', `Job posting ${isDraft ? 'saved as draft' : 'updated'}`);
//   };

//   const addToAuditTrail = (jobId, action, description) => {
//     const auditEntry = {
//       id: uuidv4(),
//       jobId,
//       action,
//       description,
//       timestamp: new Date().toISOString(),
//       recruiter: 'Current User',
//     };
//     setAuditTrail(prev => [auditEntry, ...prev]);
//   };

//   const handleOpenNewJobForm = () => {
//     if (savedTemplates.length === 0) {
//       setIsPopupOpen(true);
//       setShowConfirmation(false);
//       setEditingJob(null);
//     } else {
//       setIsCreateWithTemplate(true);
//     }
//   };

//   const handleOpenEditJobForm = (jobPosting) => {
//     setEditingJob(jobPosting);
//     setIsPopupOpen(true);
//     setShowConfirmation(false);
//   };

//   const filteredJobPostings = jobPostings.filter(posting =>
//     (filterStatus === 'all' || posting.status === filterStatus) &&
//     posting.jobTitle.label.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const indexOfLastPost = currentPage * postsPerPage;
//   const indexOfFirstPost = indexOfLastPost - postsPerPage;
//   const currentPosts = filteredJobPostings.slice(indexOfFirstPost, indexOfLastPost);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <div className="job-posting-management">
//       <div className="job-posting-dashboard">
//         <h1>Job Postings</h1>

//         {isCreateWithTemplate && (
//             <TemplateSelector
//               onSelect={(template) => {
//                 setSelectedTemplate(template);
//                 setIsCreateWithTemplate(false);
//                 setIsPopupOpen(true);
//               }}
//               onCancel={() => setIsCreateWithTemplate(false)}
//               savedTemplates={savedTemplates}
//             />
//         )}

//         {isPopupOpen && (
//           <JobPostingForm
//             onSubmit={editingJob ? handleEditJobPosting : handleCreateJobPosting}
//             onPreview={handlePreviewJobPosting}
//             onClose={() => {
//               setIsPopupOpen(false);
//               setEditingJob(null);
//               setSelectedTemplate(null);
//             }}
//             jobOptions={jobList.map((job) => ({ value: job, label: job }))}
//             cities={cities}
//             currencies={currencies}
//             editingJob={editingJob}
//             template={selectedTemplate}
//             savedTemplates={savedTemplates}
//             setSavedTemplates={setSavedTemplates}
//             setIsPopupOpen={setIsPopupOpen}
//             setShowConfirmation={setShowConfirmation}
//           />
//         )}
          
//           {previewJobPosting && (
//           <JobPostingPreview
//             jobPosting={previewJobPosting}
//             onClose={handleClosePreview}
//           />
//         )}
          
//         {showConfirmation && (
//           <div className="confirmation-message">
//             <p className="confirmation-para">Job Posting {editingJob ? 'Updated' : 'Created'} Successfully!</p>
//             <div>
//               <button onClick={handleOpenNewJobForm}>Create Another Job</button>
//               <button onClick={() => setShowConfirmation(false)}>Close</button>
//             </div>
//           </div>
//         )}
                                      
//         <div className="top-controls">
//           <input
//             type="text"
//             placeholder="Search job roles..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//           <select
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//             className="job-status"
//           >
//             <option value="all">All</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//             <option value="closed">Closed</option>
//             <option value="draft">Draft</option>
//           </select>
          
//           <button className="create-job-button" onClick={handleOpenNewJobForm}>
//             Create New Job
//           </button>
//         </div>             
                
//         <table className="job-postings-table">
//           <thead>
//             <tr>
//               <th>Company</th>
//               <th>Job Role</th>
//               <th>Application Deadline</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentPosts.map(posting => (
//               <tr key={posting.id}>
//                 <td className="company-cell">
//                   <img src={posting.companyLogo || "/api/placeholder/40/40"} alt="Company Logo" className="company-logo" />
//                   <span className="company-name">{posting.companyName}</span>
//                 </td>
//                 <td>{posting.jobTitle.label}</td>
//                 <td>{posting.applicationDeadline}</td>
//                 <td>
//                   <select
//                     value={posting.status}
//                     onChange={(e) => handleStatusChange(posting.id, e.target.value)}
//                     className="status-select"
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                     <option value="closed">Closed</option>
//                     <option value="draft">Draft</option>
//                   </select>
//                 </td>
//                 <td>
//                   <div className="action-buttons">
//                     <button onClick={() => handlePreviewJobPosting(posting)} className="action-button" title="View">
//                       <Eye size={18} />
//                     </button>
//                     <button onClick={() => handleOpenEditJobForm(posting)} className="action-button" title="Edit">
//                       <Edit size={18} />
//                     </button>
//                     <button onClick={() => handleDeletePosting(posting.id)} className="action-button" title="Delete">
//                       <Trash2 size={18} />
//                     </button>
//                     <button onClick={() => handleDuplicatePosting(posting)} className="action-button" title="Duplicate">
//                       <Copy size={18} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {currentPosts.length === 0 && (
//           <div className="no-jobs-message">No job postings found</div>
//         )}
                                      
//         <div className="pagination">
//           <button 
//             onClick={() => paginate(currentPage - 1)} 
//             disabled={currentPage === 1}
//             className="pagination-arrow"
//           >
//             <GrLinkPrevious />
//           </button>
          
//           {Array.from({ length: Math.ceil(filteredJobPostings.length / postsPerPage) }, (_, i) => (
//             <button 
//               key={i} 
//               onClick={() => paginate(i + 1)} 
//               className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
//             >
//               {i + 1}
//             </button>
//           ))}
          
//           <button 
//             onClick={() => paginate(currentPage + 1)} 
//             disabled={currentPage === Math.ceil(filteredJobPostings.length / postsPerPage)}
//             className="pagination-arrow"
//           >
//             <GrLinkNext />
//           </button>
//         </div>
        
//       </div>
//       <AuditTrail auditTrail={auditTrail} />
//     </div>
//   );
// };

// export default JobPostingDashboard;