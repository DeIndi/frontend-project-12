import React from 'react';
import { Formik, Field, Form } from 'formik';
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
  const handleSubmit = async (values) => {
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
  };
  return (
        <div className="App">
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={(values, formik) => handleSubmit(values, formik)}
                validationSchema={schema}
            >
                {(formik) => (
                    <div className="container d-flex justify-content-center align-items-center vh-100 mt-5">
                        <Form>
                            <div className="form-group">
                                <label htmlFor="username">{t('userInfo.username')}:</label>
                                <Field name="username" onChange={formik.handleChange} type="text" className={classNames('form-control', formik.errors.username ? 'is-invalid' : null)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">{t('userInfo.password')}:</label>
                                <Field name="password" onChange={formik.handleChange} type="password" className={classNames('form-control', formik.errors.password ? 'is-invalid' : null)} />
                            </div>
                            <div className="text-center mt-3 mb-0">
                                <button type="submit" className="btn btn-primary">{t('modal.send')}</button>
                            </div>
                        </Form>
                    </div>
                )}
            </Formik>
        </div>
  );
};

export default Login;
