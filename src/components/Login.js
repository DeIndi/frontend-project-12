import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks';
import routes from '../routes';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values, formikHelpers) => {
      console.log('formikHelpers: ', formikHelpers);
      setAuthFailed(false);
      try {
        const errors = await formik.validateForm();
        if (Object.keys(errors).length !== 0) {
          console.log('Validation errors:', errors);
        }
        axios.post(routes.loginPath(), values)
          .then((response) => {
            const userData = response.data;
            auth.logIn(userData);
            navigate('/');
            navigate(0);
          })
          .catch((e) => {
            console.log('error: ', e);
            // TODO: рассмотреть разные коды axios, проверяем 401 код HTTP,
            //  в остальных случаях - другая ошибка
            setAuthFailed(true);
          });
      } catch (e) {
        console.error(e);
        setAuthFailed(false);
      }
    },
  });
  return (
        <div className="App">
          <div className="container d-flex justify-content-center align-items-center vh-100 mt-5">
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="form-floating mb-3">
                <Form.Control
                  name="username"
                  isInvalid={authFailed}
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  type="text"
                  id="username"
                />
                <Form.Label htmlFor="username">{t('login.yourNickname')}</Form.Label>
              </Form.Group>
              <Form.Group className="form-floating mb-3">
                <Form.Control
                  isInvalid={authFailed}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  type="password"
                  id="password"
                />
                <Form.Label htmlFor="password">{t('userInfo.password')}</Form.Label>
                <Form.Control.Feedback type="invalid" tooltip placement="right">
                  {t('login.authFailed')}
                </Form.Control.Feedback>
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
