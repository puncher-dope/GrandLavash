const BASE_URL = 'http://localhost:5001'
//  || 'https://grandlavash-production.up.railway.app';



export const LOGIN_ADMIN = `${BASE_URL}/admin/login`;
export const CHECK_AUTH = `${BASE_URL}/admin/checkAuth`;
export const REFRESH_AUTH = `${BASE_URL}/admin/refresh`;
export const LOGOUT_ADMIN = `${BASE_URL}/admin/logout`;

export const ALL_PRODUCTS = `${BASE_URL}/products`;

export const BASKET = `${BASE_URL}/basket`;
export const ORDERS = `${BASE_URL}/orders`;

export const REGISTER_USER = `${BASE_URL}/auth/register`;
export const LOGIN_USER = `${BASE_URL}/auth/login`;
export const CHECK_AUTH_USER = `${BASE_URL}/auth/checkAuth`;
export const REFRESH_AUTH_USER = `${BASE_URL}/auth/refresh`;
export const LOGOUT_USER = `${BASE_URL}/auth/logout`;