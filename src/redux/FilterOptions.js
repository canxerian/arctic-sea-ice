import ArcticIceData from "../data/ArcticIceData.json";

export const FilterOptions = {
    allArea: "All - area",
    allExtent: "All - extent",
    yearlyMinArea: "Yearly min area",
    yearlyMaxArea: "Yearly max area",
    yearlyMinMaxArea: "Yearly min/max area",
    yearlyMinExtent: "Yearly min extent",
    yearlyMaxExtent: "Yearly max extent",
    yearlyMinMaxExtent: "Yearly min/max extent",

};

export const ArcticDataProperty = {
    Area: 0,
    Extent: 1
};

const filterOptionData = {};
filterOptionData[FilterOptions.allArea] = ArcticIceData.data;
filterOptionData[FilterOptions.allExtent] = ArcticIceData.data;
filterOptionData[FilterOptions.yearlyMinArea] = ArcticIceData.yearlyMinArea;
filterOptionData[FilterOptions.yearlyMaxArea] = ArcticIceData.yearlyMaxArea;
filterOptionData[FilterOptions.yearlyMinMaxArea] = ArcticIceData.yearlyMinMaxArea;
filterOptionData[FilterOptions.yearlyMinExtent] = ArcticIceData.yearlyMinExtent;
filterOptionData[FilterOptions.yearlyMaxExtent] = ArcticIceData.yearlyMaxExtent;
filterOptionData[FilterOptions.yearlyMinMaxExtent] = ArcticIceData.yearlyMinMaxExtent;

const filterOptionProperty = {};
filterOptionProperty[FilterOptions.allArea] = ArcticDataProperty.Area;
filterOptionProperty[FilterOptions.allExtent] = ArcticDataProperty.Extent;
filterOptionProperty[FilterOptions.yearlyMinArea] = ArcticDataProperty.Area;
filterOptionProperty[FilterOptions.yearlyMaxArea] = ArcticDataProperty.Area;
filterOptionProperty[FilterOptions.yearlyMinMaxArea] = ArcticDataProperty.Area;
filterOptionProperty[FilterOptions.yearlyMinExtent] = ArcticDataProperty.Extent;
filterOptionProperty[FilterOptions.yearlyMaxExtent] = ArcticDataProperty.Extent;
filterOptionProperty[FilterOptions.yearlyMinMaxExtent] = ArcticDataProperty.Extent;


export const GetDataForFilter = (filter) => {
    return {
        dataSet: filterOptionData[filter],
        property: filterOptionProperty[filter]
    };
}