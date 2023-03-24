import ArcticIceData from "../data/ArcticIceData.json";

export const FilterOptions = {
    all: "All",
    yearlyMinArea: "Yearly min area",
    yearlyMaxArea: "Yearly max area",
    yearlyMinMaxArea: "Yearly min/max area",
    yearlyMinExtent: "Yearly min extent",
    yearlyMaxExtent: "Yearly max extent",
    yearlyMinMaxExtent: "Yearly min/max extent",

};

export const FilterOptionDataLookup = {};
FilterOptionDataLookup[FilterOptions.all] = ArcticIceData.data;
FilterOptionDataLookup[FilterOptions.yearlyMinArea] = ArcticIceData.yearlyMinArea;
FilterOptionDataLookup[FilterOptions.yearlyMaxArea] = ArcticIceData.yearlyMaxArea;
FilterOptionDataLookup[FilterOptions.yearlyMinMaxArea] = ArcticIceData.yearlyMinMaxArea;
FilterOptionDataLookup[FilterOptions.yearlyMinExtent] = ArcticIceData.yearlyMinExtent;
FilterOptionDataLookup[FilterOptions.yearlyMaxExtent] = ArcticIceData.yearlyMaxExtent;
FilterOptionDataLookup[FilterOptions.yearlyMinMaxExtent] = ArcticIceData.yearlyMinMaxExtent;