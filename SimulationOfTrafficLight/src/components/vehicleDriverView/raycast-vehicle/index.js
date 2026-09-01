// This demo is also playable without installation here:
// https://codesandbox.io/s/basic-demo-forked-ebr0x

import  { CylinderArgs, CylinderProps, PlaneProps } from '@react-three/cannon'
import { Debug, Physics, useCylinder, usePlane } from '@react-three/cannon'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import React from 'react';
import Vehicle from './Vehicle'
import { Road } from '../road-component';

function Plane(props) {
  const [ref] = usePlane(() => ({ material: 'ground', type: 'Static', ...props }), useRef(null))
  return (
    <group ref={ref}>
      <mesh receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial  color="white" 
        transparent={true} 
        opacity={0} >
        </meshStandardMaterial>
      </mesh>
    </group>
  )
}

function Pillar(props) {
  const args = [0.7, 0.7, 5, 16]
  const [ref] = useCylinder(
    () => ({
      args,
      mass: 10,
      ...props,
    }),
    useRef(null),
  )
  return <mesh ref={ref} castShadow>
      <cylinderGeometry args={args} />
      <meshNormalMaterial />
    </mesh>
}

const style = {
  color: 'white',
  fontSize: '1.2em',
  left: 50,
  position: 'absolute',
  top: 20,
}

function VehicleScene({viewState,longitude,latitude}){
  return <>
    <ambientLight intensity={0.1 * Math.PI*10} />
        <spotLight
          angle={9.5}
          castShadow
          decay={0}
          intensity={Math.PI}
          penumbra={1}
          position={[10, 150, 10]}
        />
  
        
        <Physics
          broadphase="SAP"
          defaultContactMaterial={{ contactEquationRelaxation: 4, friction: 1e-3 }}
          allowSleep
        >
            <Plane rotation={[-Math.PI / 2, 0, 0]} userData={{ id: 'floor' }} />
            {
              <Road viewState={viewState} svg={"/intersection.svg"} model={"/intersection.obj"} metadata={"/intersection.metadata.json"} longitude={13.3064561} latitude={52.5000634} altitude={0} yaw={0} ></Road>// berlin  model highlightedSignalGroupIds={[1,2]} 
            }
            
            {
              <Vehicle longitude={longitude} latitude={latitude} position={[0, 10, 0]} rotation={[0, -Math.PI / 4, 0]} angularVelocity={[0, 0.5, 0]} />
            }
            {
              /*
            <Pillar position={[-5, 2.5, -5]} userData={{ id: 'pillar-1' }} />
            <Pillar position={[0, 2.5, -5]} userData={{ id: 'pillar-2' }} />
            <Pillar position={[5, 2.5, -5]} userData={{ id: 'pillar-3' }} /> */
            }
            
          
        </Physics>
        <Suspense fallback={null}>
         
        </Suspense>
    </>
}

export default VehicleScene