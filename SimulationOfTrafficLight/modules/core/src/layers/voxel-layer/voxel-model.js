export const VERTICES=[
    [-0.5, -0.5, 0.5],//v0
    [0.5, -0.5, 0.5],//v1
    [0.5, 0.5, 0.5],//v2
    [-0.5, 0.5, 0.5],//v3
    [-0.5, -0.5, -0.5],//v4
    [0.5, -0.5, -0.5],//v5
    [0.5, 0.5, -0.5],//v6
    [-0.5, 0.5, -0.5],//v7,
    [0, 0, 0],//v8= Origin
    [1, 0, 0],//v9=Vector Ox
    [0, 1, 0],//v10= Vector Oy
    [0, 0, 1],//v11= Vector Oz
    [0, 0, -0.5]//v12 =track point;
  ];
export const VOXEL_DEFAULT_SETTING={
xNumber:100,
yNumber:100,
zNumber:4,
scale:[1,1,1],
orientation:{roll:0,pitch:0,yaw:0},
center:[0,0,0],
cubeColor: [255,0,0],
edgeColor:[100,20,20],
cubeOpacity:0.1,
edgeOpacity:0.1
}
  export function initiateVoxels(pros){
    const {xNumber,yNumber,zNumber,scale,orientation,center}=pros;
    //xNumber,yNumber,zNumber must be even Integer and >=2
    let voxels=[];
    let voxelCoordinates=[];
    let voxelEdges=[];
    for(var xIndex=1;xIndex<=xNumber/2;xIndex++)
        {
            for(var yIndex=1;yIndex<=yNumber/2;yIndex++)
                {
                    for(var zIndex=1;zIndex<=zNumber/2;zIndex++)
                        {
                            const voxel1=initiateVoxel({position:getPosition(center,scale,xIndex,yIndex,zIndex),scale,orientation});
                            const voxel2=initiateVoxel({position:getPosition(center,scale,xIndex,yIndex,-zIndex),scale,orientation});
                            const voxel3=initiateVoxel({position:getPosition(center,scale,xIndex,-yIndex,zIndex),scale,orientation});
                            const voxel4=initiateVoxel({position:getPosition(center,scale,xIndex,-yIndex,-zIndex),scale,orientation});
                            const voxel5=initiateVoxel({position:getPosition(center,scale,-xIndex,yIndex,zIndex),scale,orientation});
                            const voxel6=initiateVoxel({position:getPosition(center,scale,-xIndex,yIndex,-zIndex),scale,orientation});
                            const voxel7=initiateVoxel({position:getPosition(center,scale,-xIndex,-yIndex,zIndex),scale,orientation});
                            const voxel8=initiateVoxel({position:getPosition(center,scale,-xIndex,-yIndex,-zIndex),scale,orientation});
                            
                            voxels=voxels.concat([voxel1,voxel2,voxel3,voxel4,voxel5,voxel6,voxel7,voxel8]);
                            voxelCoordinates=voxelCoordinates.concat([
                                voxel1.position.coordinates,
                                voxel2.position.coordinates,
                                voxel3.position.coordinates,
                                voxel4.position.coordinates,
                                voxel5.position.coordinates,
                                voxel6.position.coordinates,
                                voxel7.position.coordinates,
                                voxel8.position.coordinates,
                                ]);
                            voxelEdges=voxelEdges.concat([
                                voxel1.voxelEdges,
                                voxel2.voxelEdges,
                                voxel3.voxelEdges,
                                voxel4.voxelEdges,
                                voxel5.voxelEdges,
                                voxel6.voxelEdges,
                                voxel7.voxelEdges,
                                voxel8.voxelEdges,
                                ].flat());
                        }
                }
        }
        //reduce duplicate edges
    return {voxels,voxelCoordinates,voxelEdges};
  }

  function getPosition(center,scale,xIndex,yIndex,zIndex){
    const offSet={
        x:xIndex>0?-scale[0]/2:scale[0]/2,
        y:yIndex>0?-scale[1]/2:scale[1]/2,
        z:zIndex>0?-scale[2]/2:scale[2]/2,
    }
    return {
        coordinates:[center[0]+scale[0]*xIndex+offSet.x,center[1]+scale[1]*yIndex+offSet.y,center[2]+scale[2]*zIndex+offSet.z],
        xIndex,yIndex,zIndex
    };
  }
  function initiateVoxel({position,scale,orientation}){
    const vertices=VERTICES.map(v=>{return getVertexCoordinate(v,{position,scale,orientation})});
    const edges=[
        {start:vertices[0],end:vertices[1]},
        {start:vertices[1],end:vertices[2]},
        {start:vertices[2],end:vertices[3]},
        {start:vertices[3],end:vertices[0]},
        {start:vertices[4],end:vertices[5]},
        {start:vertices[5],end:vertices[6]},
        {start:vertices[6],end:vertices[7]},
        {start:vertices[7],end:vertices[4]},
        {start:vertices[0],end:vertices[4]},
        {start:vertices[1],end:vertices[5]},
        {start:vertices[2],end:vertices[6]},
        {start:vertices[3],end:vertices[7]}
       ];
    return {
        position,
        orientation,
        scale,
        voxelVertices:vertices,
        voxelEdges:edges
    }
  }
  function getVertexCoordinate(v,b){
    let point=[v[0]*b.scale[0],v[1]*b.scale[1],v[2]*b.scale[2]];
    //let [roll,pitch,yaw]=b.orientation;
    let roll=b.orientation.roll;
    let pitch=b.orientation.pitch;
    let yaw=b.orientation.yaw;
    roll=1.0*roll/180*Math.PI;
    pitch=1.0*pitch/180*Math.PI;
    yaw=1.0*yaw/180*Math.PI;
    const row_0 = [
          Math.cos(pitch) * Math.cos(yaw),
          Math.sin(roll) * Math.sin(pitch) * Math.cos(yaw) - Math.cos(roll) * Math.sin(yaw),
          Math.cos(roll) * Math.sin(pitch) * Math.cos(yaw) + Math.sin(roll) * Math.sin(yaw)];
    const row_1 = [
          Math.cos(pitch) * Math.sin(yaw),
          Math.sin(roll) * Math.sin(pitch) * Math.sin(yaw) + Math.cos(roll) * Math.cos(yaw),
          Math.cos(roll) * Math.sin(pitch) * Math.sin(yaw) - Math.sin(roll) * Math.cos(yaw)];
    const row_2 = [
          -Math.sin(pitch),
          Math.sin(roll) * Math.cos(pitch),
          Math.cos(roll) * Math.cos(pitch)];
    const DCM = [row_0, row_1, row_2]; // Direction Cosine Matrix
    let rotatedPoint = [];
    for (var i = 0; i < DCM.length; i++) {
          let e = 0;
          for (var j = 0; j < DCM[i].length; j++) {
              e += point[j] * DCM[i][j];
          }
          rotatedPoint.push(e);
      }
    return [rotatedPoint[0]+b.position.coordinates[0],rotatedPoint[1]+b.position.coordinates[1],rotatedPoint[2]+b.position.coordinates[2]];
    }