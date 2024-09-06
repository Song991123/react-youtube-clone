import React from "react";
import { DateTime } from "luxon";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Item: FormItem } = Form;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 8
    }
  },
  wrapperCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 16
    }
  }
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
};

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize the useNavigate hook

  return (
    <Formik
      initialValues={{
        email: '',
        lastName: '',
        name: '',
        password: '',
        confirmPassword: ''
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required('Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        email: Yup.string().email('Email is invalid').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required')
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          const dataToSubmit = {
            email: values.email,
            password: values.password,
            name: values.name,
            lastname: values.lastName,
            image: `http://gravatar.com/avatar/${DateTime.now().toMillis()}?d=identicon`
          };

          dispatch(registerUser(dataToSubmit)).then(response => {
            if (response.payload.success) {
              navigate("/login"); // Use navigate instead of history.push
            } else {
              alert(response.payload.err.errmsg);
            }
          });

          setSubmitting(false);
        }, 500);
      }}>
      {({
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting
      }) => (
        <div className="app">
          <h2>Sign up</h2>
          <Form
            style={{ minWidth: '375px' }}
            {...formItemLayout}
            onFinish={handleSubmit}>

            <FormItem
              label="Name"
              required="required"
              validateStatus={errors.name && touched.name ? 'error' : 'success'}
              help={errors.name && touched.name ? errors.name : ''}>
              <Input
                id="name"
                placeholder="Enter your name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur} />
            </FormItem>

            <FormItem
              label="Last Name"
              required="required"
              validateStatus={errors.lastName && touched.lastName ? 'error' : 'success'}
              help={errors.lastName && touched.lastName ? errors.lastName : ''}>
              <Input
                id="lastName"
                placeholder="Enter your Last Name"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur} />
            </FormItem>

            <FormItem
              label="Email"
              required="required"
              validateStatus={errors.email && touched.email ? 'error' : 'success'}
              help={errors.email && touched.email ? errors.email : ''}>
              <Input
                id="email"
                placeholder="Enter your Email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur} />
            </FormItem>

            <FormItem
              label="Password"
              required="required"
              validateStatus={errors.password && touched.password ? 'error' : 'success'}
              help={errors.password && touched.password ? errors.password : ''}>
              <Input
                id="password"
                placeholder="Enter your password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur} />
            </FormItem>

            <FormItem
              label="Confirm Password"
              required="required"
              validateStatus={errors.confirmPassword && touched.confirmPassword ? 'error' : 'success'}
              help={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : ''}>
              <Input
                id="confirmPassword"
                placeholder="Confirm your password"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur} />
            </FormItem>

            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </FormItem>
          </Form>
        </div>
      )}
    </Formik>
  );
}

export default RegisterPage;
