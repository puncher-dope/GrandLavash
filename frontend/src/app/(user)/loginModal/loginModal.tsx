
"use client";
import React, { useState } from "react";
import { Button, Form, Input, message, Spin } from "antd";
import type { FormProps } from "antd";
import { useRouter } from "next/navigation";
import { FieldUserType } from "@/app/lib/types/apiResponseType";
import "./index.scss";
import { useUser } from "@/app/lib/api/store/useUser";
import { useLocalStore } from "@/app/lib/api/store/useLocalStorage";

const LoginModalPage = () => {
  const router = useRouter();
  const { isLoading, login } = useUser();
  const { setUserName, setUserPhone } = useLocalStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

 const onSubmit: FormProps<FieldUserType>["onFinish"] = async (values) => {
  setIsLoggingIn(true);
  
  try {
    setUserName(values.login.trim());
    setUserPhone(values.phone.trim());
    
    
    const loginSuccess = await login(values.login, values.phone);
    
    if (loginSuccess) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentUser = useUser.getState().user;
      
      if (currentUser) {
        message.success(`Добро пожаловать, ${currentUser.login}!`);
        
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 100);
      } else {
        console.error("❌ User is null after successful login");
        message.error("Ошибка входа. Попробуйте еще раз.");
      }
    } else {
      console.error("❌ Login failed");
      message.error("Ошибка входа. Проверьте логин и пароль.");
    }
    
  } catch (error) {
    console.error("❌ Login error:", error);
    message.error("Ошибка входа");
  } finally {
    setIsLoggingIn(false);
  }
};

  const closeLoginModal = () => {
    router.push("/");
  };

  if (isLoading || isLoggingIn) return <Spin />;

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