const getBaseUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:5001';
  
  // Для эмулятора Android
  if (window.location.hostname === '10.0.2.2') {
    return 'http://10.0.2.2:5001';
  }
  
  // Для браузера на компьютере
  return 'http://localhost:5001';
};

const BASE_URL = getBaseUrl();


export const LOGIN_ADMIN = `${BASE_URL}/admin/login`
export const CHECK_AUTH = `${BASE_URL}/admin/checkAuth`
export const REFRESH_AUTH = `${BASE_URL}/admin/refresh`
export const LOGOUT_ADMIN = `${BASE_URL}/admin/logout`




// export const LOGIN_USER='http://localhost:5001/auth/login'
// export const REGISTER_USER='http://localhost:5001/auth/register'



export const ALL_PRODUCTS = `${BASE_URL}/products`



export  const BASKET = `${BASE_URL}/basket`
export  const ORDERS = `${BASE_URL}/orders`






export const REGISTER_USER=`${BASE_URL}/auth/register`
export const LOGIN_USER=`${BASE_URL}/auth/login`
export const CHECK_AUTH_USER = `${BASE_URL}/auth/checkAuth`
export const REFRESH_AUTH_USER = `${BASE_URL}/auth/refresh`
export const LOGOUT_USER=`${BASE_URL}/auth/logout`
