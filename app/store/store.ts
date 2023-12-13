import { configureStore } from '@reduxjs/toolkit';
import dataPressSlice from './reducers/dataPressItem/dataPressItemReducer';
import authPressSlice from './reducers/auth/authReducer'; // Import authSlice here

export const store = configureStore({
  reducer: {
    dataPress: dataPressSlice,
    //@ts-ignore
    authPress: authPressSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>; // Export RootState type for useSelector
export type AppDispatch = typeof store.dispatch; // Export AppDispatch type for useDispatch
