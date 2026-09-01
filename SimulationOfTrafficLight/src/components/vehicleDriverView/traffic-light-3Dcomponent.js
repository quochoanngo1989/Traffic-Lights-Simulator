import React,{useEffect, useState,useRef,useMemo,memo} from "react";
import { Html,Decal,Wireframe, Environment, ContactShadows } from '@react-three/drei';
import {COLOR_CODE,SHAPE_CODE,STATUS_CODE,generateSignal,COLORS,getSignalProperties,generateSignalCanvas,generateSignalBackgroundCanvas } from "./helpers/traffic-light-helper";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useLoader,useFrame } from '@react-three/fiber';
import { DigitalNumber } from "./helpers/digital-number";
import * as THREE from "three";

import { Coordinates,coordsToVector3 } from "react-three-map";
export const TRAFFIC_LIGHT_TYPE={VERTICAL:0,HORIZONTAL:1};
export class TrafficLight3D extends React.PureComponent{
    constructor(props){
        super(props);
    }
    render(){
        const args=this.props;
        return <>
        <TrafficLightSignal3D {...args}></TrafficLightSignal3D>
        </>
    }
}

function GradientCylinderRangeEffect({egoPose,frame,coordinates,radius = 50, height = 10}) {
    const calculateDistance=(range)=>Math.sqrt( Math.pow(range[0],2)+Math.pow(range[1],2)+Math.pow(range[2],2));
    const meshRef = useRef();
    const distance=calculateDistance(coordsToVector3(egoPose,coordinates));
    const delta=distance-radius;
    const color = delta>=0?'#00ffff':'#00ffff';
    const pulse = delta<=0; 
    const baseOpacity = 0.1;
    //if(delta<=0)console.log({distance,radius,delta,color,pulse,baseOpacity});
    
    const uniforms = useRef({
        uColor: { value: new THREE.Color(color) },
        uHeight: { value: height },
        uRadius: { value: radius },
        uOpacity: { value: baseOpacity },
        uTime: { value: 0 }
      }).current;
    
      useFrame((state) => {
        if (pulse) {
          const t = state.clock.getElapsedTime();
          uniforms.uTime.value = t;
          uniforms.uOpacity.value = baseOpacity + Math.sin(t * 4) * 0.1;
        }else{
          uniforms.uOpacity.value = baseOpacity;
        }
        uniforms.uColor.value=new THREE.Color(delta>0?'#00ffff':"red");
      });
    
    const vertexShader =`
      varying float vY;
      void main() {
        vY = position.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
  
    const fragmentShader =`
      uniform vec3 uColor;
      uniform float uHeight;
      uniform float uOpacity;
      varying float vY;
  
      void main() {
        float alpha = 1.0 - smoothstep(-uHeight / 2.0, uHeight / 2.0, vY);
        gl_FragColor = vec4(uColor, alpha * uOpacity);
      }
    `;
    
  
    return (
      <mesh ref={meshRef} position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius, radius, height, 64, 1, true]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          depthTest={true}
          side={THREE.DoubleSide}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
    );
}

  
function getPositionOfSignalBoxes({boxNumber,lightType,scale,yPosition}){
    const boxPositions=[];
    for(var i=0;i<boxNumber;i++)
    {
        if(lightType==TRAFFIC_LIGHT_TYPE.HORIZONTAL)
        {
            const h_GapVsScaleRatio=0.3/0.0001;// adjustment
            const x_offset=scale[0]*h_GapVsScaleRatio;
            const startOffset=-(x_offset*(boxNumber-1))/2;
            const x=startOffset+i*x_offset;
            const position=[x,yPosition,0];
            boxPositions.push(position);

        }else if(lightType==TRAFFIC_LIGHT_TYPE.VERTICAL)
        {
            const v_GapVsScaleRatio=0.3/0.0001;// adjustment
            const y_offset=scale[1]*v_GapVsScaleRatio;
            const startOffset=-(y_offset*(boxNumber-1))/2;
            const y=startOffset+i*y_offset;
            const position=[0,y+yPosition,0];
            boxPositions.push(position);
        }
    }
    return boxPositions;
}

function TrafficLightSignal3D({ id,egoPose,frame,coordinates,yPosition,yaw,trafficLightSignal3DConfig,lightSignalData,color,time}){
   const {longitude,latitude}=coordinates;
   const {lightType=TRAFFIC_LIGHT_TYPE.VERTICAL,scale=[0.0001,0.0001,0.0001],visible2D=true,size2D=20,maxVisibleDistance2D=100}=trafficLightSignal3DConfig;
   const boxPositions=getPositionOfSignalBoxes({boxNumber:lightSignalData.length,lightType,scale,yPosition});
   const group = useRef();
   const [isInRange, setInRange] = useState();
   const [isVisible2D,setVisible2D]=useState(visible2D);
   let isVisible = isInRange;
   const vec = new THREE.Vector3();
    useEffect(()=>{
        const styleSheet = document.styleSheets[0];
        let keyframes = '@keyframes flashing { 0% { opacity: 1; } 50% { opacity: 0.2; } 100% { opacity: 1; } }';
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    })
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        //group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, Math.cos(t / 2) / 20 + 0.25, 0.1)
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(t / 4) / 20, 0.1)
        group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, Math.sin(t / 8) / 20, 0.1)
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, (-2 + Math.sin(t / 2)) / 2, 0.1)
        //console.log(state.camera.position);
        const range = state.camera.position.distanceTo(group.current.getWorldPosition(vec)) <= maxVisibleDistance2D
        if (range !== isInRange) {
          setInRange(range);
          isVisible = isInRange;
        }
      })
    return <Coordinates longitude={longitude} latitude={latitude}>
    {
      //<GradientCylinderRangeEffect egoPose={egoPose} frame={frame} coordinates={coordinates}></GradientCylinderRangeEffect>
    }
    <object3D rotation={[0,yaw,0]} onClick={(e)=>{
            setVisible2D(!isVisible2D);
          }}>  
        <hemisphereLight
        args={["#fffeee", "#60666C"]}
        position={[0, 0.5, 3]}/>
        <ambientLight intensity={0.01} />
        <group ref={group}>
        <axesHelper args={[10]} position={[0,1,0]}/>
        {boxPositions.map((p,index)=>{
            return <TrafficLightBoxModel key={index} {...lightSignalData[index]} size={size2D}  scale={scale} position={p} rotation={[0,0,0]}></TrafficLightBoxModel> 
        })}
        {isVisible2D&&<Html position={(lightType==TRAFFIC_LIGHT_TYPE.HORIZONTAL?[0,2,0]:[0.5,2,0])} style={{ transition: 'all 0.2s', opacity: isVisible ? 1 : 0, transform: `scale(${isVisible ? 1 : 0.25})` }}>
             <div style={{display: "flex",flexDirection:(lightType==TRAFFIC_LIGHT_TYPE.HORIZONTAL?"row":"column-reverse")}}>
            {lightSignalData.map((svgArg)=>{
                return generateSignal({...svgArg,size:size2D})
            })}
            </div>
            <div style={{ display: "flex",flexDirection:(lightType==TRAFFIC_LIGHT_TYPE.HORIZONTAL?"row":"column-reverse")}}>
              <DigitalNumber id={id} number={time} place={3} color={color}></DigitalNumber>
            </div>
        </Html>}
        </group>
    </object3D>
    </Coordinates>
}
const TrafficLightBoxModel=memo(({id, size, colorCode,shapeCode,statusCode,scale,position,rotation})=>{
    const {color,isFlashing,isCross,isCircle,isArrowShape,arrowAngle}=getSignalProperties({colorCode,shapeCode,statusCode});
    let originalFbx =useMemo(() =>  useLoader(FBXLoader, '/traffic-signal-box.fbx'), []); 
    let fbx = originalFbx.clone();
    const [selectedStatus,setSelectedStatus]= useState(false);
    const [displayFaceMesh,setDisplayFaceMesh]=useState();
    const signalCanvasMemo = useMemo(() => {
      return generateSignalCanvas({size:100,colorCode,shapeCode,statusCode});
    }, [colorCode,shapeCode,statusCode]);
    const bkgCanvasMemo=useMemo(() => {
      return generateSignalBackgroundCanvas({size:100})
    }, []);
    const signalCanvas= useRef(signalCanvasMemo);
    const bkgCanvas=useRef(bkgCanvasMemo);    
    const signalTexture =useRef(new THREE.CanvasTexture(signalCanvas.current));
    signalTexture.current.needsUpdate = true;
    const bkgTexture=useRef(new THREE.CanvasTexture(bkgCanvas.current));
    bkgTexture.current.needsUpdate = true;
    const signalMaterial=useRef(new THREE.MeshPhongMaterial({
      map: signalTexture.current,    // Apply the texture
      shininess: 100,  // Adjust shininess
      specular: 0xffffff // White highlights
    }));
    const bkgMaterial=useRef(new THREE.MeshPhongMaterial({
      map: bkgTexture.current,    // Apply the texture
      shininess: 100,  // Adjust shininess
      specular: 0xffffff // White highlights
    }));
      const materializeModel=(fbx,materialRef)=>{
            if (fbx) {
                fbx.traverse((child) => {
                  if (child.isMesh&&child.name=="display-face") {
                    child.material = materialRef.current;
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.needsUpdate = true;
                    return;
                  }
                });
              }
        }
    let start;
    let on=true;
    useFrame((state) => {
      const timestamp = state.clock.getElapsedTime();
      const frequency=0.3;
            if(isFlashing){
                if (start === undefined) {
                    start = timestamp;
                }
                const elapsed = timestamp - start;
                const time = Math.min(elapsed, frequency);
                    if(time==frequency)
                        {
                            start=timestamp;
                            if(on){
                                materializeModel(fbx,bkgMaterial);
                            }else{
                                materializeModel(fbx,signalMaterial);
                            }
                            on=!on;
                        }
            }
    });

    useEffect(() => {
        if(!displayFaceMesh){
            fbx.traverse((child) => {
                if (child.isMesh&&child.name=="display-face") {
                    setDisplayFaceMesh(child);
                    child.geometry.computeBoundingBox();
                    const uv = [];
                    const { min, max } = child.geometry.boundingBox;
                    for (let i = 0; i < child.geometry.attributes.position.count; i++) {
                        const x = child.geometry.attributes.position.getX(i);
                        const z = child.geometry.attributes.position.getZ(i);
                        const u = (x - min.x) / (max.x - min.x); // Normalize X to 0-1
                        const v = (z - min.z) / (max.z - min.z); // Normalize Y to 0-1
                        uv.push(u, v);
                    }
                    child.geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uv), 2));
                    child.geometry.attributes.uv.needsUpdate = true;
                }
              })
        }
        materializeModel(fbx,signalMaterial);
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
         signalCanvas?.dispose?.();
         bkgCanvas?.dispose?.();
         signalTexture?.dispose?.();
         bkgTexture?.dispose?.();
         signalMaterial?.dispose?.();
         bkgMaterial?.dispose?.();
        };
    }, [fbx]);
    return<>
        <object3D scale={scale} position={position} rotation={rotation}>  
          <mesh castShadow receiveShadow onClick={(e)=>{
            const selected=!selectedStatus;
            setSelectedStatus(selected);
          }}>
          <primitive object={fbx} />
          </mesh>
          </object3D>
        </> 
},(prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps); // or a smarter comparison
})
function deepEqual(prevProps, nextProps){
  return prevProps.colorCode==nextProps.colorCode&&prevProps.shapeCode==nextProps.shapeCode&&prevProps.statusCode==nextProps.statusCode;
}



