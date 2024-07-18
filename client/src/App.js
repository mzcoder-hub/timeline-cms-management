import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Modal, Button } from "react-bootstrap";
import * as Yup from "yup";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import OverdueTimelines from "./components/OverdueTimelines";
import UpcomingTimelines from "./components/UpcomingTimelines";

function App() {
  const [timelines, setTimelines] = useState([]);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [content, setContent] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState({});

  const fetchTimelines = async () => {
    const response = await axios.get("http://localhost:5000/api/timelines");
    setTimelines(response.data);
  };

  const fetchContent = async (timelineId) => {
    const response = await axios.get(
      `http://localhost:5000/api/content/${timelineId}`
    );
    setContent(response.data);
  };

  const handleTimelineChange = (timeline) => {
    setSelectedTimeline(timeline);
    fetchContent(timeline.id);
  };

  const setViewValue = (content) => {
    console.log(content)
    setSelectedContent(content);
    setShowModal(true);
  };

  useEffect(() => {
    fetchTimelines();
  }, []);

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      width: "150px",
    },
    {
      name: "Body",
      selector: (row) => row.body,
      width: "150px",
    },
    {
      name: "Deadline",
      selector: (row) =>
        row.deadline ? new Date(row.deadline).toLocaleDateString() : "N/A",
      sortable: true,
      width: "100px",
    },
    {
      name: "Due Date",
      selector: (row) =>
        row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "N/A",
      sortable: true,
      width: "100px",
    },
    {
      name: "File",
      cell: (row) =>
        row.filePath ? (
          <a
            className="btn btn-danger btn-sm"
            href={`http://localhost:5000/${row.filePath}`}
            download
          >
            Download File
          </a>
        ) : (
          "No File"
        ),
      width: "150px",
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          className="btn btn-warning btn-sm"
          onClick={() => setViewValue(row)}
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="container">
      <hr></hr>
      <h1>Timeline CMS</h1>
      <hr></hr>
      <div className="row">
        <div className="col-md-4">
          <div className="mb-4">
            <h2>Timelines</h2>
            <ul className="list-group">
              {timelines.map((timeline) => (
                <li
                  key={timeline.id}
                  className="list-group-item"
                  onClick={() => handleTimelineChange(timeline)}
                >
                  {timeline.name}
                </li>
              ))}
            </ul>
          </div>
          <h3>Add New Timeline</h3>
          <Formik
            initialValues={{ name: "" }}
            validationSchema={Yup.object({
              name: Yup.string().required("Required"),
            })}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              await axios.post("http://localhost:5000/api/timelines", values);
              resetForm();
              fetchTimelines();
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-group mb-3">
                  <label htmlFor="name">Timeline Name</label>
                  <Field name="name" type="text" className="form-control" />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  Add Timeline
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <div className="col-md-8">
          {selectedTimeline ? (
            <>
              <h2>Content for {selectedTimeline.name}</h2>
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedTimeline(null);
                }}
              >
                Back To Home
              </button>
              <DataTable columns={columns} data={content} pagination />
              <Formik
                initialValues={{
                  title: "",
                  body: "",
                  deadline: "",
                  dueDate: "",
                  file: null,
                }}
                validationSchema={Yup.object({
                  title: Yup.string().required("Required"),
                  body: Yup.string().required("Required"),
                  deadline: Yup.date().nullable(),
                  dueDate: Yup.date().nullable(),
                })}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  const formData = new FormData();
                  formData.append("title", values.title);
                  formData.append("body", values.body);
                  formData.append("timelineId", selectedTimeline.id);
                  formData.append("deadline", values.deadline);
                  formData.append("dueDate", values.dueDate);
                  if (values.file) {
                    formData.append("file", values.file);
                  }
                  await axios.post(
                    "http://localhost:5000/api/content",
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  );
                  resetForm();
                  fetchContent(selectedTimeline.id);
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form>
                    <div className="form-group mb-3">
                      <label htmlFor="title">Title</label>
                      <Field
                        name="title"
                        type="text"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="body">Body</label>
                      <Field
                        name="body"
                        as="textarea"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="body"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="deadline">Deadline</label>
                      <Field
                        name="deadline"
                        type="date"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="deadline"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="dueDate">Due Date</label>
                      <Field
                        name="dueDate"
                        type="date"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="dueDate"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="file">Upload File</label>
                      <input
                        id="file"
                        name="file"
                        type="file"
                        className="form-control"
                        onChange={(event) => {
                          setFieldValue("file", event.currentTarget.files[0]);
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      Add Content
                    </button>
                  </Form>
                )}
              </Formik>
              <Modal show={showModal} onHide={() => {
                setShowModal(false)
                setSelectedContent({})
              }}>
                <Modal.Header closeButton>
                  <Modal.Title>Content Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <h5>Title:</h5>
                  <p>{selectedContent.title}</p>
                  <h5>Body:</h5>
                  <p>{selectedContent.body}</p>
                  <h5>Deadline:</h5>
                  <p>
                    {selectedContent.deadline
                      ? new Date(selectedContent.deadline).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <h5>Due Date:</h5>
                  <p>
                    {selectedContent.dueDate
                      ? new Date(selectedContent.dueDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  {selectedContent.filePath && (
                    <>
                      <h5>File:</h5>
                      <a
                        className="btn btn-danger btn-sm"
                        href={`http://localhost:5000/${selectedContent.filePath}`}
                        download
                      >
                        Download File
                      </a>
                    </>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => {
                     setShowModal(false)
                     setSelectedContent({})
                  }}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          ) : (
            <>
              <OverdueTimelines />
              <UpcomingTimelines />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
