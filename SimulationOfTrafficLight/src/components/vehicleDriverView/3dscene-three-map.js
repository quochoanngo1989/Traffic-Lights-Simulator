import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useRef, useState,Suspense,useEffect } from 'react'
import { Canvas,Coordinates,useMap} from "react-three-map" // if you are using MapBox
//import { Canvas } from "@react-three/fiber";
import EGO_CAR_MESH from '../../OBJsource/Rattruk.json';
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useLoader,useFrame } from '@react-three/fiber'
import { Outlines,useGLTF,Stats, OrbitControls, Decal,useTexture,Html, Preload } from "@react-three/drei";
import { getConnectedVPosesFromFrame } from './helpers/helper-function';

const FBXCarModel = ({modelPosition,modelRotation,modelScale}) => {
  const [model, setModel] = useState(null);
  const url="/ego-models/car.fbx";
  useEffect(() => {
    const loader = new FBXLoader();
    loader.load(
      url,
      (fbx) => {
        setModel(fbx);
      },
      undefined,
      (error) => console.error("Error loading FBX:", error)
    );
  }, [url]);

  if (!model) return null;

  return (
    <object3D>
      <primitive object={model} scale={modelScale} position={modelPosition} rotation={modelRotation}/>
      <mesh castShadow receiveShadow geometry={model.geometry}>
        {<Outlines angle={0} thickness={1.1} color="black" />}
      </mesh>
    </object3D>
  );
};

export function WorldMap({frame,timestamp}){
if(!frame)
    return <></>
return <EgoCar frame={frame} ></EgoCar>
}


function CarModel({modelPosition,modelRotation,modelScale}) {
    const fbx = useLoader(FBXLoader, '/ego-models/car.fbx')
    //const texture=useTexture('/Tu.png')
    return <object3D>  
      <mesh onClick={()=>{alert("Ego");}}>
      <primitive object={fbx} scale={modelScale} position={modelPosition} rotation={modelRotation}/>
      </mesh></object3D>
  }

  function ConnectedCarModel({pose})
  {
    const fbx = useLoader(FBXLoader, '/ego-models/connected-car.fbx');
    return <Coordinates longitude={pose.longitude} latitude={pose.latitude}>
      <object3D><primitive object={fbx} scale={0.015}  rotation={[pose.pitch, pose.yaw-Math.PI/2, pose.roll]}/></object3D>
    </Coordinates>
    
  }

function EgoCar({frame,assets}){
  const egoPose= frame.vehiclePose;
  const meshRef = useRef(); 
  useEffect(() => { 
    if (meshRef.current) 
        { 
            const geometry = meshRef.current.geometry;
            geometry.computeVertexNormals(); // Auto-compute normals 
            geometry.normalsNeedUpdate = true; // Ensure update 
        } }, []);  
    return <Canvas latitude={egoPose.latitude} longitude={egoPose.longitude} altitude={egoPose.altitude}>
    <hemisphereLight
      args={["#fffeee", "#60666C"]}
      position={[10, 100.5, 3]}
    />
    <ambientLight intensity={0.5} />
    <directionalLight position={[0, 100.5, 5]} intensity={1} />
     <Suspense fallback={null}>
        {
            <group>
              {//<FBXCarModel modelPosition={[0,0,0]} modelRotation={[egoPose.pitch, egoPose.yaw-Math.PI/2, egoPose.roll]} modelScale={0.015} />     
              }
              {<CarModel modelPosition={[0,0,0]} modelRotation={[egoPose.pitch, egoPose.yaw-Math.PI/2, egoPose.roll]} modelScale={0.015} /> 
              }
              <ConnectedCarModels frame={frame}></ConnectedCarModels>
            </group>
        }
      </Suspense>
    
      <Preload all />
    
      <axesHelper args={[5000000]} />
    </Canvas>
}

function ConnectedCarModels({frame}){
  return getConnectedVPosesFromFrame(frame).map((vehicle,index)=>{
    return  <ConnectedCarModel key={vehicle.name}  pose={vehicle.pose}></ConnectedCarModel>
  }) 
}



function EgoMeshCar({frame,assets}){
  const egoPose= frame.vehiclePose;
  const meshRef = useRef(); 
  useEffect(() => { 
    if (meshRef.current) 
        { 
            const geometry = meshRef.current.geometry;
            geometry.computeVertexNormals(); // Auto-compute normals 
            geometry.normalsNeedUpdate = true; // Ensure update 
        } }, []);  
    return <Canvas latitude={egoPose.latitude} longitude={egoPose.longitude} altitude={egoPose.altitude}>
    <hemisphereLight
      args={["#ffffff", "#60666C"]}
      position={[10, 10.5, 3]}
    />
    <ambientLight intensity={0.5} />
    <directionalLight position={[0, 5, 5]} intensity={10} />
     <Suspense fallback={null}>
        {
            //<CarModel modelPosition={[0,0,0]} modelRotation={[egoPose.pitch, egoPose.yaw-Math.PI/2, egoPose.roll]} modelScale={0.02} />
            <group>
              <object3D>
              <mesh ref={meshRef} position={[0,0,0]} rotation={[egoPose.pitch, egoPose.yaw+Math.PI/2, egoPose.roll]} scale={0.001} >
                  <bufferGeometry attach="geometry">
                      <bufferAttribute
                      attach="attributes-position"
                      array={new Float32Array(EGO_CAR_MESH.positions)}
                      itemSize={3}
                      count={EGO_CAR_MESH.positions.length/3}
                      />{
                          <bufferAttribute
                          attach="index"
                          array={new Uint16Array(EGO_CAR_MESH.indices)}
                          itemSize={1}
                          count={EGO_CAR_MESH.indices.length} 
                          />
                      }
                      
                  </bufferGeometry>
                  {<meshBasicMaterial color={"black"}/>
                  //<meshPhongMaterial color="blue" specular="white" shininess={100}></meshPhongMaterial>
                  }
              </mesh>
            </object3D>

            {
              <ConnectedCarMeshs frame={frame}></ConnectedCarMeshs>
            }
            </group>
        }
      </Suspense>
    {//<Preload all />
    }
      <axesHelper args={[5000000]} />
    </Canvas>
}

function ConnectedCarMeshs({frame}){
  return getConnectedVPosesFromFrame(frame).map((vehicle,index)=>{
    const pose=vehicle.pose;
    return  <Coordinates key={vehicle.name} longitude={pose.longitude} latitude={pose.latitude}>
    <mesh rotation={[pose.pitch, pose.yaw+Math.PI/2, pose.roll]} scale={0.001} >
                <bufferGeometry attach="geometry">
                    <bufferAttribute
                    attach="attributes-position"
                    array={new Float32Array(EGO_CAR_MESH.positions)}
                    itemSize={3}
                    count={EGO_CAR_MESH.positions.length/3}
                    />
                    <bufferAttribute
                        attach="index"
                        array={new Uint16Array(EGO_CAR_MESH.indices)}
                        itemSize={1}
                        count={EGO_CAR_MESH.indices.length} 
                        />
                </bufferGeometry>
                {<meshBasicMaterial 
                    color="blue"
                />}
            </mesh></Coordinates>
  })
}




