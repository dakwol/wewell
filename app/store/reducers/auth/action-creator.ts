import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store';
import { IUser } from '../../../models/IUser';
import { IToken } from '../../../models/IToken';
import TokenApiRequest from '../../../api/User/Token';
import JWT from 'expo-jwt';
import UserApiRequest from '../../../api/User/Users';

// Define the initial state
interface AuthState {
  isAuth: boolean;
  user: IUser;
  token: IToken;
  isLoading: boolean;
  error: string;
}

const initialState: AuthState = {
  isAuth: false,
  user: {} as IUser,
  token: {} as IToken,
  isLoading: false,
  error: '',
};

// Create a slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
      state.isLoading = false;
    },
    setErr: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setToken: (state, action: PayloadAction<IToken>) => {
      state.token = action.payload;
    },
  },
});

// Export actions and reducer
export const { setIsAuth, setErr, setUser, setIsLoading, setToken } = authSlice.actions;
export default authSlice.reducer;

// Thunks
export const login = (phone_number: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(setIsLoading(true));
  const mockUser = { phone_number, password };
  const userToken = new TokenApiRequest();
  const userData = new UserApiRequest();

  if (mockUser.phone_number.length === 0 || mockUser.password.length === 0) {
    dispatch(setErr('Некорректный логин или пароль'));
    dispatch(setIsLoading(false));
    return;
  }

  try {
    const resp = await userToken.create({ body: mockUser });

    if (resp.success) {
      const tokens = resp.data as IToken;
      dispatch(setToken(tokens));
      localStorage.setItem('access', tokens.access || '');
      localStorage.setItem('refresh', tokens.refresh || '');
    
      //@ts-ignore
      const decodeJwt = JWT.decode(tokens.refresh, 'shh') as { user_id: string } | null;

      if (localStorage.getItem('access') && decodeJwt) {
        const userResp = await userData.getById({ id: decodeJwt.user_id + '/' });

        if (userResp.success) {
          localStorage.setItem('auth', 'true');
          localStorage.setItem('phone_number', mockUser.phone_number);

          if (userResp.data) {
            const data: { first_name?: string; last_name?: string; patronymic?: string; phone_number?: string } = userResp.data;

            const user = {
              phone: data.phone_number,
              firstname: data.first_name,
              lastname: data.last_name,
              patronymic: data.patronymic,
            };

            localStorage.setItem('user', JSON.stringify(user));
            dispatch(setIsAuth(true));
            dispatch(setUser({
              password: mockUser.password,
              firstname: userResp.data.first_name,
              lastname: userResp.data.last_name,
              patronymic: userResp.data.patronymic,
              phone_number: userResp.data.phone_number,
            }));
          } else {
            dispatch(setErr('Ошибка получения пользователя'));
          }
        }
      }
    } else {
      console.log(resp);
      dispatch(setErr('Произошла ошибка авторизации'));
    }
  } catch (e) {
    dispatch(setErr('Произошла ошибка при авторизации'));
  } finally {
    dispatch(setIsLoading(false));
  }
};

export const logout = () => async (dispatch: AppDispatch) => {
  dispatch(setIsLoading(true));
  localStorage.removeItem('auth');
  localStorage.removeItem('user');
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  dispatch(setIsAuth(false));
  dispatch(setUser({} as IUser));
  dispatch(setIsLoading(false));
};
