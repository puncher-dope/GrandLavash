'use client'
import LoginForm from "../../components/loginForm/LoginForm"
import { useMyContext } from "../../context/contextProvider/contextProvider"
import { Spin } from "antd"

const LoginPage = () => {
  const { isLoading } = useMyContext()

  if (isLoading ) {
    return <Spin />
  }

  return <LoginForm />
}

export default LoginPage