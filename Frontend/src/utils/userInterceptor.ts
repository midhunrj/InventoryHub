import axios from "axios";
import { userUrl } from "./config/urlConfig";
import { log } from "util";


export const userAuthenticate = axios.create({
    baseURL: userUrl, 
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

userAuthenticate.interceptors.request.use(
    (request) => {
        const userAccessToken = localStorage.getItem('inventoryAccessToken');
        if (userAccessToken) {
            console.log("gdfgdf",userAccessToken);
            
            request.headers.Authorization = `Bearer ${userAccessToken}`;
        }
        console.log("skfnskjs");
        
        return request;
    },  
    (error) => {
        return Promise.reject(error);
    }
);

userAuthenticate.interceptors.response.use(
    (response) => {
        console.log("njfksdfsk");
        
        return response;
    },
    async (error) => {
        const originalRequest = error.config; 
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                console.log("sdlkfs");
                
                const response = await userAuthenticate.get('/auth/refreshtoken');
                const newuserAccessToken = response.data.accessToken;
                localStorage.setItem('inventoryAccessToken', newuserAccessToken);

                userAuthenticate.defaults.headers.common["Authorization"] = `Bearer ${newuserAccessToken}`;

                return userAuthenticate(originalRequest);
            } catch (error) {
                console.log("Token refresh failed", error);
            }
        }
        return Promise.reject(error);
    }
);
