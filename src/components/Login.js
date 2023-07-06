import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useAuth } from '../hooks';
import routes from '../routes';

const Login = () => {
  const schema = yup.string().length(8);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    onSubmit: async (values) => {
      formik.validateForm().then((errors) => {
        if (Object.keys(errors).length !== 0) {
          console.log('Validation errors:', errors);
        }
      });
      try {
        axios.post(routes.loginPath(), values)
          .then((response) => {
            const userData = response.data;
            auth.logIn(userData);
            navigate('/');
            navigate(0);
          })
          .catch((e) => {
            console.log('error: ', e);
          });
      } catch (e) {
        console.error(e);
      }
    },
    validationSchema: schema,
  });
  return (
        <div className="App">
          <div className="container d-flex justify-content-center align-items-center vh-100 mt-5">
            <Form>
              <Form.Group className="form-floating mb-3">
                <Form.Label htmlFor="username">{t('userInfo.username')}:</Form.Label>
                <Form.Control name="username" onChange={formik.handleChange} type="text" className={classNames('form-control', formik.errors.username ? 'is-invalid' : null)} />
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label htmlFor="password">{t('userInfo.password')}:</Form.Label>
                <Form.Control name="password" onChange={formik.handleChange} type="password" className={classNames('form-control', formik.errors.password ? 'is-invalid' : null)} />
              </Form.Group>
                <Button type="submit" className="btn btn-primary">{t('modal.send')}</Button>
            </Form>
          </div>
        </div>
  );
};

export default Login;
