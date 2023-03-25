const Jimp = require("jimp");
const path = require("path");

const monthPrefixes = [
    "01_Jan",
    "02_Feb",
    "03_Mar",
    "04_Apr",
    "05_May",
    "06_Jun",
    "07_Jul",
    "08_Aug",
    "09_Sep",
    "10_Oct",
    "11_Nov",
    "12_Dec",
];

const startYear = 1978;
const endYear = 2023;

const getUrl = (monthPrefix, year) => {
    const monthNumber = monthPrefix.substring(0, 2);
    return `https://masie_web.apps.nsidc.org/pub/DATASETS/NOAA/G02135/north/monthly/images/${monthPrefix}/N_${year}${monthNumber}_conc_v3.0.png`
};

const getSavePath = (filename) => {
    return path.resolve(__dirname, "../../../src/babylonjs/iceterrain/images", filename);
}

const downloadImages = async () => {
    const promises = [];

    for (let i = startYear; i <= endYear; i++) {
        for (let j = 0; j < monthPrefixes.length; j++) {
            const monthPrefix = monthPrefixes[j];
            const url = getUrl(monthPrefix, i);

            const savePath = getSavePath(path.basename(url));
            const promise = Jimp.read(url)
                .then(image => image.write(savePath))
                .catch(e => console.error("URL error: ", url));
            promises.push(promise);
        }
    }

    Promise.allSettled(promises)
        .then((values) => {
            console.log("Downloaded items: ", values.length);
        })
        .catch(e => console.error(e));
}

downloadImages();