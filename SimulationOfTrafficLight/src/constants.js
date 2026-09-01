// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
import {CarMesh} from 'streetscape.gl';
import EGO_CAR_MESH from './OBJsource/Rattruk.json';
import CAR_ARROW_MESH from './OBJsource/CarArrow.json';
import {getRotatedMaxtrix,rotationBasedOnRollPitchYaw} from './ulti.js';
/* eslint-disable camelcase */
//export const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line
export const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN || ''; // eslint-disable-line
export const MAP_STYLE = 'mapbox://styles/mapbox/light-v9';

export const XVIZ_CONFIG = {
  PLAYBACK_FRAME_RATE: 10
};

export const CAR = CarMesh.sedan({
  origin: [1.08, -0.32, 0],
  length: 4.3,
  width: 2.2,
  height: 1.5,
  color: [160, 160, 160]
});

export const APP_SETTINGS = {
  viewMode: {
    type: 'select',
    title: 'View Mode',
    data: {TOP_DOWN: 'Top Down', PERSPECTIVE: 'Perspective', DRIVER: 'Driver'}
  },
  showTooltip: {
    type: 'toggle',
    title: 'Show Tooltip'
  }
};

export const XVIZ_STYLE = {
  '/detection/objects': [{name: 'selected', style: {fill_color: '#ff8000aa'}}],
  '/points/raw': [{style: {point_color_mode: 'ELEVATION'}}],
  'V_1/points/raw':[{style: {point_color_mode: 'ELEVATION'}}],
  'V_2/points/raw':[{style: {point_color_mode: 'ELEVATION'}}],
  'V_3/points/raw':[{style: {point_color_mode: 'ELEVATION'}}],
  'V_4/points/raw':[{style: {point_color_mode: 'ELEVATION'}}],
  'V_5/points/raw':[{style: {point_color_mode: 'ELEVATION'}}]
};
/*export const XVIZ_STYLE = {
  '/tracklets/objects': [{name: 'selected', style: {fill_color: '#ff8000aa'}}],
  '/lidar/points': [{style: {point_color_mode: 'ELEVATION'}}]
};*/
export const STYLES = {
  PERF: {fontFamily: '"Helvetica Neue",arial,sans-serif', fontSize: 12,margin:'0px 0px 0px 10px', padding:'0px 10px 10px 0px'}
};
/*
 */
export const EGO_CAR=((mesh)=>{
  const indices = new Uint16Array(mesh.indices.length);
  let vertices=[];
  const Matrix=getRotatedMaxtrix(Math.PI/2,0,Math.PI/2);
  for(var i=0;i<mesh.positions.length;i=i+3)
    {
      const point=[mesh.positions[i],mesh.positions[i+1],mesh.positions[i+2]];
      vertices.push(rotationBasedOnRollPitchYaw(Matrix,point));
    }
  vertices=vertices.flat();
  const positions = new Float32Array(vertices.length);
  indices.set(mesh.indices);
  positions.set(vertices);
  return {
    color:[160,160,160],
    origin: [-1, 1, 0],
    //origin: [-1, -1, 0],
    scale:[0.0018,0.0018,0.0018],
    mesh:{indices,positions}};
})(EGO_CAR_MESH);

export const CAR_ARROW=((mesh)=>{
  const indices = new Uint16Array(mesh.indices.length);
  let vertices=[];
 //const Matrix=getRotatedMaxtrix(Math.PI/2,Math.PI,Math.PI/2);// nguoc
 const Matrix=getRotatedMaxtrix(Math.PI+Math.PI/2,Math.PI,Math.PI/2);
  for(var i=0;i<mesh.positions.length;i=i+3)
    {
      const point=[mesh.positions[i],mesh.positions[i+1],mesh.positions[i+2]];
      vertices.push(rotationBasedOnRollPitchYaw(Matrix,point));
    }
  vertices=vertices.flat();
  const positions = new Float32Array(vertices.length);
  indices.set(mesh.indices);
  positions.set(vertices);
  return {
    color:[255,0,0],
    origin: [0, 0, 2.25],
    scale:[10,10,10],
    mesh:{indices,positions}};
})(CAR_ARROW_MESH);
  
export const PANELS={CameraPanel:"CameraPanel", Acceleration:"Acceleration", Velocity:"Velocity",QueriedCameraPanel:"QueriedCameraPanel"} ;
