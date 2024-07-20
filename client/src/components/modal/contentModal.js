// src/components/ContentModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ContentModal = ({ showModal, content, handleClose }) => {

 
  return (
    <Modal
      show={showModal}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Content Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Title:</h5>
        <p>{content.title}</p>
        <h5>Body:</h5>
        <p>{content.body}</p>
        <h5>Status:</h5>
        <p>
          {content.status === 0
            ? "Belum Terselesaikan"
            : "Selesai"}
        </p>
        <h5>Deadline:</h5>
        <p>
          {content.deadline
            ? new Date(content.deadline).toLocaleDateString()
            : "N/A"}
        </p>
        <h5>Due Date:</h5>
        <p>
          {content.dueDate
            ? new Date(content.dueDate).toLocaleDateString()
            : "N/A"}
        </p>
        {content.filePath && (
          <>
            <h5>File:</h5>
            <a
              className="btn btn-danger btn-sm"
              href={`http://localhost:5000/${content.filePath}`}
              download
            >
              Download File
            </a>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContentModal;
