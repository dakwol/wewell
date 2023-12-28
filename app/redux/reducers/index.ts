import { combineReducers } from 'redux';
import userReducer from './userReducer'; // Импортируйте свои редьюсеры
import authReducer from './authReducer';
import userData from './userData';

const rootReducer = combineReducers({
    auth: authReducer, // Добавьте ваши редьюсеры сюда
    user: userReducer, // Добавьте ваши редьюсеры сюда
    userData: userData, // Добавьте ваши редьюсеры сюда
    // Другие редьюсеры
});


export default rootReducer;
