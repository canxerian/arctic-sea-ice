import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        activeIceDataIndex: 0,
    },
    reducers: {
        setActiveIceDataIndex: (state, action) => {
            state.activeIceDataIndex = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    setActiveIceDataIndex
} = appSlice.actions;

export default appSlice.reducer;