import {Geometry} from '@luma.gl/core';
import { SimpleMeshLayer } from '@deck.gl/mesh-layers';
/** Try to create a cube mesh programmatically. */


import { OBJLoader } from "@loaders.gl/obj"; 
import {load} from '@loaders.gl/core';
import {registerLoaders} from '@loaders.gl/core';
// Add the loaders that handle your mesh format here
registerLoaders([OBJLoader]);
//var mesh = require("../static/humanoid_quad.obj");

const data_meshes = ({
  "meshes": 
    [
      {
        'vertices': [
          [0, 0, 0.1],
          [1, 0, 0],
          [1, 1, 0],
          [0, 1, 0],
          [0.25, 0.25, 1],
          [0.75, 0.25, 1],
          [0.75, 0.75, 1],
          [0.25, 0.75, 1],
          [0.5, 0.5, 2]
        ],
      'faces': [
        [0, 1, 2],
        [0, 2, 3],
        [0, 1, 4],
        [4, 1, 5],
        [1, 2, 5],
        [5, 2, 6],
        [2, 3, 6],
        [6, 3, 7],
        [3, 0, 7],
        [7, 0, 4]
      ]
    }]
});


const wireframe = false;
const opacity = 0.5;
const layers = data_meshes.meshes.map((meshData, i) => {
const vertices = new Float32Array(meshData.vertices.flat());
const indices = new Uint16Array(meshData.faces.flat());
  // Create a Geometry instance for this mesh
  const geometry = new Geometry({
    attributes: {
      positions: vertices,
    },
    indices,
  });
  const changeColor=true;
  return new SimpleMeshLayer({
    id: `mesh-layer-${i}`,
    data: [0], // Just need a single entry in data, as we're not using data attributes
    mesh: geometry,
    wireframe: wireframe,
    transparent: true,
    // lightSettings: {
    //   ambientRatio: 0,  // Adjust ambient lighting
    //   diffuseRatio: 0.,  // Adjust diffuse lighting
    //   specularRatio: 0,  // Adjust specular lighting
    //   lightsPosition: [0, 0, 0],  // Adjust light position
    //   lightsStrength: [1.0, 0.0, 0.0, 0.0]  // Adjust light strength
    // },    
    getPosition: d => d.position,
    //getColor: [255, 0, 0],
    getColor: changeColor ? [ 255, 0, 0] : [253, 128, 93],
    opacity: opacity,
    pickable: true,
    transitions: {
      // Need be getColor which matches the accessor name
        getColor: {
          duration: 1,
          // the color here need be the old color of getColor accessor
          enter: () => changeColor ? [253, 128, 93] : [255, 0, 0]
        }
      },
    streamName: '/tracklets/label',
    coordinate: 'VEHICLE_RELATIVE'
  });
})



  /**
   * Data format:
   * [
   *   {name: 'Colma (COLM)', address: '365 D Street, Colma CA 94014', exits: 4214, coordinates: [-122.466233, 37.684638]},
   *   ...
   * ]
   */
  /*
  import {ScatterplotLayer} from "@deck.gl/layers";
  var customLayers = [new ScatterplotLayer({
    id: 'custom-scatterplot',
    // Scatterplot layer render options
    getPosition: d => d.position,
    getRadius: 1,
    getColor: [255, 0, 0],

    // log-related options
    streamName: '/tracklets/label',
    coordinate: 'VEHICLE_RELATIVE'
  })
];
*/