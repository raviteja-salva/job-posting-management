import styled from 'styled-components';

export const Container = styled.div`
  background-color: #ffffff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

export const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
`;

export const SearchInput = styled.input`
  width: 70%;
  padding: 8px 12px;
  padding-left: 36px;
  height: 40px;
  border: 1px solid #e2e8f0;
  border-radius: 40px;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const BubbleContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;


export const BubbleFilter = styled.button`
  background-color: ${props => props.active ? '#000000' : '#ffffff'};
  color: ${props => props.active ? 'white' : '#000000'};
  border: 1px solid #d1d5db;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  width:120px;
`;


export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background-color: #f3f4f6;
`;

export const TableRow = styled.tr`
  text-align: center;
  &:nth-child(even) {
    background-color: #f9fafb;
  }
`;

export const TableHeader = styled.th`
  padding: 12px;
  text-align: center;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
`;

export const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

export const ViewProfileButton = styled.button`
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2563eb;
  }
`;

export const ShortlistedIndicator = styled.span`
  background-color: #4CAF50;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;
`;

export const StatusDropdown = styled.select`
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
  width:100px;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export const PageButton = styled.button`
  background-color: ${props => props.active ? '#3b82f6' : '#f3f4f6'};
  color: ${props => props.active ? 'white' : '#374151'};
  border: 1px solid #d1d5db;
  padding: 5px 10px;
  margin: 0 5px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#2563eb' : '#e5e7eb'};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #6b7280;
`;