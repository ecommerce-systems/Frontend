import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export function setAccessToken(token) {
  if (token) {
    localStorage.setItem("access_token", token);
  } else {
    localStorage.removeItem("access_token");
  }
}

export function getAccessToken() {
  return localStorage.getItem("access_token");
}

axiosInstance.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() };
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    const duration = new Date() - response.config.metadata.startTime;
    window.dispatchEvent(new CustomEvent("api-response-time", { 
      detail: { 
        url: response.config.url,
        duration,
        method: response.config.method.toUpperCase()
      } 
    }));
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (originalRequest && originalRequest.metadata) {
      const duration = new Date() - originalRequest.metadata.startTime;
      window.dispatchEvent(new CustomEvent("api-response-time", { 
        detail: { 
          url: originalRequest.url,
          duration,
          method: originalRequest.method.toUpperCase(),
          error: true
        } 
      }));
    }
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/v2/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newAccessToken = refreshResponse.data.accessToken;
        setAccessToken(newAccessToken);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
      }
    }
    return Promise.reject(error);
  }
);

export const searchProductNames = (keyword) => {
  return axiosInstance.get('/api/v2/products/search', {
    params: { keyword },
  });
};

export const searchProductsPaginated = (keyword, page = 0, size = 10) => {
  return axiosInstance.get('/api/v2/products/search/results', {
    params: { keyword, page, size },
  });
};


export default axiosInstance;
