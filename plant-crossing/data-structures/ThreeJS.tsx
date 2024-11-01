import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber/native'
// For this experiment: referencing https://r3f.docs.pmnd.rs/getting-started/introduction

export function Box(props) {
  const meshRef = useRef(null)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((state, delta) => (meshRef.current.rotation.y += delta*.2)) //spin slowly around y

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'brown' : 'green'} />
    </mesh>
  )
}



export function ThreeJSDefault() {
  return (
    <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box position={[0, 0, 0]} />
    </Canvas>
  )
}

export function ThreeJSDefaultV2() {
    return (
      <Canvas>
          <ambientLight intensity={Math.PI / 2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
          <pointLight position={[10, 10, 10]} decay={0} intensity={Math.PI} />
          <Box position={[0, 1, 0]} color={'orange'}/>
          <Box position={[1, 2, 0]} color={'hot-pink'}/>
      </Canvas>
    )
  }