// src/components/Register.js
import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [message, setMessage] = useState('');

  return (
    <div className="container">
      <h2>Register</h2>
      <Formik
        initialValues={{ name : '', email: '', password: '' }}
        validationSchema={Yup.object({
          name: Yup.string().required('Required'),
          email: Yup.string().required('Required'),
          password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required')
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await register(values.name, values.email, values.password);
            setMessage('Registration successful. You can now login.');
          } catch (error) {
            setMessage('Registration failed.');
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group mb-3">
              <label htmlFor="name">Name</label>
              <Field name="name" type="text" className="form-control" />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <Field name="email" type="email" className="form-control" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              Register
            </button>
          </Form>
        )}
      </Formik>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default Register;
