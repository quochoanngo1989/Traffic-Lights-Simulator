
import { useBox, useRaycastVehicle } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import React from 'react'
import { useEffect, useRef } from 'react'

import { vector3ToCoords } from 'react-three-map'// thêm vào để tính GPS cho xe
import { Chassis } from './Chassis'
import { useControls } from './use-controls'
import { Wheel } from './Wheel'

function Vehicle({
  angularVelocity,
  back = -1.15,
  force = 1500,
  front = 1.3,
  height = -0.04,
  maxBrake = 50,
  position,
  radius = 0.7,
  rotation,
  steer = 0.5,
  width = 1.2,
  longitude,
  latitude
}) {
  const wheels = [useRef(null), useRef(null), useRef(null), useRef(null)]

  const controls = useControls()

  const wheelInfo = {
    axleLocal: [-1, 0, 0], // This is inverted for asymmetrical wheel models (left v. right sided)
    customSlidingRotationalSpeed: -30,
    dampingCompression: 4.4,
    dampingRelaxation: 10,
    directionLocal: [0, -1, 0], // set to same as Physics Gravity
    frictionSlip: 2,
    maxSuspensionForce: 1e4,
    maxSuspensionTravel: 0.3,
    radius,
    suspensionRestLength: 0.3,
    suspensionStiffness: 30,
    useCustomSlidingRotationalSpeed: true,
  }

  const wheelInfo1= {
    ...wheelInfo,
    chassisConnectionPointLocal: [-width / 2, height, front],
    isFrontWheel: true,
  }
  const wheelInfo2 = {
    ...wheelInfo,
    chassisConnectionPointLocal: [width / 2, height, front],
    isFrontWheel: true,
  }
  const wheelInfo3 = {
    ...wheelInfo,
    chassisConnectionPointLocal: [-width / 2, height, back],
    isFrontWheel: false,
  }
  const wheelInfo4 = {
    ...wheelInfo,
    chassisConnectionPointLocal: [width / 2, height, back],
    isFrontWheel: false,
  }

  const [chassisBody, chassisApi] = useBox(
    () => ({
      allowSleep: false,
      angularVelocity,
      args: [1.7, 1, 4],
      mass: 500,
      onCollide: (e) => console.log('bonk', e.body.userData),
      position,
      rotation,
    }),
    useRef(null),
  )

  const [vehicle, vehicleApi] = useRaycastVehicle(
    () => ({
      chassisBody,
      wheelInfos: [wheelInfo1, wheelInfo2, wheelInfo3, wheelInfo4],
      wheels,
    }),
    useRef(null),
  )

  useEffect(() => vehicleApi.sliding.subscribe((v) => {
    //console.log('sliding', v)
  }), [])
  //Set starting GPS Position
  useEffect(() => {
  const origin = {
    longitude:longitude, 
    latitude:latitude,
    altitude: 0,
  }

  const unsubscribe = chassisApi.position.subscribe(([x, y, z]) => {

    const coords = vector3ToCoords(
      [x, y, z],
      origin
    )

    console.log('Vehicle GPS:', coords)
  })

  return unsubscribe
}, [])

  useFrame(() => {
    const { backward, brake, forward, left, reset, right } = controls.current

    for (let e = 2; e < 4; e++) {
      vehicleApi.applyEngineForce(forward || backward ? force * (forward && !backward ? -1 : 1) : 0, 2)
    }

    for (let s = 0; s < 2; s++) {
      vehicleApi.setSteeringValue(left || right ? steer * (left && !right ? 1 : -1) : 0, s)
    }

    for (let b = 2; b < 4; b++) {
      vehicleApi.setBrake(brake ? maxBrake : 0, b)
    }

    if (reset) {
      chassisApi.position.set(...position)
      chassisApi.velocity.set(0, 0, 0)
      chassisApi.angularVelocity.set(...angularVelocity)
      chassisApi.rotation.set(...rotation)
    }
  })

  return (
    <group ref={vehicle} position={[0, -0.4, 0]}>
      <ambientLight intensity={0.1 * Math.PI} />
              <spotLight
                angle={0.5}
                castShadow
                decay={0}
                intensity={Math.PI}
                penumbra={1}
                position={[10, 10, 10]}
              />
      <Chassis ref={chassisBody} />
      <Wheel ref={wheels[0]} radius={radius} leftSide />
      <Wheel ref={wheels[1]} radius={radius} />
      <Wheel ref={wheels[2]} radius={radius} leftSide />
      <Wheel ref={wheels[3]} radius={radius} />
    </group>
  )
}

export default Vehicle