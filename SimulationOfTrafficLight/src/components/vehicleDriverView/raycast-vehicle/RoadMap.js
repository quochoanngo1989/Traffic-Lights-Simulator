import React, { useRef, useState,Suspense,useEffect,useMemo } from 'react'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Outlines,useGLTF,Stats, OrbitControls, Decal,useTexture,Html, Preload } from "@react-three/drei";
import { Physics,useTrimesh,useConvexPolyhedron } from '@react-three/cannon'
import { mode } from 'd3';
import * as THREE from 'three';
import { TorusGeometry } from 'three'
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

function ensureIndexed(geometry) {
    if (!geometry.index) {
      const indexedGeometry = mergeVertices(geometry);
      indexedGeometry.computeVertexNormals();
      return indexedGeometry;
    }
    return geometry;
  }

  export default function RoadNetworkModel({ position, rotation, scale }) {
    const url = "/roads/roadnetwork.gltf";
    //const url = "/roads/scene-test/test.gltf";
    const roadModel = useGLTF(url);
    //console.log(roadModel);
    const [geometry, setGeometry] = useState(null);
    const [vertices, setVertices] = useState([]);
    const [indices, setIndices] = useState([]);
    const [isReady, setIsReady] = useState(false); // State to check if physics should be created
  
    useEffect(() => {
      if (roadModel?.nodes?.defaultobject?.geometry) {
        //console.log("Model Loaded:", roadModel.nodes.defaultobject.geometry);
        
        const indexedGeometry = ensureIndexed(roadModel.nodes.defaultobject.geometry);
        let verts = indexedGeometry?.attributes.position.array || [];
        let inds = indexedGeometry?.index ? indexedGeometry.index.array : [];
        const w=10;
        /*
         // Define 5 points (vertices)
    const vertices = new Float32Array([
        0, 0, 0,    // [0, 0, 0]
        w, w, 1,    // [1, 1, 1]
        w, -w, 1,   // [1, -1, 1]
        -w, w, 1,   // [-1, 1, 1]
        -w, -w, 1   // [-1, -1, 1]
      ]);
    
      // Define indices to form triangles between the points
      const indices = new Uint16Array([
        0, 2, 1,    // Triangle 1
        0, 1, 3,    // Triangle 2
        0, 3, 4,    // Triangle 3
        0, 4, 2     // Triangle 4
      ]);
    
      // Create geometry from vertices and indices
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
      setGeometry(geometry);
      setVertices(vertices);
      setIndices(indices);
      setIsReady(true);*/
    
        setGeometry(indexedGeometry);
        setVertices(verts);
        setIndices(inds);
        setIsReady(true); // Physics can now be created
        
        //console.log({ verts, inds });
        //console.log("Vertices:", verts.length / 3, "points");
        //console.log("Indices:", inds.length / 3, "triangles");
    
      }
    }, [roadModel]); // Runs when `roadModel` updates
    if (!isReady || !geometry) return null; // Wait until model is fully loaded
    return <RoadNetwork position={position} rotation={rotation} scale={scale} geometry={geometry} indices={indices} vertices={vertices}>
    </RoadNetwork>
  }
  
function RoadNetwork({ position, rotation, scale, geometry,indices,vertices }){
    const [physicsRef] = useTrimesh(() => {
        return {
          mass: 0, // Static ground
          args: [vertices, indices],
          position,
          rotation,
          scale,
          material: "ground",
        };
      }, [vertices, indices]);
      const meshRef = useRef();
      return (
        <group>
          <mesh  userData={{ id: 'road' }} ref={physicsRef} rotation={rotation} position={position} scale={scale}>
            <primitive object={geometry} />
            <meshStandardMaterial color="blue" wireframe />
          </mesh>
          <ShowVertexNormals objectRef={meshRef} />
        </group>
      );

}

function SimpleDriviableRoad ({ position, rotation, scale,w=1,h=1}){
    
    // Define 5 points (vertices)
    const vertices = new Float32Array([
      0, 0, 0,    // [0, 0, 0]
      w, w, h,    // [1, 1, 1]
      w, -w, h,   // [1, -1, 1]
      -w, w, h,   // [-1, 1, 1]
      -w, -w, h   // [-1, -1, 1]
    ]);
  
    // Define indices to form triangles between the points
    const indices = new Uint16Array([
      0, 2, 1,    // Triangle 1
      0, 1, 3,    // Triangle 2
      0, 3, 4,    // Triangle 3
      0, 4, 2     // Triangle 4
    ]);
  
    // Create geometry from vertices and indices
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  
    // Apply trimesh physics
    const [ref] = useTrimesh(() => ({
      mass: 0,  // Static object
      args: [vertices, indices],  // Use vertices and indices
      position,  // Position of the physics body
      rotation,  // Rotation of the physics body
      scale,
      material:'ground'     // Scale of the physics body
    }), []);
  
    useEffect(() => {
      console.log('Road Trimesh physics body created');
    }, [ref]);
  
    return (
      <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
        <primitive object={geometry} />
        <meshPhysicalMaterial
          color="lightblue"  // Base color
          metalness={1}      // High metalness (high reflectivity)
          roughness={0.1}    // Low roughness for a smooth, shiny surface
          clearcoat={1}      // Add extra layer of reflection
          clearcoatRoughness={0.1}  // Fine-tune the clearcoat reflection
          wireframe
        />      
      </mesh>
    );
  };
  


/*<ShowVertexNormals objectRef={meshRef} />*/
import { extend, useThree } from '@react-three/fiber';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper';
import { resolve } from 'path-browserify';

extend({ VertexNormalsHelper });

const ShowVertexNormals = ({ objectRef }) => {
  const helperRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    if (objectRef.current) {
      helperRef.current = new VertexNormalsHelper(objectRef.current, 0.2, 0xff0000); // 0.2 is line length
      scene.add(helperRef.current);
    }
    return () => {
      if (helperRef.current) scene.remove(helperRef.current);
    };
  }, [objectRef, scene]);

  return null;
};

  




/*************************************/

