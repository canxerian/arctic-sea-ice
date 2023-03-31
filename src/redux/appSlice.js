import { createSlice } from '@reduxjs/toolkit'
import { FilterOptions } from './FilterOptions';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        activeIceDataIndex: 0,
        currentFilter: FilterOptions.allArea,
        cameraZoomNormalised: 0,
        isOverridingZoom: false,
    },
    reducers: {
        setActiveIceDataIndex: (state, action) => {
            state.activeIceDataIndex = action.payload;
        },
        setCurrentFilter: (state, action) => {
            state.currentFilter = action.payload;
        },
        setCameraZoomNormalised: (state, action) => {
            state.cameraZoomNormalised = action.payload;
        },
        setIsOverridingZoom: (state, action) => {
            state.isOverridingZoom = action.payload;
        }
    },
});

// Action creators are generated for each case reducer function
export const {
    setActiveIceDataIndex,
    setCurrentFilter,
    setCameraZoomNormalised,
    setIsOverridingZoom,
} = appSlice.actions;

export default appSlice.reducer;