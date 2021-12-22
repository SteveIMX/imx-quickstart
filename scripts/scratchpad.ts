import flatCache from "flat-cache";


async function main() {
    var cache = flatCache.load('.scriptOutputs',"./");
    cache.getKey('COLLECTION_CONTRACT_ADDRESS') // { foo: 'var' }
    console.log('cache- before: ', cache.getKey('COLLECTION_CONTRACT_ADDRESS'));
    cache.setKey('COLLECTION_CONTRACT_ADDRESS', "0x5285cf2bc95B241Bb7b8e3A8d24aC84dC1BD7E1c");
    console.log('cache- after: ', cache.getKey('COLLECTION_CONTRACT_ADDRESS'));
    cache.save();

    //console.log('COLLECTION_CONTRACT_ADDRESS - before: ', process.env.COLLECTION_CONTRACT_ADDRESS);
    //process.env.COLLECTION_CONTRACT_ADDRESS = "0x5285cf2bc95B241Bb7b8e3A8d24aC84dC1BD7E1c";
    //console.log('COLLECTION_CONTRACT_ADDRESS - after: ', process.env.COLLECTION_CONTRACT_ADDRESS);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
