import { useState } from 'react';
import './index.css';

const TemplateSelector = ({ onSelect, onCancel, savedTemplates }) => {
  return (
    <div className="preview-overlay">
      <div className="preview-content">
        <h2>Select Template</h2>
        <div className="template-options">
          <button onClick={() => onSelect(null)}>Create with New Template</button>
          {savedTemplates.map((template, index) => (
            <button key={index} onClick={() => onSelect(template)}>
              Create with "{template.jobTitle.label}" Template
            </button>
          ))}
        </div>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default TemplateSelector;
