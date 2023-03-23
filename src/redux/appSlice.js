import { createSlice } from '@reduxjs/toolkit'
import FilterOptions from './FilterOptions';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        activeIceDataIndex: 0,
        currentFilter: FilterOptions.all,
    },
    reducers: {
        setActiveIceDataIndex: (state, action) => {
            state.activeIceDataIndex = action.payload;
        },
        setCurrentFilter: (state, action) => {
            state.currentFilter = action.payload;
        }
    },
});

// Action creators are generated for each case reducer function
export const {
    setActiveIceDataIndex,
    setCurrentFilter
} = appSlice.actions;

export default appSlice.reducer;