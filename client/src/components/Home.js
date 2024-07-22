// src/components/Home.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import OverdueTimelines from './OverdueTimelines';
import UpcomingTimelines from './UpcomingTimelines';
import ContentModal from './modal/contentModal';
import { AuthContext } from '../AuthContext';
import { Container, Row, Col, Card, Button, Form as BootstrapForm, Alert } from 'react-bootstrap';

const localizer = momentLocalizer(moment);

function Home() {
  const [timelines, setTimelines] = useState([]);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [statusModal, setStatusModal] = useState(false);
  const [content, setContent] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const { logout } = useContext(AuthContext);

  const fetchTimelines = async () => {
    const response = await axios.get('http://localhost:5000/api/timelines', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    setTimelines(response.data);
  };

  const fetchContent = async (timelineId) => {
    const response = await axios.get(`http://localhost:5000/api/content/${timelineId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    setContent(response.data);
  };

  const handleTimelineChange = (timeline) => {
    setSelectedTimeline(timeline);
    fetchContent(timeline.id);
  };

  const setViewValue = (content) => {
    setModalContent(content);
    setStatusModal(true);
  };

  useEffect(() => {
    fetchTimelines();
  }, []);

  const events = content.map(item => ({
    title: item.title,
    start: item.deadline ? new Date(item.deadline) : new Date(),
    end: item.dueDate ? new Date(item.dueDate) : new Date(),
    allDay: true,
    resource: item
  }));

  const handleSelectEvent = (event) => {
    setViewValue(event.resource);
  };

  return (
    <Container className="py-4">
      <Row>
        <Col className="text-end">
          <Button variant="danger" onClick={logout}>Logout</Button>
        </Col>
      </Row>
      <Row className="my-4">
        <Col>
          <h1 className="text-center">Timeline CMS</h1>
          <hr />
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>
                <Row>
                  <Col md={6}>Timelines</Col>
                  <Col md={6}>
                    <div style={{ float: 'right' }}>
                      <Button variant="primary" onClick={() => {
                        axios.get('http://localhost:5000/api/backup/contents', {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                          }
                        })
                      }} className="mb-3">
                        Backup Timeline
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Title>
              <ul className="list-group">
                {timelines.map(timeline => (
                  <li key={timeline.id} className="list-group-item" onClick={() => handleTimelineChange(timeline)}>
                    {timeline.name}
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>Add New Timeline</Card.Title>
              <Formik
                initialValues={{ name: '' }}
                validationSchema={Yup.object({
                  name: Yup.string().required('Required')
                })}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  await axios.post('http://localhost:5000/api/timelines', values, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                  });
                  resetForm();
                  fetchTimelines();
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label htmlFor="name">Timeline Name</BootstrapForm.Label>
                      <Field name="name" type="text" className="form-control" />
                      <ErrorMessage name="name" component="div" className="text-danger" />
                    </BootstrapForm.Group>
                    <Button type="submit" variant="primary" disabled={isSubmitting} className="w-100">
                      Add Timeline
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          {selectedTimeline ? (
            <>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Content for {selectedTimeline.name}</Card.Title>
                  <hr></hr>
                  <Row>
                    <Col md={6}>
                      <div style={{ float: 'left' }}>
                        <Button variant="primary" onClick={() => {
                          axios.get('http://localhost:5000/api/backup/contents', {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                          })
                        }} className="mb-3">
                          Backup Content
                        </Button>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div style={{ float: 'right' }}>
                        <Button variant="warning" onClick={() => setSelectedTimeline(null)} className="mb-3">
                          Back To Home
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <hr></hr>
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    onSelectEvent={handleSelectEvent}
                    views={['month', 'week', 'day']}
                  />
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>Add New Content</Card.Title>
                  <Formik
                    initialValues={{ title: '', body: '', deadline: '', dueDate: '', file: null }}
                    validationSchema={Yup.object({
                      title: Yup.string().required('Required'),
                      body: Yup.string().required('Required'),
                      deadline: Yup.date().nullable(),
                      dueDate: Yup.date().nullable(),
                    })}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                      const formData = new FormData();
                      formData.append('title', values.title);
                      formData.append('body', values.body);
                      formData.append('timelineId', selectedTimeline.id);
                      formData.append('deadline', values.deadline);
                      formData.append('dueDate', values.dueDate);
                      if (values.file) {
                        formData.append('file', values.file);
                      }
                      await axios.post('http://localhost:5000/api/content', formData, {
                        headers: {
                          'Content-Type': 'multipart/form-data',
                          Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                      });
                      resetForm();
                      fetchContent(selectedTimeline.id);
                      setSubmitting(false);
                    }}
                  >
                    {({ isSubmitting, setFieldValue }) => (
                      <Form>
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label htmlFor="title">Title</BootstrapForm.Label>
                          <Field name="title" type="text" className="form-control" />
                          <ErrorMessage name="title" component="div" className="text-danger" />
                        </BootstrapForm.Group>
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label htmlFor="body">Body</BootstrapForm.Label>
                          <Field name="body" as="textarea" className="form-control" />
                          <ErrorMessage name="body" component="div" className="text-danger" />
                        </BootstrapForm.Group>
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label htmlFor="deadline">Deadline</BootstrapForm.Label>
                          <Field name="deadline" type="date" className="form-control" />
                          <ErrorMessage name="deadline" component="div" className="text-danger" />
                        </BootstrapForm.Group>
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label htmlFor="dueDate">Due Date</BootstrapForm.Label>
                          <Field name="dueDate" type="date" className="form-control" />
                          <ErrorMessage name="dueDate" component="div" className="text-danger" />
                        </BootstrapForm.Group>
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label htmlFor="file">Upload File</BootstrapForm.Label>
                          <input
                            id="file"
                            name="file"
                            type="file"
                            className="form-control"
                            onChange={(event) => {
                              setFieldValue('file', event.currentTarget.files[0]);
                            }}
                          />
                        </BootstrapForm.Group>
                        <Button type="submit" variant="primary" disabled={isSubmitting} className="w-100">
                          Add Content
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </Card.Body>
              </Card>
            </>
          ) : (
            <>
              <OverdueTimelines />
              <UpcomingTimelines />
            </>
          )}
        </Col>
      </Row>
      {modalContent && (
        <ContentModal
          showModal={statusModal}
          content={modalContent}
          handleClose={() => setStatusModal(false)}
        />
      )}
    </Container>
  );
}

export default Home;
