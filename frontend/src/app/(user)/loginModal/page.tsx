"use client";
import React from "react";
import { Button, Form, Input, Spin } from "antd";
import type { FormProps } from "antd";
import { useRouter } from "next/navigation";
import {
  FieldUserType,
} from "@/app/lib/types/apiResponseType";
import "./index.scss";
import { useUser } from "@/app/lib/api/store/useUser";

const LoginModalPage = () => {
  const router = useRouter();
  const {isLoading, error, login} = useUser()

  const onSubmit: FormProps<FieldUserType>["onFinish"] = async (values) => {
    try {
      await login(values.login, values.phone)
      router.push("/");
    } catch{
      try {
        
        router.push("/");
      } catch (e) {
        return e instanceof Error ? e.message : "Неизвестная ошибка";
      }
    }
  };



  const closeLoginModal = () => {
    router.push("/");
  };

  if(isLoading || error) return <Spin/>


  return (
    <div className="login-form">
      <div className="login-form__btn-group">
      <button className="login-form__btn-close" onClick={closeLoginModal}>
        X
      </button>
      </div>
      <Form name="basic" onFinish={onSubmit} autoComplete="off">
        <h1 className="form-label">Зарегистрируйся</h1>

        <Form.Item<FieldUserType>
          label="Логин"
          name="login"
          rules={[{ required: true, message: "Пожалуйста введите логин!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldUserType>
          label="Номер телефона"
          name="phone"
          rules={[
            { required: true, message: "Пожалуйста введите номер телефона!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Войти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginModalPage;
