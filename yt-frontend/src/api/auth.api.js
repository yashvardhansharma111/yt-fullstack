import axios from 'axios'
import toast from 'react-hot-toast'
import { BASE_URL } from '../constants'

const API  = axios.create({
    baseURL : BASE_URL,
    withCredentials : true,
});

// Assuming Api is in youi axios instance

API.interceptors.response.use(
    response => (response),
    async(error)=> {
        const originalRequest = error.config();

        //CHeck if error is due to JWT expire and we have not already retried the request 

        if(
            error?.response?.data?.error === 'jwt expired' && !originalRequest._retry
        ){
            originalRequest._retry = true //Mark the request as retried
            try {
                console.log("this refresh token called")
                const { accessToken } = await refreshAccessToken(); // Assume this function refreshes the token and returns the new one
                // Update the authorization header with the new token
                API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
                return API(originalRequest); // Retry the original request with the new token
              } catch (refreshError) {
                // If the token refresh fails, reject the promise
                return Promise.reject(refreshError);
              }
            }
            // For all other errors, just return the promise rejection
            return Promise.reject(error);
          }
        );


        // In future use when we have time to upadate our backend for otp validation too
       /* export const requestOTP = async (formData) => {
            try {
              const { data } = await API.post("/users/request-login", formData);
              toast.success("OTP has been sent to your email.");
              return data;
            } catch (error) {
              toast.error(error?.response?.data?.error);
              throw error?.response?.data?.error;
            }
          };
          
          export const verifyOTP = async (otpData) => {
            try {
              const { data } = await API.post("/users/verify-otp", otpData);
              toast.success(data?.message);
              return data?.data?.user;
            } catch (error) {
              toast.error(error?.response?.data?.error);
              throw error?.response?.data?.error;
            }
          };
          
          // Function to handle login process
          export const login = async (formData) => {
            try {
              // Step 1: Request OTP
              await requestOTP(formData);
          
              // Step 2: Prompt the user to enter the OTP
              const otp = prompt("Please enter the OTP sent to your email:");
          
              // Step 3: Verify OTP
              const otpData = { ...formData, otp }; // Include OTP with form data
              const user = await verifyOTP(otpData);
              return user;
            } catch (error) {
              throw error;
            }
          }; */

          export const login = async(formData) => {
            try {
                const data = await API.post("/users/login", formData);
                toast.success(data?.message);
                return data?.data?.user;
            } catch (error) {
                toast.error(error?.response?.data?.error)
                throw error?.response?.data?.error
            }
          }

          export const logout = async() => {
            try {
                const data = await API.post("/users/logout");
                toast.success(data?.message);
                return data;
            } catch (error) {
                toast.error(error?.response?.data?.error)
                throw error?.response?.data?.error
            }
          }

          export const getCurrentUser = async () => {
            try {
              const { data } = await API.get("/users/current-user");
              return data?.data?.user;
            } catch (error) {
              throw error?.response?.data?.error;
            }
          };
          
          export const registerUser = async (data) => {
            const formData = new FormData();
          
            if (!data.avatar) {
              toast.error("Avatar is required");
              return;
            }
            formData.append("avatar", data.avatar);
            if (data.coverImage) {
              formData.append("coverImage", data.coverImage);
            }
            formData.append("username", data.username);
            formData.append("email", data.email);
            formData.append("password", data.password);
            formData.append("fullName", data.fullName);
            try {
              const { data } = await API.post("/users/register", formData);
              toast.success(data?.message);
              return data?.data;
            } catch (error) {
              toast.error(error?.response?.data?.error);
              throw error?.response?.data?.error;
            }
          };
          
          export const changePassword = async (newPassData) => {
            try {
              const { data } = await API.post("/users/change-password", newPassData);
              toast.success(data?.message);
              return data;
            } catch (error) {
              toast.error(error?.response?.data?.error);
              throw error?.response?.data?.error;
            }
          };
          
          export const refreshAccessToken = async () => {
            try {
              const { data } = await API.post("/users/refresh-token");
              return data?.data;
            } catch (error) {
              throw error?.response?.data?.error;
            }
          };