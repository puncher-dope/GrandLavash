// LoginModal/page.tsx
"use client";
import React from "react";
import { Button, Form, Input, Spin } from "antd";
import type { FormProps } from "antd";
import { useRouter } from "next/navigation";
import { FieldUserType } from "@/app/lib/types/apiResponseType";
import "./index.scss";
import { useUser } from "@/app/lib/api/store/useUser";
import { useLocalStore } from "@/app/lib/api/store/useLocalStorage";

const LoginModalPage = () => {
  const router = useRouter();
  const {isLoading, error, login} = useUser()
  const {setUserName, setUserPhone} = useLocalStore()


  const onSubmit: FormProps<FieldUserType>["onFinish"] = async (values) => {

    try {
      setUserName(values.login.trim())
      setUserPhone(values.phone.trim())
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
          ×
        </button>
      </div>
      
      <h1 className="form-title">Войти в аккаунт</h1>
      
      <Form name="basic" onFinish={onSubmit} autoComplete="off" layout="vertical">
        <Form.Item<FieldUserType>
          label="Логин"
          name="login"
          rules={[{ required: true, message: "Пожалуйста введите логин!" }]}
        >
          <Input placeholder="Введите ваш логин" />
        </Form.Item>

        <Form.Item<FieldUserType>
          label="Номер телефона"
          name="phone"
          rules={[
            { required: true, message: "Пожалуйста введите номер телефона!" },
          ]}
        >
          <Input.Password placeholder="Введите ваш номер телефона" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>
            Войти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginModalPage;