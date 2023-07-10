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
  let isValid = true;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();
  const schema = yup
    .string()
    .length(8)
    .test(
      'login-match',
      t('login.loginMatchUp'),
      () => isValid,
    );

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
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
            isValid = true;
          })
          .catch((e) => {
            console.log('error: ', e);
            isValid = false;
          });
      } catch (e) {
        console.error(e);
        isValid = false;
      }
    },
    validationSchema: schema,
  });
  return (
        <div className="App">
          <div className="container d-flex justify-content-center align-items-center vh-100 mt-5">
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="form-floating mb-3">
                <Form.Label htmlFor="username">{t('login.yourNickname')}</Form.Label>
                <Form.Control
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  type="text" className={classNames('form-control', formik.errors.username ? 'is-invalid' : null)}
                  id="username"
                />
              </Form.Group>
              <Form.Group className="form-floating mb-3">
                <Form.Label htmlFor="password">{t('userInfo.password')}</Form.Label>
                <Form.Control
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  type="password"
                  className={classNames('form-control', formik.errors.password ? 'is-invalid' : null)}
                  id="password"
                />
              </Form.Group>
              <Form.Group className="text-center mt-3 mb-0">
                <Button type="submit" className="btn btn-primary">{t('userControls.login')}</Button>
              </Form.Group>
            </Form>
          </div>
        </div>
  );
};

export default Login;
