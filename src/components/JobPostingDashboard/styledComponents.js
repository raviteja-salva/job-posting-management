import styled from 'styled-components';

export const JobPostingManagement = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const JobPostingDashboardContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

export const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 28px;
  text-align: center;
`;

export const TopControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 60%;
  margin-right: 20px;

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 10px;
    margin-right: 0;
  }
`;

export const JobStatus = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 20%;
  margin-right: 20px;

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 10px;
    margin-right: 0;
  }
`;

export const CreateJobButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  width: 15%;
  height:40px;
  &:hover {
    background-color: #2980b9;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const JobPostingsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th, td {
    padding: 12px;
    text-align: center;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f8f9fa;
    font-weight: bold;
    color: #2c3e50;
  }

  tr:hover {
    background-color: #f5f5f5;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const CompanyCell = styled.td`
  display: flex;
  align-items: center;
  margin-top: 15px;
`;

export const CompanyLogo = styled.img`
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 10px;
`;

export const CompanyName = styled.span`
  font-weight: bold;
`;

export const StatusSelect = styled.select`
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;
  max-width: 120px;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.3s;
  padding: 5px;

  &:hover {
    color: #34495e;
  }

  @media (max-width: 768px) {
    padding: 5px;
  }
`;

export const PaginationContainer = styled.div`
display: flex;
justify-content: center;
align-items: center;
margin-top: 20px;
`;

export const PaginationButton = styled.button`
  margin: 0 5px;
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background-color: #fff;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.active {
    background-color: #3498db;
    color: white;
    border-color: #3498db;
  }

  &:hover:not(:disabled):not(.active) {
    background-color: #f0f2f5;
  }
`;

export const PaginationNumber = styled(PaginationButton)`
  &.active {
    background-color: #3498db;
    color: white;
    border-color: #3498db;
  }
`;

export const ConfirmationMessage = styled.div`
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: center;
`;

export const ConfirmationPara = styled.p`
  color: #155724;
  margin-bottom: 10px;
`;

export const ConfirmationButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin: 0 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

export const NoJobsMessage = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #6c757d;
  font-style: italic;
`;

export const TemplateOptionsOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const TemplateOptions = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;

  h3 {
    margin-top: 0;
    margin-bottom: 20px;
    text-align: center;
  }

  button {
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #e0e0e0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`;