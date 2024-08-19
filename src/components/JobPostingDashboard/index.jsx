import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import cityData from '../data/cities.json';
import jobList from '../data/jobRoles.json';
import currencyData from '../data/currencies.json';
import JobPostingForm from '../JobPostingForm';
import JobPostingPreview from '../JobPostingPreview';
import AuditTrail from '../AuditTrail';
import TemplateSelector from '../TemplateSelecter';
import TopControls from '../TopControls';
import JobPostingsTable from '../JobPostingsTable';
import Pagination from '../Pagination';
import ConfirmationDialog from '../ConfirmationDialog';
import { JobPostingManagement, JobPostingDashboardContainer, Title } from './styledComponents.js';

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
    <JobPostingManagement>
      <JobPostingDashboardContainer>
        <Title>Job Postings</Title>

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
          
        <ConfirmationDialog
          show={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onCreateAnother={handleOpenNewJobForm}
        />
                                      
        <TopControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          onCreateNewJob={handleOpenNewJobForm}
        />
                
        <JobPostingsTable
          jobPostings={currentPosts}
          onStatusChange={handleStatusChange}
          onPreview={handlePreviewJobPosting}
          onEdit={handleOpenEditJobForm}
          onDelete={handleDeletePosting}
          onDuplicate={handleDuplicatePosting}
        />

        <Pagination
          currentPage={currentPage}
          totalPosts={filteredJobPostings.length}
          postsPerPage={postsPerPage}
          paginate={paginate}
        />
      </JobPostingDashboardContainer>
      <AuditTrail auditTrail={auditTrail} />
    </JobPostingManagement>
  );
};

export default JobPostingDashboard;

