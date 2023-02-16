const { data } = require('browserslist');
const csvtojson = require('csvtojson');
const fs = require('fs');

const outputPath = "../../src/Data/ArcticIceData.json";

/**
 * Returns a string format for a given month
 * @param {Number} month as a number, e.g 1, 2.. 12 
 */
const getMonth = (month) => String("0" + month).slice(-2);

/**
 * Reads Arctic Snow/Ice data CSV files and combines in to a single, sorted array
 * 
 * @returns CSV data array, sorted by chronologically
 */
const getCsvArray = async () => {
    let dataArray = [];
    // Read CSV and combine in to a single array
    for (let i = 1; i <= 12; i++) {
        const month = getMonth(i);
        const path = `./N_${month}_extent_v3.0.csv`;

        const json = await csvtojson().fromFile(path);

        // Stick all data points in to a single array and then sort later
        dataArray = dataArray.concat(json);
    }

    // Convert year, mo(nth), area and extent to numbers
    dataArray = dataArray.map(dataItem => ({
        year: parseInt(dataItem.year),
        month: parseInt(dataItem.mo),
        extent: parseFloat(dataItem.extent),
        area: parseFloat(dataItem.area)
    }));

    // Sort
    dataArray.sort((a, b) => getDateHash(a.year, a.month) - getDateHash(b.year, b.month));

    return dataArray;
}

/**
 * Traverses {dataArray} for min/max entries of a {property} for a given year. 
 * @param {*} dataArray 
 * @param {*} property 
 * 
 * @returns Sorted array (by time) containing min/max entries for a given year
 */
const getMinMaxForProperty = (dataArray, property) => {
    const minMaxarray = [];

    // Find min/max entries for each year
    let prevDataItem = dataArray[0];
    let minAreaData = prevDataItem;
    let maxAreaData = prevDataItem;

    for (let i = 1; i < dataArray.length; i++) {
        const dataItem = dataArray[i];

        if (prevDataItem.year !== dataItem.year) {
            minMaxarray.push(maxAreaData, minAreaData);
            minAreaData = dataItem;
            maxAreaData = dataItem;
        }

        if (dataItem[property] < minAreaData[property]) {
            minAreaData = dataItem;
        }
        if (dataItem[property] > maxAreaData[property]) {
            maxAreaData = dataItem;
        }

        prevDataItem = dataItem;
    }

    minMaxarray.sort((a, b) => getDateHash(a.year, a.month) - getDateHash(b.year, b.month));
    
    return minMaxarray;
}

const process = async () => {
    let arcticIceData = {
        data: [],
        minMaxAreaByYear: [],               // The min and max entries for each year, sorted by time
        minMaxExtentByYear: [],
        minExtent: Number.MAX_VALUE,
        maxExtent: Number.MIN_VALUE,
        minArea: Number.MAX_VALUE,
        maxArea: Number.MIN_VALUE,
    };

    arcticIceData.data = await getCsvArray();


    arcticIceData.minMaxAreaByYear = getMinMaxForProperty(arcticIceData.data, "area");
    arcticIceData.minMaxExtentByYear = getMinMaxForProperty(arcticIceData.data, "extent");

    // Find min max extent and area
    for (let i = 0; i < arcticIceData.data.length; i++) {
        const dataItem = arcticIceData.data[i];
        arcticIceData.minExtent = Math.min(dataItem.extent, arcticIceData.minExtent);
        arcticIceData.maxExtent = Math.max(dataItem.extent, arcticIceData.maxExtent);
        arcticIceData.minArea = Math.min(dataItem.area, arcticIceData.minArea);
        arcticIceData.maxArea = Math.max(dataItem.area, arcticIceData.maxArea);
    }

    assertOrder(arcticIceData.data);
    assertOrder(arcticIceData.minMaxAreaByYear);
    assertOrder(arcticIceData.minMaxExtentByYear);

    await fs.promises.writeFile(outputPath, JSON.stringify(arcticIceData));
}

/**
 * Returns a year + month hash for comparison.
 * 
 * e.g '1979', '1' becomes 197901
 * @param {Number} year 
 * @param {Number} month 
 * @returns year/month Number for comparison 
 */
const getDateHash = (year, month) => year * 100 + month;

const assertOrder = (dataArrar) => {
    // Assert order
    for (let i = 0; i < dataArrar.length - 1; i++) {
        const a = dataArrar[i];
        const b = dataArrar[i + 1];

        const compNumA = getDateHash(a.year, a.month);
        const compNumB = getDateHash(b.year, b.month);

        console.assert(compNumA < compNumB, `a: ${compNumA}, b: ${compNumB}`);
    }
}

process();