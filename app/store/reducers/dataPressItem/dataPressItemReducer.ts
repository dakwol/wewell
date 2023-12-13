
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataPressState } from "./types";

const initialState: DataPressState = {
  dataPress: {},
};

const dataPressSlice = createSlice({
  name: 'dataPress',
  initialState: initialState,
  reducers: {
    setDatapress: (state, action: PayloadAction<{ fieldName: string; fieldValue: any }>) => {
      state.dataPress = { ...state.dataPress, [action.payload.fieldName]: action.payload.fieldValue };
    },
    
    clearDatapress: (state) => {
      state.dataPress = {};
    },
  },
});

export const { setDatapress, clearDatapress } = dataPressSlice.actions;
export default dataPressSlice.reducer;
