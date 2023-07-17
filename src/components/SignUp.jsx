import React from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import Form from 'react-bootstrap/Form';
import * as yup from 'yup';
import { useAuth } from '../hooks';
import routes from '../routes';

const schema = yup.object({
  username: yup
    .string()
    .min(3, 'signUp.usernameConstraints')
    .max(20, 'signUp.usernameConstraints')
    .required('signUp.requiredField'),
  password: yup
    .string()
    .min(6, 'signUp.passMin')
    .required('signUp.requiredField'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'signUp.passMatchUp')
    .required('signUp.requiredField'),
});

const SignUp = () => {
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
        const response = await axios.post(routes.signupPath(), values);
        console.log('response after registration: ', response.data);
        const userData = response.data;
        auth.logIn(userData);
        navigate('/');
        navigate(0);
      } catch (e) {
        console.log('error: ', e);
      }
    },
    validationSchema: schema,
  });
    // TODO: в formik писать коды ошибок
  return (
    <div className="App">
      <div className="container d-flex justify-content-center align-items-center vh-100 mt-5">
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="form-floating mb-3">
            <Form.Control
              placeholder={t('userInfo.username')}
              name="username"
              id="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username ?? ''}
              type="text"
              required
              className={classNames(formik.errors.username ? 'is-invalid' : null)}
            />
            <Form.Label htmlFor="username">{t('userInfo.username')}</Form.Label>
            <Form.Control.Feedback type="invalid" tooltip placement="right">
              {t(formik.errors.username)}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-floating mb-3">
            <Form.Control
              name="password"
              id="password"
              type="password"
              placeholder={t('userInfo.password')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={classNames(formik.errors.password ? 'is-invalid' : null)}
            />
            <Form.Label htmlFor="password">{t('userInfo.password')}</Form.Label>
            <Form.Control.Feedback type="invalid" tooltip placement="right">
              {t(formik.errors.password)}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-floating mb-4">
            <Form.Control
              name="passwordConfirmation"
              id="confirmPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.passwordConfirmation}
              placeholder={t('userInfo.confirmPassword')}
              type="password"
              className={classNames(formik.errors.passwordConfirmation ? 'is-invalid' : null)}
            />
            <Form.Label htmlFor="confirmPassword">{t('userInfo.confirmPassword')}</Form.Label>
            <Form.Control.Feedback type="invalid" tooltip placement="right">
              {t(formik.errors.passwordConfirmation)}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="text-center mt-3 mb-0">
            <button type="submit" className="btn btn-primary">{t('signUp.register')}</button>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
