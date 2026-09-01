import { useLoader } from '@react-three/fiber'
export function loadAssets(assetsMap, assetsFolder=null){
    return Promise.all(assetsMap.keys().map(k=>{
        return new Promise((resolve,reject)=>{
            const asset= assetsMap.get(k);
            const url=assetsFolder?assetsFolder+"/"+asset.modelFile:asset.modelFile;
            useLoader(asset.loader, url).then(model=>{
                const loadedModel={...asset} 
                loadedModel.model=model;
                resolve(loadedModel);
            }).catch(e=>{console.log(e); reject(e)});
        });
        
    }))
}
export function getAssets(assetsArray){
    const ASSETS=new Map();
    assetsArray.forEach(e => {
        ASSETS.set(e.modelName,e);
    });
    return ASSETS;
}