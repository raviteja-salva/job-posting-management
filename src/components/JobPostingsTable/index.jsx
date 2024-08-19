import React from 'react';
import { Eye, Edit, Trash2, Copy, FileText } from 'lucide-react';
import { JobPostingsTable, CompanyCell, CompanyLogo, CompanyName, StatusSelect, ActionButtons, ActionButton } from './styledComponents.js';
import { useNavigate } from 'react-router-dom';

const JobPostingsTableComponent = ({ jobPostings, onStatusChange, onPreview, onEdit, onDelete, onDuplicate }) => {
  const navigate = useNavigate();

  return (
    <JobPostingsTable>
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
        {jobPostings.map(posting => (
          <tr key={posting.id}>
            <CompanyCell>
              <CompanyLogo src={posting.companyLogo || "/api/placeholder/40/40"} alt="Company Logo" />
              <CompanyName>{posting.companyName}</CompanyName>
            </CompanyCell>
            <td>{posting.jobTitle.label}</td>
            <td>{posting.applicationDeadline}</td>
            <td>
              <StatusSelect
                value={posting.status}
                onChange={(e) => onStatusChange(posting.id, e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </StatusSelect>
            </td>
            <td>
              <ActionButtons>
                <ActionButton onClick={() => onPreview(posting)} title="View">
                  <Eye size={18} />
                </ActionButton>
                <ActionButton onClick={() => onEdit(posting)} title="Edit">
                  <Edit size={18} />
                </ActionButton>
                <ActionButton onClick={() => onDelete(posting.id)} title="Delete">
                  <Trash2 size={18} />
                </ActionButton>
                <ActionButton onClick={() => onDuplicate(posting)} title="Duplicate">
                  <Copy size={18} />
                </ActionButton>
                <ActionButton onClick={() => navigate(`/job-applications/${posting.id}`)} title="View Applications">
                  <FileText size={18} />
                </ActionButton>
              </ActionButtons>
            </td>
          </tr>
        ))}
      </tbody>
    </JobPostingsTable>
  );
};

export default JobPostingsTableComponent;