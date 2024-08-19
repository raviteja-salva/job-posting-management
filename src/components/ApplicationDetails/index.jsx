import React from 'react';
import {ModalOverlay, ModalContent, ProfileSection, SectionTitle, Button, ShortlistButton, ApplicationHistoryTable, TableHeader, TableCell} from './styledComponents.js';

const ApplicationDetails = ({ candidate, onClose, onShortlist, isShortlisted }) => {
  const handleViewResume = () => {
    window.open(candidate.resume, '_blank');
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>{candidate.name}'s Profile</h2>
        <ProfileSection>
          <SectionTitle>Professional Summary</SectionTitle>
          <p>{candidate.summary}</p>
        </ProfileSection>
        <ProfileSection>
          <SectionTitle>Contact Information</SectionTitle>
          <p>Location: {candidate.location}</p>
          <p>Email: {candidate.email}</p>
          <p>Phone: {candidate.phone}</p>
          {candidate.linkedin_url !== "" && <p>LinkedIn: <a href={candidate.linkedin_url} rel="noreferrer" target="_blank">View LinkedIn Profile</a></p>}
          {candidate.portfolio_website !== "" && <p>Portfolio: <a href={candidate.portfolio_website} rel="noreferrer" target="_blank">View Portfolio</a></p>}
        </ProfileSection>
        <ProfileSection>
          <SectionTitle>Education</SectionTitle>
          <p>Degree: {candidate.highest_degree_obtained}</p>
          <p>Graduation: {candidate.graduation_period}</p>
          <p>GPA: {candidate.gpa}</p>
        </ProfileSection>
        <ProfileSection>
          <SectionTitle>Skills</SectionTitle>
          <ul>
            {candidate.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </ProfileSection>
        <ProfileSection>
          <SectionTitle>Additional Information</SectionTitle>
          <p>Location: {candidate.location}</p>
          <p>Willing to Relocate: {candidate.willing_to_relocate}</p>
          <p>Willing to Travel: {candidate.willing_to_travel}</p>
        </ProfileSection>
        <SectionTitle>Application History</SectionTitle>
          <ApplicationHistoryTable>
            <thead>
              <tr>
                <TableHeader>Job Title</TableHeader>
                <TableHeader>Applied Date</TableHeader>
                <TableHeader>Status</TableHeader>
              </tr>
            </thead>
            <tbody>
              {candidate.applicationHistory.map((application, index) => (
                <tr key={index}>
                  <TableCell>{application.jobTitle}</TableCell>
                  <TableCell>{application.appliedDate}</TableCell>
                  <TableCell>{application.status}</TableCell>
                </tr>
              ))}
            </tbody>
          </ApplicationHistoryTable>
        <Button onClick={handleViewResume}>View Resume</Button>
        <ShortlistButton 
          onClick={() => onShortlist(candidate.id)} 
          isShortlisted={isShortlisted}
        >
          {isShortlisted ? 'Remove from Shortlist' : 'Shortlist Candidate'}
        </ShortlistButton>
        <Button onClick={onClose}>Close</Button>
      </ModalContent>
    </ModalOverlay>
  );
};


export default ApplicationDetails;