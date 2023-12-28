import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Assuming this is your root reducer

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for non-serializable actions
    }),
});

export default store;
