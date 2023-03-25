import ArcticIceData from "../data/ArcticIceData.json";

export const FilterOptions = {
    allArea: "All - area",
    allArea: "All - extent",
    yearlyMinArea: "Yearly min area",
    yearlyMaxArea: "Yearly max area",
    yearlyMinMaxArea: "Yearly min/max area",
    yearlyMinExtent: "Yearly min extent",
    yearlyMaxExtent: "Yearly max extent",
    yearlyMinMaxExtent: "Yearly min/max extent",

};

export const DataField = {
    Area: 0,
    Extent: 1
};

const FilterOptionDataLookup = {};
FilterOptionDataLookup[FilterOptions.allArea] = ArcticIceData.data;
FilterOptionDataLookup[FilterOptions.yearlyMinArea] = ArcticIceData.yearlyMinArea;
FilterOptionDataLookup[FilterOptions.yearlyMaxArea] = ArcticIceData.yearlyMaxArea;
FilterOptionDataLookup[FilterOptions.yearlyMinMaxArea] = ArcticIceData.yearlyMinMaxArea;
FilterOptionDataLookup[FilterOptions.yearlyMinExtent] = ArcticIceData.yearlyMinExtent;
FilterOptionDataLookup[FilterOptions.yearlyMaxExtent] = ArcticIceData.yearlyMaxExtent;
FilterOptionDataLookup[FilterOptions.yearlyMinMaxExtent] = ArcticIceData.yearlyMinMaxExtent;

export const GetDataForFilter = (filter) => {
    return {
        dataSet: FilterOptionDataLookup[filter]
    };
}