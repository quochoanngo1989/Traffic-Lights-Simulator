import React, { useRef, useState,Suspense,useEffect,useMemo } from 'react'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useLoader,useFrame } from '@react-three/fiber';
import { Outlines,useGLTF,Stats, OrbitControls, Decal,useTexture,Html, Preload } from "@react-three/drei";
import { Physics,useTrimesh,useConvexPolyhedron } from '@react-three/cannon'
import { mode } from 'd3';
import * as THREE from 'three';
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

function ensureIndexed(geometry) {
    if (!geometry.index) {
      const indexedGeometry = mergeVertices(geometry);
      indexedGeometry.computeVertexNormals();
      return indexedGeometry;
    }
    return geometry;
  }

  

  export default function RoadInfrastructure({ position, rotation, scale }){
    let originalFbx =useMemo(() =>  useLoader(FBXLoader, '/29-0530_Finland_merge.fbx'), []); 
    let roadModel = originalFbx.clone();
    //console.log(roadModel);
    const [geometry, setGeometry] = useState(null);
    const [vertices, setVertices] = useState([]);
    const [indices, setIndices] = useState([]);
    const [isReady, setIsReady] = useState(false); // State to check if physics should be created
  
    useEffect(() => {
      if (roadModel?.nodes?.defaultobject?.geometry) {
        const indexedGeometry = ensureIndexed(roadModel.nodes.defaultobject.geometry);
        let verts = indexedGeometry?.attributes.position.array || [];
        let inds = indexedGeometry?.index ? indexedGeometry.index.array : [];
        const w=10;
        setGeometry(indexedGeometry);
        setVertices(verts);
        setIndices(inds);
        setIsReady(true);
      }
    }, [roadModel]); // Runs when `roadModel` updates
    if (!isReady || !geometry) return null; // Wait until model is fully loaded
    return <RoadNetwork model={roadModel} position={position} rotation={rotation} scale={scale} geometry={geometry} indices={indices} vertices={vertices}>
    </RoadNetwork>
  }
  
function RoadNetwork({model, position, rotation, scale, geometry,indices,vertices }){
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
            <primitive object={model} />
            {/*<meshStandardMaterial color="blue" wireframe />*/}
          </mesh>
          <ShowVertexNormals objectRef={meshRef} />
        </group>
      );

}

/*<ShowVertexNormals objectRef={meshRef} />*/
import { extend, useThree } from '@react-three/fiber';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper';

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

  

