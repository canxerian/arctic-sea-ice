const csvtojson = require('csvtojson');
const fs = require('fs');

const outputPath = "../src/Data/ArcticIceData.json";

/**
 * Returns a string format for a given month
 * @param {Number} month as a number, e.g 1, 2.. 12 
 */
const getMonth = (month) => String("0" + month).slice(-2);

const process = async () => {
    let allDataByMonth = [];

    for (let i = 1; i <= 12; i++) {
        const month = getMonth(i);
        const path = `./N_${month}_extent_v3.0.csv`;

        const json = await csvtojson().fromFile(path);

        // Stick all data points in to a single array and then sort later
        allDataByMonth = allDataByMonth.concat(json);
    }

    // Sort by year
    allDataByMonth.sort((a, b) => {
        const aYear = parseInt(a.year);
        const bYear = parseInt(b.year);

        return aYear - bYear;
    });

    // Assert order
    for (let i = 0; i < allDataByMonth.length - 1; i++) {
        const a = allDataByMonth[i];
        const b = allDataByMonth[i + 1];

        const compNumA = (parseInt(a.year) * 100) + parseInt(a.mo);         // '1979', '1' becomes 197901, for comparison
        const compNumB = (parseInt(b.year) * 100) + parseInt(b.mo);

        console.assert(compNumA < compNumB, `a: ${compNumA}, b: ${compNumB}`);
    }

    // Find min max extent and area
    let minExtent = 99999999;
    let maxExtent = 0;
    let minArea = 999999999;
    let maxArea = 0;
    for (let i = 0; i < allDataByMonth.length; i++) {
        const dataItem = allDataByMonth[i];
        minExtent = Math.min(dataItem.extent, minExtent);
        maxExtent = Math.max(dataItem.extent, maxExtent);
        minArea = Math.min(dataItem.area, minArea);
        maxArea = Math.max(dataItem.area, maxArea);
    }

    allDataByMonth.minExtent = minExtent;
    allDataByMonth.maxExtent = maxExtent;
    allDataByMonth.minArea = minArea;
    allDataByMonth.maxArea = maxArea;

    await fs.promises.writeFile(outputPath, JSON.stringify(allDataByMonth));
}

process();