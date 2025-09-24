import { ApiResponseType } from "../shared/types/apiResponseType";

const activeRequest = new Set<string>()

export async function request<T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    body?: unknown
):Promise<ApiResponseType<T>> {
    const requestKey = `${method}:${url}`

    if(activeRequest.has(requestKey)){
        return {data: undefined, error: 'Request already in progress'}
    }

    activeRequest.add(requestKey)

    try{
        const response = await fetch(url, {
            headers: {
                'Content-type': 'application/json'
            },
            method,
            credentials: 'include',
            body: body ? JSON.stringify(body) : undefined
        })

        const text = await response.text()

        if(!response.headers.get('Content-type')?.includes('application/json') && response.status >= 400){
            throw new Error(`Server return HTML: ${text.slice(0, 100)}...`)
        }

        const data = JSON.parse(text)

        return {data, error:null}

    }catch(e){
        return{
            data: undefined,
            error: e instanceof Error ? e.message : 'Unknown Error'
        }
    }finally{
        activeRequest.delete(requestKey)
    }
}