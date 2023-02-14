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
        minExtent: Number.MAX_VALUE,
        maxExtent: Number.MIN_VALUE,
        minArea: Number.MAX_VALUE,
        maxArea: Number.MIN_VALUE
    };

    for (let i = 1; i <= 12; i++) {
        const month = getMonth(i);
        const path = `./N_${month}_extent_v3.0.csv`;

        const json = await csvtojson().fromFile(path);

        // Stick all data points in to a single array and then sort later
        arcticIceData.data = arcticIceData.data.concat(json);
    }

    // Sort by year
    arcticIceData.data.sort((a, b) => {
        const aYear = parseInt(a.year);
        const bYear = parseInt(b.year);

        return aYear - bYear;
    });

    // Assert order
    for (let i = 0; i < arcticIceData.data.length - 1; i++) {
        const a = arcticIceData.data[i];
        const b = arcticIceData.data[i + 1];

        const compNumA = (parseInt(a.year) * 100) + parseInt(a.mo);         // '1979', '1' becomes 197901, for comparison
        const compNumB = (parseInt(b.year) * 100) + parseInt(b.mo);

        console.assert(compNumA < compNumB, `a: ${compNumA}, b: ${compNumB}`);
    }

    // Find min max extent and area
    for (let i = 0; i < arcticIceData.data.length; i++) {
        const dataItem = arcticIceData.data[i];
        arcticIceData.minExtent = Math.min(dataItem.extent, arcticIceData.minExtent);
        arcticIceData.maxExtent = Math.max(dataItem.extent, arcticIceData.maxExtent);
        arcticIceData.minArea = Math.min(dataItem.area, arcticIceData.minArea);
        arcticIceData.maxArea = Math.max(dataItem.area, arcticIceData.maxArea);
    }

    await fs.promises.writeFile(outputPath, JSON.stringify(arcticIceData));
}

process();