import { CompositeLayer } from "@deck.gl/core";
import {SimpleMeshLayer} from '@deck.gl/mesh-layers';
import {LineLayer} from '@deck.gl/layers';
import {CubeGeometry} from '@luma.gl/engine';
import {COORDINATE_SYSTEM} from '@deck.gl/core';
import { color } from "chart.js/helpers";
//const DEFAULT_ORIGIN = [0, 0, 0-2.2];
/*
export class VoxelLayer extends CompositeLayer {
    // Force update layer and re-render sub layers when viewport changes
    shouldUpdateState({changeFlags}) {
      return changeFlags.somethingChanged;
    }
    renderSubLayers() {
      const {frame,voxels,voxelCoordinates,voxelEdges,zIndex,scale,orientation,cubeColor,edgeColor}=this.props
      const {zoom} = this.context.viewport;
      return [
        new SimpleMeshLayer({
          id: 'voxel-cubes',
          data: voxelCoordinates,
        coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
        coordinateOrigin: frame.origin || DEFAULT_ORIGIN,
        getColor: (d) => cubeColor,
        getOrientation: (d) => [orientation.roll,orientation.pitch, orientation.yaw],
        getPosition: (d) => d,
        mesh: new CubeGeometry(),
        texture:null,
        wireframe:false,
        getScale: scale,
        pickable: false,
        zIndex:zIndex
        //,visible: zoom < 8
        }),
        new LineLayer({
        id: 'voxel-edges',  
        data: voxelEdges,
        coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
        coordinateOrigin: frame.origin || DEFAULT_ORIGIN,
        getColor: (d) => edgeColor,
        getSourcePosition: (d) => d.start,
        getTargetPosition: (d) => d.end,    
        getWidth: 1,
        pickable: false,
        zIndex:zIndex
          //,visible: zoom >= 8
        })
      ]
    }
  }
 */
 function transform(DCM,point){
  let rotatedPoint = [];
    for (var i = 0; i < DCM.length; i++) {
          let e = 0;
          for (var j = 0; j < DCM[i].length; j++) {
              e += point[j] * DCM[i][j];
          }
          rotatedPoint.push(e);
      }
    return rotatedPoint;
 }
  export function getVoxelLayer(opts){
    const {frame,voxels,voxelCoordinates,voxelEdges,zIndex,scale,center,orientation,cubeColor,edgeColor}=opts;
    const {roll,pitch,yaw}=frame.vehiclePose;
    console.log({roll,pitch,yaw});
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
    //todo layer
    //voxelEdges.push({start:[0,0,0],end:[0,0,100]});
    //voxelEdges.push({start:[0,0,0],end:[0,100,0]});
    //voxelEdges.push({start:[0,0,0],end:[100,0,0]});
    console.log(opts)
    return [
      /*new SimpleMeshLayer({
        id: 'voxel-cubes',
        data: voxelCoordinates,
      coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
      coordinateOrigin: frame.origin || DEFAULT_ORIGIN,
      getColor: (d) => cubeColor,
      getOrientation: (d) => [orientation.roll,orientation.pitch, orientation.yaw],
      getPosition: (d) => d,
      mesh: new CubeGeometry(),
      opacity: 0.1,
      texture:null,
      wireframe:false,
      getScale: scale,
      pickable: false,
      zIndex:zIndex
      //,visible: zoom < 8
      }),*/
      new LineLayer({
      id: 'voxel-edges', 
      data: voxelEdges,
      coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
      coordinateOrigin: frame.origin || center,
      getColor: (d) => edgeColor,
      getSourcePosition: (d) => transform(DCM,d.start),
      getTargetPosition: (d) => transform(DCM,d.end),
      getWidth: 1,
      pickable: false,
      zIndex:zIndex,
      opacity:0.3,
      updateTriggers: {
        getSourcePosition: frame.vehicleRelativeTransform,
        getTargetPosition: frame.vehicleRelativeTransform
      }
        //,visible: zoom >= 8
      })
    ]
  }