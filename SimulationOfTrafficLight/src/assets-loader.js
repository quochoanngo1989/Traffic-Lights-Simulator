import {load} from '@loaders.gl/core';
import {GLTFLoader} from '@loaders.gl/gltf';

export function loadAssets(assetsMap, assetsFolder=null){
    return Promise.all(assetsMap.keys().map(k=>{
        return new Promise((resolve,reject)=>{
            const url=assetsFolder?assetsFolder+"/"+assetsMap.get(k).modelFile:assetsMap.get(k).modelFile;
            load(url, GLTFLoader).then(model=>{
                const loadedModel={...assetsMap.get(k)} 
                loadedModel.model=model;
                resolve(loadedModel);
            }).catch(e=>reject(e));
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