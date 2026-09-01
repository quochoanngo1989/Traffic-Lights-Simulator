import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useRef, useState,Suspense,useEffect,useMemo } from 'react'
import { Canvas,Coordinates,useMap} from "react-three-map" // if you are using MapBox
import EGO_CAR_MESH from '../../OBJsource/Rattruk.json';
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useLoader,useFrame,useThree } from '@react-three/fiber'
import { Outlines,useGLTF,Stats, OrbitControls, Decal,useTexture,Html, Preload } from "@react-three/drei";
import { getConnectedVPosesFromFrame,getConnectedVNamesFromFrame } from './helpers/helper-function';
import { TrafficLightsInfrastructure } from './traffic-lights-infrastructure';
import { PopUps } from './helpers/popup';
import * as THREE from "three";
import VehicleScene from './raycast-vehicle';
import { SurveillanceCamerasInfrastructure } from './surveillance-cameras-infrastructure';
import { SurveillanceCameraModel } from './surveillance-camera-3Dcomponent';
import { Road } from './road-component';

const CameraControler = () => {
  const { camera } = useThree();
  //console.log(camera);

  useEffect(() => {
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
};

const generateColors = (positions,base=-1) => {
  const colors = new Float32Array(positions.length);
  for (let i = 0; i < positions.length; i += 3) {
    const z = positions[i+2]; // Get Z value
    const normalizedZ = (z + 1) / 2; // Normalize (-1 to 1) → (0 to 1)
    colors[i] = normalizedZ+base; // R
    colors[i + 1] = base; // G (constant)
    colors[i + 2] = 1 - normalizedZ+base; // B (inverse of R)*/
  }
  return colors;
};
const LiDARPointCloud = ({frame,positions,offset,rotation}) => {
  const geometryRef = useRef();
  useEffect(() => {
    if (geometryRef.current) {
      //Create a new BufferAttribute instance with updated data
      const newAttribute = new THREE.BufferAttribute(new Float32Array(positions), 3);
      geometryRef.current.setAttribute("position", newAttribute);
      const colors = generateColors(positions);
      const newColorAttr = new THREE.BufferAttribute(colors, 3);
      geometryRef.current.setAttribute("color", newColorAttr);
    }
  }, [positions]); // Re-run when positions change
  if(positions==null)
    return <></>;
  return (
    <group >
    <points position={offset} rotation={[rotation[1]+-Math.PI/2,rotation[0]+0,rotation[2]+0]}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial vertexColors={true} size={1} depthTest={false} />
    </points>
    </group>
  );
};

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

export function WorldMap({frame,mapRef}){
  const [isFirstFrame,setIsFirstFrame]=useState(0);
  useEffect(()=>{
    if(frame&&isFirstFrame<=2){
      setIsFirstFrame(isFirstFrame+1);
      if(isFirstFrame==1){
        const egoPose= frame.streams["/vehicle_pose"].stream.message;
        mapRef.current?.flyTo({
        center: [egoPose.longitude,egoPose.latitude], // Ego Position
        zoom: 20,
        pitch: 0,
        bearing: 90-180/Math.PI*egoPose.yaw,
        speed: 2.0, // Adjust speed (default: 1.2)
        curve: 1.5, // Adjust flight curve (higher = more curved)
        essential: true, // Keeps animation even if user interacts
      });
    }}
  },[frame])
  
if(!frame)
{
  return <>{/*
    <Canvas longitude={24.920452} latitude={60.164149} altitude={0} >
    <CameraControler></CameraControler>
    <hemisphereLight
      args={["#fffeee", "#60666C"]}
      position={[10, 100.5, 3]}
      intensity={1}/>
    <ambientLight intensity={1} />
    <directionalLight position={[0, 100.5, 5]} intensity={1} />
     <Suspense fallback={null}>
            <Road longitude={24.920452+0.000065} latitude={60.164149+0.0000065} altitude={-0} yaw={0} ></Road>
      </Suspense>
      <Preload all />
      <axesHelper args={[5000000]} />
    </Canvas>
    */}
    </>
}
else{
    //console.log(frame);
    return <EgoCar frame={frame} ></EgoCar>//<EgoMeshCar frame={frame} ></EgoMeshCar>  
}

}

function CarModel({modelPosition,modelRotation,modelScale,popUpStatus,updatePopUpStatus}) {
    /*let fbx =useMemo(() =>  {
      console.log("car fbx reloaded");
      return useLoader(FBXLoader, '/ego-models/car.fbx');}
      , []);*/

    const originalFbx = useLoader(FBXLoader, '/ego-models/car.fbx');
    const fbx = useMemo(() => originalFbx.clone(), []);

    const selectedColor="red";
    const unselectedColor="gray";
    const [selectedStatus,setSelectedStatus]= useState(false);
    const colorizeModel=(fbx,color)=>{
      if (fbx) {
        fbx.traverse((child) => {
          if (child.isMesh) {
            //console.log(child);
            child.material = new THREE.MeshStandardMaterial({
              //color: "red", // Change to any color
              color:color,
              opacity:1,
              depthTest: true //Ensures it renders above transparent objects
            });
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      }
    }
    useEffect(() => {
      colorizeModel(fbx,unselectedColor);
      return () => {
        fbx.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material?.dispose?.();
            }
          }
        });
      };
    }, [fbx]);
    return<>
    <object3D>  
      <mesh castShadow receiveShadow onClick={(e)=>{
        const selected=!selectedStatus;
        const color=selected?selectedColor:unselectedColor;
        const popStatus={...popUpStatus};
        popStatus["Ego vehicle"]=true;
        updatePopUpStatus(popStatus);
        setSelectedStatus(selected);
        colorizeModel(fbx,color);
      }}>
      <primitive object={fbx} scale={modelScale} position={modelPosition} rotation={modelRotation}/>
      </mesh></object3D>
    </> 
    
  }

  function ConnectedCarModel({name,pose,frame,modelPosition,modelRotation,modelScale,popUpStatus,updatePopUpStatus})
  {
    const fbx = useLoader(FBXLoader, '/ego-models/connected-car.fbx');
    const selectedColor="yellow";
    const unselectedColor="gray";
    const [selectedStatus,setSelectedStatus]= useState(false);
    const colorizeModel=(fbx,color)=>{
      if (fbx) {
        fbx.traverse((child) => {
          if (child.isMesh) {
            //console.log(child);
            child.material = new THREE.MeshStandardMaterial({
              //color: "red", // Change to any color
              color:color,
              opacity:1,
              depthTest: true //Ensures it renders above transparent objects
            });
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      }
    }
    useEffect(() => {
      colorizeModel(fbx,unselectedColor);
    }, [fbx]);
    return <object3D>  
      <hemisphereLight
      args={["#fffeee", "#60666C"]}
      position={[10, 100.5, 3]}/>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 100.5, 5]} intensity={1} />
      <mesh castShadow receiveShadow onClick={(e)=>{
        const selected=!selectedStatus;
        const color=selected?selectedColor:unselectedColor;
        const popStatus={...popUpStatus};
        popStatus[name]=true;
        updatePopUpStatus(popStatus);
        setSelectedStatus(selected);
        colorizeModel(fbx,color);
      }}>
      <primitive object={fbx} scale={modelScale} position={modelPosition} rotation={modelRotation}/>
      </mesh></object3D>
  }

function EgoCar({frame,assets}){
  const egoPose= frame.streams["/vehicle_pose"].stream.message;
  const positions=frame.streams["/points/raw"]?new Float32Array([...frame.streams["/points/raw"].stream.message.position]):null;
  function initiatePopUpStatus(frame){
    const initPopUpStatus={"Ego vehicle":true};
    if(!frame){ 
      getConnectedVNamesFromFrame(frame).forEach(vehicleName=>{
        initPopUpStatus[vehicleName]=false;
      })
    }
    return initPopUpStatus;
  }
  const [popUpStatus,setPopUpStatus]=useState(initiatePopUpStatus(frame));
  function updatePopUpStatus(status){
    setPopUpStatus(status);
    //longitude={24.957911}latitude={ 60.165032}
  }
    return <>
    <PopUps frame={frame} popUpStatus={popUpStatus} updatePopUpStatus={updatePopUpStatus} ></PopUps>
    <Canvas latitude={egoPose.latitude} longitude={egoPose.longitude} altitude={0} >
    <CameraControler></CameraControler>
    <hemisphereLight
      args={["#fffeee", "#60666C"]}
      position={[10, 100.5, 3]}
      intensity={1}/>
    <ambientLight intensity={1} />
    <directionalLight position={[0, 100.5, 5]} intensity={1} />
     <Suspense fallback={null}>
            <group rotation={[egoPose.pitch, egoPose.yaw, egoPose.roll]}>
              {(new Array(1).fill(1)).map((i, index)=>{
                return <CarModel key={index} modelPosition={[0,index*2-index*2-5.5+egoPose.altitude,0]} modelRotation={[0, 0-Math.PI/2, 0]} modelScale={0.015-0.003} popUpStatus={popUpStatus} updatePopUpStatus={updatePopUpStatus} />
              })
              }
              {
                <RadarScanner></RadarScanner>
              }
              <LiDARPointCloud  offset={[0,2-2,0]} frame={frame} positions={positions} rotation={[0, 0, 0]}></LiDARPointCloud>    
            </group>     
              <ConnectedCars frame={frame} popUpStatus={popUpStatus} updatePopUpStatus={updatePopUpStatus}></ConnectedCars>
              {
                <TrafficLightsInfrastructure egoPose={egoPose} frame={frame}></TrafficLightsInfrastructure>
              }

              {
                <SurveillanceCamerasInfrastructure egoPose={egoPose} frame={frame}></SurveillanceCamerasInfrastructure>
              }
              {
                //<Road longitude={24.920452+0.000075} latitude={60.164149+0.0000075} altitude={0} yaw={0} ></Road>
              }
              {<Coordinates longitude={24.957911} latitude={60.165032}>  
              <VehicleScene></VehicleScene>
              </Coordinates>}

      </Suspense>
      <Preload all />
      <axesHelper args={[5000000]} />
      
    </Canvas>
    </>
}

function ConnectedCars({frame,popUpStatus,updatePopUpStatus}){
  return getConnectedVPosesFromFrame(frame).map((vehicle,index)=>{
    return <ConnectedCar key={vehicle.name} name={vehicle.name} pose={vehicle.pose} frame={frame} popUpStatus={popUpStatus} updatePopUpStatus={updatePopUpStatus}></ConnectedCar>
  }) 
}

function ConnectedCar({name,pose,frame,popUpStatus,updatePopUpStatus}){
  const positions=frame.streams[name+"/points/raw"]?new Float32Array([...frame.streams[name+"/points/raw"].stream.message.position]):null;
  return <><Coordinates longitude={pose.longitude} latitude={pose.latitude}>
    <group rotation={[pose.pitch, pose.yaw, pose.roll]}>
      <ConnectedCarModel name={name}  pose={pose} frame={frame} modelPosition={[0,0,0]} modelRotation={[0, 0-Math.PI/2, 0]} modelScale={0.015} popUpStatus={popUpStatus} updatePopUpStatus={updatePopUpStatus}></ConnectedCarModel>
      <LiDARPointCloud  offset={[0,2,0]} frame={frame} positions={positions} rotation={[0,0,0]}></LiDARPointCloud>
    </group>
    </Coordinates>
  </>
}




function EgoMeshCar({frame,assets}){
  const egoPose= frame.streams["/vehicle_pose"].stream.message;
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
              //<ConnectedCarMeshs frame={frame}></ConnectedCarMeshs>
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

function RadarScanBeam({
  radius = 64,
  thickness = 0.02,
  color = 'lime',
  speed = 0.5, // radians per second
}) {
  const beamRef = useRef();

  // Gradient texture from canvas
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, `${color}`);
    gradient.addColorStop(1, `${color.replace('1)', '0)')}`); // fade to transparent

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, 1);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, [color]);

  // Animate rotation
  useFrame((_, delta) => {
    if (beamRef.current) {
      beamRef.current.rotation.z += speed * delta;
    }
  });

  return (
    <mesh ref={beamRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <planeGeometry args={[radius, thickness]} />
      <meshBasicMaterial
        map={gradientTexture}
        transparent
        opacity={1}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}


function RadarScanner() {
  const beamRef = useRef();

  // Create the sector shape once
  const beamGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const angle = Math.PI / 6;
    const radius = 200;
  
    shape.moveTo(0, 0);
    for (let a = 0; a <= angle; a += angle / 30) {
      shape.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
    }
    shape.lineTo(0, 0);
  
    return new THREE.ShapeGeometry(shape); // 🔥 This is the fix
  }, []);

  useFrame((_, delta) => {
    if (beamRef.current) {
      beamRef.current.rotation.z += delta;
    }
  });

  return (
    <group position={[0,-0.1,0]}>
      {
        /*<mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[200, 64]} />
        <meshBasicMaterial color="green" opacity={0.2} transparent />
      </mesh>*/
      }
      
      {
        <mesh ref={beamRef} rotation={[-Math.PI / 2, 0, 0]}>
        <primitive attach="geometry" object={beamGeometry} />
        <meshBasicMaterial color="lime" opacity={0.2} transparent />
      </mesh>
      }
    </group>
  );
}



