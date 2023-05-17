import { Formik, Field, Input, Form, useFormik } from "formik";
import * as yup from 'yup';
import axios from 'axios';
import { useContext, useState } from 'react';
import AuthContext from '../contexts/index.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/index.jsx';

const Login = () => {
    const schema = yup.string().length(8);
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useAuth();
    const handleChange = (event, formik) => {
        const { name, value } = event.target;
        formik.setFieldValue(name, value);
    };
    const handleSubmit = async (values) => {
        try {
            axios.post('/api/v1/login', values)
                .then((response) => {
                    const userData = response.data;
                    auth.logIn(userData);
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
            <h1>Login</h1>
            <Formik
                initialValues={{username: "", password: ""}}
                onSubmit={(values)=>handleSubmit(values)}
                validationSchema={schema}
            >
                {(formik) => (
                    <Form>
                        <Field name="username" onChange={(event) => handleChange(event, formik)} type="text"/>
                        <Field name="password" onChange={(event) => handleChange(event, formik)} type="text"/>
                        <button type="submit">Submit</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Login ;