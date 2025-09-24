export type ApiResponseType<T> ={
    data?: T,
    error?: string | null
}

export type FieldType = {
  login: string;
  password: string;
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