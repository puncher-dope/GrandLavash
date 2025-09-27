'use client'
import LoginForm from "../components/loginForm/ui"
import { useMyContext } from "../context/contextProvider/contextProvider"
import { Spin } from "antd"

const LoginPage = () => {
  const { isLoading } = useMyContext()

  // useEffect(() => {
  //  const time = setTimeout(() => {
  //   setTimer(false)
  //  }, 300) 
  //  return () => clearTimeout(time)
  // }, [])


  if (isLoading ) {
    return <Spin />
  }

  return <LoginForm />
}

export default LoginPage