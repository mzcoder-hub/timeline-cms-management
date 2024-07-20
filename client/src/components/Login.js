// src/components/Login.js
import React, { useContext, useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form as BootstrapForm, Alert } from 'react-bootstrap';

const Login = () => {
  const { auth, login } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/');
    }
  }, [auth, navigate]);

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={Yup.object({
                  email: Yup.string().email('Invalid email address').required('Required'),
                  password: Yup.string().required('Required')
                })}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    await login(values.email, values.password);
                    setMessage('Login successful.');
                    navigate('/');
                  } catch (error) {
                    setMessage('Login failed.');
                  }
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label htmlFor="email">Email</BootstrapForm.Label>
                      <Field name="email" type="text" className="form-control" />
                      <ErrorMessage name="email" component="div" className="text-danger" />
                    </BootstrapForm.Group>
                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label htmlFor="password">Password</BootstrapForm.Label>
                      <Field name="password" type="password" className="form-control" />
                      <ErrorMessage name="password" component="div" className="text-danger" />
                    </BootstrapForm.Group>
                    <Button type="submit" variant="primary" disabled={isSubmitting} className="w-100">
                      Login
                    </Button>
                  </Form>
                )}
              </Formik>
              {message && <Alert variant="info" className="mt-3">{message}</Alert>}
              <div className="text-center mt-3">
                Don't have an account? <Link to="/register">Sign up</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
