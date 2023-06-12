import { Formik, Field, Input, Form, useFormik } from "formik";
import * as yup from 'yup';
import axios from 'axios';
import { useContext, useState } from 'react';
import AuthContext from '../contexts/index.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/index.jsx';
import routes from "../routes";
import { useTranslation } from 'react-i18next';
import classNames from "classnames";

const Login = () => {
    const schema = yup.string().length(8);
    const location = useLocation();
    const {t} = useTranslation();

    const navigate = useNavigate();
    const auth = useAuth();
    const handleChange = (event, formik) => {
        const { name, value } = event.target;
        formik.setFieldValue(name, value);
    };
    const handleSubmit = async (values) => {
        try {
            axios.post(routes.loginPath(), values)
                .then((response) => {
                    const userData = response.data;
                    auth.logIn(userData);
                    navigate('/');
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
            <h1>{t('HeaderNavBar.login')}</h1>
            <Formik
                initialValues={{username: "", password: ""}}
                onSubmit={(values, formik)=>handleSubmit(values, formik)}
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
                                <button type="submit" className="btn btn-primary">{t('headerNavBar.send')}</button>
                            </div>
                        </Form>
                    </div>
                )}
            </Formik>
        </div>
    );
}

export default Login ;