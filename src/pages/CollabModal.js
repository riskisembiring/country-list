import React from 'react';
import { Modal, Button, Popconfirm } from 'antd';
import '../styles/CollabModal.css'; // Import file CSS baru

const CollabModal = ({ isVisible, onCancel, collabCountries, onCancelCollab }) => {
  return (
    <Modal
      title={<div className="modal-header">List of Country Collaborations Page</div>}
      visible={isVisible}
      onCancel={onCancel}
      closable={false}
      width={800}
      footer={[ 
        <Button key="back" onClick={onCancel}>
          Close
        </Button>,
      ]}
      className="modal-container"
    >
      <ul className="collab-list">
        {collabCountries.length > 0 ? (
          collabCountries.map((country) => (
            <div key={country.code} className="collab-list-item">
              <li className="country-name">{country.name}</li>
                <Button type="primary" className="cancel-button" onClick={() => onCancelCollab(country.code)}>Cancel Collab</Button>
            </div>
          ))
        ) : (
          <p className="no-countries">There are no countries collaborating yet.</p>
        )}
      </ul>
    </Modal>
  );
};

export default CollabModal;
