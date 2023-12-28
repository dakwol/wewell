// authActions.js

export const login = (isLoggedIn: object) => {
  return {
    type: 'LOGIN', // Здесь изменено на 'LOGIN'
    payload: isLoggedIn,
  };
};
