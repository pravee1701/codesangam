import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import store from "./store/index.js"
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import axios from 'axios'
import ApiError from './services/ApiError.js'
import ApiRequest from './services/ApiRequest.js'
import { USER_BASE_URL } from './constants.js'

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URI;
axios.defaults.withCredentials = true;

/* Refresh Token */

/* Flag to check if token refresh is in progress */
let refreshingTokenInProgress = false;

/* Axios response intercepto */
axios.interceptors.response.use(
  (response) => response,
  async (error) => {

    /* If an error has occurred from refresh token api */
    if (error?.config?.url?.includes("refresh-token")) {
      return Promise.reject(error);
    }
    /*If the response status is 401, and the requested api end point is not login api  */
    if (
      error?.response?.status === 401 &&
      !error?.config?.url?.includes("login") &&
      !refreshingTokenInProgress
    ) {

      /* Refreshing the token */
      refreshingTokenInProgress = true;

      const apiRequest = new ApiRequest(`${USER_BASE_URL}/refresh-token`)
      const response = await apiRequest.postRequest({})

      refreshingTokenInProgress = false;

      /* Refresh token success */
      if (!(response instanceof ApiError)) {
        /* Replay the original request */
        return axios(error.config);
      }
    }

    /* Other errors */
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
      <App />
  </Provider>
)
