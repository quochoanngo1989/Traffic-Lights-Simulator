const ASSET_MAP=new Map();
ASSET_MAP.set("civilian",{
    modelName:"civilian",
    modelFile:"ego-models/civilian.gltf",
    size:"~2.4 MB",
    transform:{
        origin:[0,0,0],
        scale:[1,1,1],
        rotate:[Math.PI,0,-Math.PI/2]
    }
});
ASSET_MAP.set("mercerdes",{
    modelName:"mercerdes",
    modelFile:"ego-models/result.gltf",
    size:"~9 MB",
    transform:{
        origin:[0,0,0],
        scale:[0.028,0.028,0.028],
        rotate:[Math.PI/2,Math.PI,0]
    }
});

ASSET_MAP.set("car",{
    modelName:"car",
    modelFile:"ego-models/car.glb",
    size:"~1.5 MB",
    transform:{
        origin:[0,0,0],
        scale:[0.1,0.1,0.1],
        rotate:[Math.PI/2,Math.PI,0]
    }
})
export {ASSET_MAP};
