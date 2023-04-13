# Arctic Sea Ice Data Visualisation

A cosy, 3D data visualisation using National Snow and Ice Data Center, https://nsidc.org/data/seaice_index/data-and-image-archive.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Getting Start

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run deploy`

Deploys the app to https://canxerian.com/arctic-sea-ice/

# Assets

## Arctic Sea Index data
The data was downloaded from https://nsidc.org/data/seaice_index/data-and-image-archive. Script used to process the data lives here: [combineIceData.js](./_source_assets/data/extentAndArea/combineIceData.js), [downloadImages.js](./_source_assets/data/images/downloadImages.js)

## NASA Earth textures
https://www.nasa.gov/multimedia/imagegallery/index.html

## Image based lighting
.env files are created using the BabylonJS IBL tool. See https://doc.babylonjs.com/features/featuresDeepDive/materials/using/HDREnvironment  

