import axios from 'axios';

export const httpRequestHandler = (() => {
  const handler = axios.create();
  handler.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log("httpRequestHandler error");
      if ((error.response.status === 422 || error.response.status === 401 || error.response.status === 403) && error.response.data.msg === "Signature verification failed") {
        redirect();
      }
      return Promise.reject(error);
    }
  );
  return handler;
})();
