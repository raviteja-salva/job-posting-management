import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  max-width: 1200px;
  max-height: 80vh;
  overflow-y: auto;
`;

export const ProfileSection = styled.div`
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h3`
  color: #333;
  border-bottom: 2px solid #ddd;
  padding-bottom: 5px;
`;

export const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: #45a049;
  }
`;

export const ShortlistButton = styled(Button)`
  background-color: ${props => props.isShortlisted ? '#f44336' : '#2196F3'};
  &:hover {
    background-color: ${props => props.isShortlisted ? '#d32f2f' : '#1e88e5'};
  }
`;

export const ApplicationHistoryTable = styled.table`
  width: 100%;
  margin-bottom:20px;
  border-collapse: collapse;
`;

export const TableHeader = styled.th`
  background-color: #f2f2f2;
  padding: 10px;
  text-align: left;
`;

export const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;