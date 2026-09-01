
import React,{memo,useRef,useMemo,useState,useEffect} from "react";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useLoader,useFrame } from '@react-three/fiber';
import { Html} from '@react-three/drei';
import * as THREE from "three";
import { Coordinates,coordsToVector3 } from "react-three-map";
import { Camera } from "./camera-component";
export function SurveillanceCamera3D({ id,egoPose,frame,coordinates,yPosition,yaw,visible2D}){
   const {longitude,latitude}=coordinates;
   const group = useRef();
   const [isInRange, setInRange] = useState();
   const [isVisible2D,setVisible2D]=useState(visible2D);
   let isVisible = isInRange;
   const maxVisibleDistance2D=200;
   const vec = new THREE.Vector3();
    useEffect(()=>{
    })
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        //group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, Math.cos(t / 2) / 20 + 0.25, 0.1)
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(t / 4) / 20, 0.1)
        group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, Math.sin(t / 8) / 20, 0.1)
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, (-2 + Math.sin(t / 2)) / 2, 0.1)
        const range = state.camera.position.distanceTo(group.current.getWorldPosition(vec)) <= maxVisibleDistance2D
        if (range !== isInRange) {
          setInRange(range);
          isVisible = isInRange;
        }
      })
    return <Coordinates longitude={longitude} latitude={latitude}>
    <object3D rotation={[0,yaw,0]} onClick={(e)=>{
            setVisible2D(!isVisible2D);
          }}>  
        <hemisphereLight
        args={["#fffeee", "#60666C"]}
        position={[0, 0.5, 3]}/>
        <ambientLight intensity={0.01} />
        <group ref={group}>
        <axesHelper args={[10]} position={[0,2,0]}/>
        <SurveillanceCameraModel id={id} position={[0,yPosition,0]} rotation={[0,0,0]} scale={[0.001,0.001,0.001]}></SurveillanceCameraModel>
        {isVisible2D&&<Html position={[0, yPosition+5, 0]} // 2 units above the group center
        center
        distanceFactor={30} // adjust size relative to camera distance
        style={{ padding: '2px 2px', background: 'rgba(0,0,0,0.7)', color: 'white', borderRadius: '2px' }}>
              <Camera frame={frame} streamName={"/vehicle-side/camera"}></Camera>
        </Html>}
        </group>
    </object3D>
    </Coordinates>
}


export const SurveillanceCameraModel=memo(({id,scale,position,rotation})=>{
    let originalFbx =useMemo(() =>  useLoader(FBXLoader, '/surveillance-camera.fbx'), []); 
    let fbx = originalFbx.clone();
    const [selectedStatus,setSelectedStatus]= useState(false);
    useFrame((state) => {
      const timestamp = state.clock.getElapsedTime();
    });
    useEffect(() => {
     // console.log({id,scale,position,rotation});
     // console.log(fbx);
      
    }, [fbx]);
    return<>
        <object3D scale={scale} position={position} rotation={rotation}>  
          <mesh castShadow receiveShadow onClick={(e)=>{
            console.log("onlcik");
            console.log(fbx);
            const selected=!selectedStatus;
            setSelectedStatus(selected);
            
          }}>
          <primitive object={fbx} />
          </mesh>
          </object3D>
        </> 
},(prevProps, nextProps) => {
  return false//deepEqual(prevProps, nextProps); // or a smarter comparison
})
function deepEqual(prevProps, nextProps){
  return true;
}

