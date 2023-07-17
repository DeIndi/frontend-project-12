import { toast } from 'react-toastify';
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
  const [isAuthFailed, setIsAuthFailed] = useState(false);
  const [isGeneralError, setIsGeneralError] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setIsGeneralError(false);
      try {
        await formik.validateForm();
        const response = await axios.post(routes.loginPath(), values);
        const userData = response.data;
        auth.logIn(userData);
        navigate('/');
        navigate(0);
        setIsAuthFailed(false);
        setIsGeneralError(false);
      } catch (e) {
        console.error(e);
        if (e.code === 'ERR_NETWORK') {
          toast.error(t('error.errorNetwork'));
        }
        if (e.response.data.statusCode === 401) {
          setIsAuthFailed(true);
          return;
        }
        setIsGeneralError(true);
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
              isInvalid={isAuthFailed || isGeneralError}
              value={formik.values.username}
              onChange={formik.handleChange}
              type="text"
              id="username"
            />
            <Form.Label htmlFor="username">{t('login.yourNickname')}</Form.Label>
          </Form.Group>
          <Form.Group className="form-floating mb-3">
            <Form.Control
              isInvalid={isAuthFailed || isGeneralError}
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
