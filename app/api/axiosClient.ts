import axios from 'axios';
import queryString from 'query-string';

import apiConfig from './apiConfig';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/hooks/useAuth';
// import { AuthActionCreators } from '../store/reducers/auth/action-creator';

const axiosClient = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: params => queryString.stringify({ ...params, api_key: apiConfig.apiKey }),
});

axiosClient.interceptors.request.use(async (config) => {

  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }

  const userJsonString  = await AsyncStorage.getItem('user'); // AsyncStorage is used for storage in React Native

  if (userJsonString) {
    const user = JSON.parse(userJsonString || '');
    
    config.headers['Authorization'] = `Bearer ${user.token}`;
  }
  
  return config;
});
axiosClient.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  async (error) => {
    console.log('Error occurred:', error);

    if (error.response) {
      if (error.response.status === 401) {
        console.log('Handling error 401');
     
        const userJsonString  = await AsyncStorage.getItem('user'); // AsyncStorage is used for storage in React Native

        if (userJsonString) {
          const user = JSON.parse(userJsonString || '');
          const tokenData = {
            accessToken: user.token,
            refreshToken: user.refreshToken,
          };

      
         
          const refreshedTokenResponse = await axios.post(
            `${apiConfig.baseUrl}tokens/refresh`,
            tokenData
          );
          console.log('refreshedTokenResponse', refreshedTokenResponse);
         
            

          if (refreshedTokenResponse.data && refreshedTokenResponse.data.token) {
            // Update userToken in AsyncStorage and Axios headers
            const newAccessToken = refreshedTokenResponse.data.token;
            const newRefreshToken = refreshedTokenResponse.data.refreshToken;
            const newAccessUser = { ...user, token: newAccessToken, refreshToken:newRefreshToken };
        
            await AsyncStorage.setItem('user', JSON.stringify(newAccessUser));
            axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        
            // Retry the original request
            return axios.request(error.config);
          } else {
            console.error('Error refreshing token.');
          }
        }
   
        
        // const dispatch = useDispatch();
        // const username = await AsyncStorage.getItem('user');
        // Dispatch your authentication action here
        
        // Example: 
        // dispatch(AuthActionCreators.login(username && JSON.parse(username).email, JSON.parse(username).password));
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }
);

export default axiosClient;
