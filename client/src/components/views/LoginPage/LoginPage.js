import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 최신 버전에서는 useHistory 대신 useNavigate 사용
import { loginUser } from "../../../_actions/user_action";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Input, Button, Checkbox, Typography } from 'antd'; // Icon 제거
import { UserOutlined, LockOutlined } from '@ant-design/icons'; // 최신 아이콘 import
import { useDispatch } from "react-redux";

const { Title } = Typography;

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate hook 사용
  const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;

  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(rememberMeChecked);

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const initialEmail = localStorage.getItem("rememberMe") ? localStorage.getItem("rememberMe") : '';

  return (
    <Formik
      initialValues={{
        email: initialEmail,
        password: '',
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Email is invalid') // 이메일 형식 확인
          .required('Email is required'), // 필수 입력 필드
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters') // 최소 길이 확인
          .required('Password is required'), // 필수 입력 필드
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            email: values.email,
            password: values.password
          };

          dispatch(loginUser(dataToSubmit))
            .then(response => {
              if (response.payload.loginSuccess) {
                window.localStorage.setItem('userId', response.payload.userId);
                if (rememberMe === true) {
                  window.localStorage.setItem('rememberMe', values.email); // email 저장
                } else {
                  localStorage.removeItem('rememberMe');
                }
                navigate("/"); // useHistory 대신 useNavigate 사용
              } else {
                setFormErrorMessage('Check out your Account or Password again');
              }
            })
            .catch(err => {
              setFormErrorMessage('Check out your Account or Password again');
              setTimeout(() => {
                setFormErrorMessage("");
              }, 3000);
            });
          setSubmitting(false);
        }, 500);
      }}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;
        return (
          <div className="app">
            <Title level={2}>Log In</Title>
            <form onSubmit={handleSubmit} style={{ width: '350px' }}>
              <Form.Item
                validateStatus={errors.email && touched.email ? "error" : ""}
                help={errors.email && touched.email ? errors.email : ""}
                required
              >
                <Input
                  id="email"
                  prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Enter your email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.email && touched.email ? 'text-input error' : 'text-input'
                  }
                />
              </Form.Item>

              <Form.Item
                validateStatus={errors.password && touched.password ? "error" : ""}
                help={errors.password && touched.password ? errors.password : ""}
                required
              >
                <Input
                  id="password"
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Enter your password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password ? 'text-input error' : 'text-input'
                  }
                />
              </Form.Item>

              {formErrorMessage && (
                <div>
                  <p style={{ color: '#ff0000bf', fontSize: '0.7rem', border: '1px solid', padding: '1rem', borderRadius: '10px' }}>
                    {formErrorMessage}
                  </p>
                </div>
              )}

              <Form.Item>
                <Checkbox id="rememberMe" onChange={handleRememberMe} checked={rememberMe}>
                  Remember me
                </Checkbox>
                <a className="login-form-forgot" href="/reset_user" style={{ float: 'right' }}>
                  forgot password
                </a>
                <div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    style={{ minWidth: '100%' }}
                    disabled={isSubmitting}
                    onSubmit={handleSubmit}
                  >
                    Log in
                  </Button>
                </div>
                Or <a href="/register">register now!</a>
              </Form.Item>
            </form>
          </div>
        );
      }}
    </Formik>
  );
};

export default LoginPage;
