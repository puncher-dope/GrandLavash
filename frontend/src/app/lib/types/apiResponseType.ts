import { ProductType } from "./productsContextType";

export type ApiResponseType<T> ={
    data?: T,
    error?: string | null
}

export type FieldType = {
  login: string;
  password: string;
};

export type FieldUserType = {
  login: string;
  phone: string;
};


export type LoginResponseType = {
    error?: string,
    admin?:{
        id: string
        login:string,
        role: number
    },
    refreshToken: string,
}








export type LoginUserResponseType = {
    error?: string,
    user?:{
        id: string
        createdAt:string
        login:string,
        phone: string
        orders: ProductType[]
        role: number
    },
    refreshToken: string,
}