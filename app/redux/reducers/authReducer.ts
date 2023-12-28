// authReducer.js

const initialState = {
    isLoggedIn: false,
    // другие свойства состояния, связанные с авторизацией, если есть
};

const authReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, isLoggedIn: action.payload };
        case 'LOGOUT':
            return { ...state, isLoggedIn: false };
        // другие обработчики действий (actions) для авторизации
        default:
            return state;
    }
};

export default authReducer;
