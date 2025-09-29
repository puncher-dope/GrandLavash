"use client";
import React from "react";
import { Button, Form, Input } from "antd";
import type { FormProps } from "antd";
import styles from "./index.module.scss";
import { useRouter } from "next/navigation";
import { request } from "@/app/hooks/request";
import { LOGIN_ADMIN } from "@/app/lib/api/constants/api";
import { FieldType, LoginResponseType } from "@/app/lib/types/apiResponseType";



const LoginForm = () => {

  const navigation = useRouter();




  const onSubmit: FormProps<FieldType>["onFinish"] = async (values) => {
    const  {data} = await request<LoginResponseType>(LOGIN_ADMIN, 'POST', {
      login: values.login,
      password: values.password
    })
    console.log('Это логирование из страницы логина', data)

    if(data?.error){
      throw new Error(data.error)
    }
    navigation.replace('/admin')
  };

  
  return (
    <Form
      name="basic"
      onFinish={onSubmit}
      autoComplete="off"
      className={styles.loginForm}
    >
      <h1 className={styles.formLabel}>Панель администратора</h1>

      <Form.Item<FieldType>
        label="Логин"
        name="login"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Пароль"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Войти
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
