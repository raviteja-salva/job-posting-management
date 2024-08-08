import React from 'react';
import './index.css';

const AuditTrail = ({ auditTrail }) => {
  return (
    <div className="audit-trail">
      <h1 className="audit-trail__title">Audit Trail</h1>
      <table className="audit-trail__table">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Recruiter</th>
            <th>Action</th>
            <th>Description</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {auditTrail.map((entry) => (
            <tr key={entry.id} className="audit-trail__row">
              <td>{entry.jobId}</td>
              <td>{entry.recruiter}</td>
              <td>{entry.action}</td>
              <td>{entry.description}</td>
              <td>{new Date(entry.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditTrail;



// import React from 'react';
// import './index.css'

// const AuditTrail = ({ auditTrail }) => {
//   return (
//     <div className="audit-trail">
//       <h2>Audit Trail</h2>
//       <ul className="audit-list">
//         {auditTrail.map((entry) => (
//           <li key={entry.id} className="audit-entry">
//             <p><strong>Job ID:</strong> {entry.jobId}</p>
//             <p><strong>Recruiter:</strong> {entry.recruiter}</p>
//             <p><strong>Action:</strong> {entry.action}</p>
//             <p><strong>Description:</strong> {entry.description}</p>
//             <p><strong>Timestamp:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AuditTrail;
