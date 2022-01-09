import env from '../src/config/client';
import flatCache from "flat-cache";

//Create the pinata object for API interaction, requires the API and secret key from https://app.pinata.cloud/keys
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(env.keys.pinataApiKey, env.keys.pinataSecretKey);

//Test authentication to Pinata, this can be removed if you don't want the feedback
pinata.testAuthentication().then((result:string) => {
    //handle successful authentication here
    //console.log(result);
    console.log("Authentication to Pinata was successful.")
}).catch((err:string) => {
    //handle error here
    console.log(err);
});

//Set the source path(defined in the .env file) and options for the pinata metadata
const sourcePath = env.collection.metadataJsonPath;
const options = {
    pinataOptions: {
        cidVersion: 0
    }
};

//Pin the directory 
pinata.pinFromFS(sourcePath, options).then((result:string) => {
    //handle results here
    //console.log(result);
    const obj = JSON.parse(JSON.stringify(result))
    let ipfsurl = `https://gateway.pinata.cloud/ipfs/${obj.IpfsHash}`;

    var cache = flatCache.load('.scriptOutputs',"./");
    cache.setKey('METADATA_API_URL', ipfsurl);
    cache.save(true);

    console.log("Uploading to IPFS via Pinata...");
    console.log("The IPFS gateway URL for your content is '%s' (not including the quotes)", ipfsurl)
}).catch((err:string) => {
    //handle error here
    console.log(err);
});