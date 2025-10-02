import axios, { AxiosRequestConfig, AxiosError } from "axios";

const BASE_URL = "http://localhost:5001/api/";

interface ApiCommonResponse<T = any> {
  success: boolean;
  message: string;
  data: T; // now generic
  errors?: any;
}
// Centralized error logger
const handleError = (error: AxiosError) => {
  if (error.response) {
    console.error("Server Error:", error.response.status, error.response.data);
  } else if (error.request) {
    console.error("No Response from server", error.request);
  } else {
    console.error("Error:", error.message);
  }
};

const config: AxiosRequestConfig = {
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
  responseType: "json",
};
// ----------------- GET REQUEST -----------------
// Only query params or path params, no payload
export const getRequest = async <T = any>(
  url: string
): Promise<ApiCommonResponse<T>> => {
  try {
    const response = await axios.get<ApiCommonResponse<T>>(
      `${BASE_URL}${url}`,
      config
    );
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    throw error;
  }
};

// ----------------- POST REQUEST -----------------
// Only payload, optional config for headers, etc.
export const postRequest = async <T = any, U = Record<string, any>>(
  url: string,
  payload: U
): Promise<ApiCommonResponse<T>> => {
  try {
    const response = await axios.post<ApiCommonResponse<T>>(
      `${BASE_URL}${url}`,
      payload,
      config
    );
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    throw error;
  }
};

// ----------------- PUT REQUEST -----------------
export const putRequest = async <T = any, U = Record<string, any>>(
  url: string,
  payload: U
): Promise<ApiCommonResponse<T>> => {
  try {
    const response = await axios.put<ApiCommonResponse<T>>(
      `${BASE_URL}${url}`,
      payload,
      config
    );
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    throw error;
  }
};

// ----------------- DELETE REQUEST -----------------
// Can pass query params via config, rarely body
export const deleteRequest = async <T = any>(
  url: string
): Promise<ApiCommonResponse<T>> => {
  try {
    const response = await axios.delete<ApiCommonResponse<T>>(
      `${BASE_URL}${url}`,
      config
    );
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    throw error;
  }
};
