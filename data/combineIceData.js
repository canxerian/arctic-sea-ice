const csvtojson = require('csvtojson');
const fs = require('fs');

const outputPath = "../src/Data/ArcticIceData.json";

/**
 * Returns a string format for a given month
 * @param {Number} month as a number, e.g 1, 2.. 12 
 */
const getMonth = (month) => String("0" + month).slice(-2);

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

    for (let i = 1; i <= 12; i++) {
        const month = getMonth(i);
        const path = `./N_${month}_extent_v3.0.csv`;

        const json = await csvtojson().fromFile(path);

        // Stick all data points in to a single array and then sort later
        arcticIceData.data = arcticIceData.data.concat(json);
    }

    // Convert year, mo(nth), area and extent to numbers
    arcticIceData.data = arcticIceData.data.map(dataItem => ({
        year: parseInt(dataItem.year),
        month: parseInt(dataItem.mo),
        extent: parseFloat(dataItem.extent),
        area: parseFloat(dataItem.area)
    }));

    // Sort by year
    arcticIceData.data.sort((a, b) => a.year - b.year);

    // Find min/max entries for each year
    // for (let i = 0; i < arcticIceData.data.length; i++) {
    //     const dataItem = arcticIceData.data[i];
    //     let min = Number.MAX_VALUE;
    //     let max = Number.MIN_VALUE;

    //     min = Math.min(min, parseInt(dataItem.area)
    // }

    // Find min max extent and area
    for (let i = 0; i < arcticIceData.data.length; i++) {
        const dataItem = arcticIceData.data[i];
        arcticIceData.minExtent = Math.min(dataItem.extent, arcticIceData.minExtent);
        arcticIceData.maxExtent = Math.max(dataItem.extent, arcticIceData.maxExtent);
        arcticIceData.minArea = Math.min(dataItem.area, arcticIceData.minArea);
        arcticIceData.maxArea = Math.max(dataItem.area, arcticIceData.maxArea);
    }

    assertOrder(arcticIceData.data);

    await fs.promises.writeFile(outputPath, JSON.stringify(arcticIceData));
}

const assertOrder = (dataArrar) => {
    // Assert order
    for (let i = 0; i < dataArrar.length - 1; i++) {
        const a = dataArrar[i];
        const b = dataArrar[i + 1];

        const compNumA = (a.year * 100) + a.month;         // '1979', '1' becomes 197901, for comparison
        const compNumB = (b.year * 100) + b.month;

        console.assert(compNumA < compNumB, `a: ${compNumA}, b: ${compNumB}`);
    }
}

process();