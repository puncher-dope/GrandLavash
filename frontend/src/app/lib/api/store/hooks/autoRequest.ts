
import { REFRESH_AUTH_USER } from "../../constants/api";

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const autoRequest = async <T>(
  url: string,
  method: string = "GET",
  body?: unknown
): Promise<{ data?: T; error?: string }> => {
  const makeRequest = async (): Promise<Response> => {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return fetch(url, options);
  };

  try {
    let response = await makeRequest();

    if (response.status === 401 && 
        !url.includes('/refresh') && 
        !url.includes('/logout') &&
        !url.includes('/login') &&
        !url.includes('/register')) {
      
      try {
        const refreshResponse = await fetch(REFRESH_AUTH_USER, {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          response = await makeRequest();
        } else {
          throw new AuthError('Refresh failed');
        }
      } catch (refreshError) {
        throw new AuthError(`Session expired, need to login again, ${refreshError}`);
      }
    }

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Request failed" };
    }

    return { data };
  } catch (e) {
    if (e instanceof AuthError) {
      return { error: e.message };
    }
    return { error: e instanceof Error ? e.message : "Unknown error" };
  }
};