import React from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../hooks/index.jsx';
import routes from '../routes';

const SignUp = () => {
  const { t } = useTranslation();

  const schema = yup.object({
    username: yup.string().length(6),
    password: yup.string().required('Password is required'),
    passwordConfirmation: yup.string().test(
      'passwords-match',
      'Passwords must match',
      function (value) {
        return value === this.parent.password;
      },
    ),
  });
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
      } catch (e) {
        console.log('error: ', e);
      }
    },
    validationSchema: schema,
  });

  console.log('formik: ', formik);
  return (
    <div className="App">
      <div className="container d-flex justify-content-center align-items-center vh-100 mt-5">
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label htmlFor="username">{t('userInfo.username')}</Form.Label>
            <Form.Control placeholder={t('signUp.usernameConstraints')}
                          name="username" id="username"
                          onChange={formik.handleChange} type="text"
                          className={classNames('form-control', formik.errors.username ? 'is-invalid' : null)}/>
            <Form.Control.Feedback type="invalid" tooltip placement="right">
              {t(formik.errors.username)}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label htmlFor="password">{t('userInfo.password')}</Form.Label>
            <Form.Control name="password" id="password" onChange={formik.handleChange}
                          type="password"
                          placeholder={t('signUp.passMin')}
                          className={classNames('form-control', formik.errors.password ? 'is-invalid' : null)}
            />
            <Form.Control.Feedback type="invalid" tooltip placement="right">
              {t(formik.errors.password)}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label htmlFor="confirmPassword">{t('userInfo.confirmPassword')}</Form.Label>
            <Form.Control name="passwordConfirmation" id="confirmPassword" onChange={formik.handleChange}
                          placeholder={t('userInfo.confirmPassword')}
                          type="password"
                          className={classNames('form-control', formik.errors.passwordConfirmation ? 'is-invalid' : null)}/>
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
