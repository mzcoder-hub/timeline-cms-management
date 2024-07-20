// src/components/Login.js
import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [message, setMessage] = useState('');

  const navigate = useNavigate()

  return (
    <div className="container">
      <h2>Login</h2>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string().required('Required'),
          password: Yup.string().required('Required')
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await login(values.email, values.password);
            setMessage('Login successful.');
            navigate('/')
          } catch (error) {
            setMessage('Login failed.');
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group mb-3">
              <label htmlFor="email">email</label>
              <Field name="email" type="text" className="form-control" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              Login
            </button>
          </Form>
        )}
      </Formik>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default Login;
