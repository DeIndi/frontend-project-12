import { Formik, Field, Input, Form, useFormik } from "formik";
import * as yup from 'yup';
import axios from 'axios';
import { useContext, useState } from 'react';
import AuthContext from '../contexts/index.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/index.jsx';
import {useSocketAPI} from "../hooks/index.jsx";
import routes from "../routes";
import classNames from "classnames";


const SignUp = () => {
    const schema = yup.object({
        username: yup.string().length(6),
        password: yup.string().required('Password is required'),
        passwordConfirmation: yup.string().test(
            'passwords-match',
            'Passwords must match',
            function (value) {
                return value === this.parent.password;
            }
        ),
    });

    const navigate = useNavigate();
    const auth = useAuth();
    const handleSubmit = async (values, formik) => {
        console.log('values: ', values);
        console.log('formik.values:', formik.values);
        console.log('formik.resetForm:', formik.resetForm);
        console.log('formik.validateForm:', formik.validateForm);
        formik.validateForm().then(errors => {
            console.log('Validation errors:', errors);
            if (Object.keys(errors).length === 0) {
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
    };
    return (
        <div className="App">
            <Formik

                initialValues={{username: "", password: "", passwordConfirmation:""}}
                onSubmit={(values, formik)=>handleSubmit(values, formik)}
                validationSchema={schema}
            >
                {(formik) => (
                    <div className="container d-flex justify-content-center align-items-center vh-100 mt-5">
                        <Form>
                            <div className="form-group">
                                <label htmlFor="username">Username:</label>
                                <Field name="username" onChange={formik.handleChange} type="text" className={classNames('form-control', formik.errors.username ? 'is-invalid' : null)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <Field name="password" onChange={formik.handleChange} type="password" className={classNames('form-control', formik.errors.password ? 'is-invalid' : null)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="passwordConfirmation">Confirm Password:</label>
                                <Field name="passwordConfirmation" onChange={formik.handleChange} type="password" className={classNames('form-control', formik.errors.passwordConfirmation ? 'is-invalid' : null)} />
                            </div>
                            <div className="text-center mt-3 mb-0">
                                <button type="submit" className="btn btn-primary">Отправить</button>
                            </div>
                        </Form>
                    </div>
                )}
            </Formik>
        </div>
    );
}

export default SignUp ;