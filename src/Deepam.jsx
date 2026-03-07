import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useTexture } from '@react-three/drei'

function Flame({ isOn }) {
  const flameRef = useRef()
  const glowRef = useRef()
  
  useFrame((state) => {
    if (flameRef.current && isOn) {
      const time = state.clock.elapsedTime
      flameRef.current.scale.y = 1 + Math.sin(time * 15) * 0.15
      flameRef.current.scale.x = 1 + Math.sin(time * 12) * 0.1
      flameRef.current.position.y = 0.15 + Math.sin(time * 10) * 0.02
      flameRef.current.rotation.z = Math.sin(time * 8) * 0.1
    }
  })

  if (!isOn) return null

  return (
    <>
      <group ref={flameRef} position={[0, 0.15, 0]}>
        <mesh>
          <coneGeometry args={[0.06, 0.2, 8]} />
          <meshBasicMaterial color="#FF6600" transparent opacity={0.9} />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <coneGeometry args={[0.04, 0.15, 8]} />
          <meshBasicMaterial color="#FFAA00" transparent opacity={0.95} />
        </mesh>
        <mesh position={[0, -0.02, 0]}>
          <coneGeometry args={[0.025, 0.1, 8]} />
          <meshBasicMaterial color="#FFFF00" transparent opacity={1} />
        </mesh>
      </group>
      
      <pointLight 
        ref={glowRef}
        position={[0, 0.3, 0]} 
        intensity={3} 
        color="#FF8800" 
        distance={4} 
        decay={2}
      />
    </>
  )
}

function Deepam({ position, isOn, side }) {
  const groupRef = useRef()
  const plateRef = useRef()
  const oilRef = useRef()
  
  const deepamTexture = useTexture('/deepam.jpg')

  useEffect(() => {
    if (groupRef.current) {
      if (isOn) {
        gsap.to(groupRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.3,
          ease: "back.out(1.5)"
        })
      } else {
        gsap.to(groupRef.current.scale, {
          x: 0.9,
          y: 0.9,
          z: 0.9,
          duration: 0.2
        })
      }
    }
  }, [isOn])

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.08, 16]} />
        <meshStandardMaterial 
          map={deepamTexture}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      <mesh position={[0, 0.04, 0]} ref={oilRef}>
        <cylinderGeometry args={[0.22, 0.26, 0.02, 16]} />
        <meshStandardMaterial 
          color={isOn ? "#8B4513" : "#5D3A1A"} 
          roughness={0.4}
          emissive={isOn ? "#FF6600" : "#000000"}
          emissiveIntensity={isOn ? 0.3 : 0}
        />
      </mesh>

      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.06, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.7} />
      </mesh>

      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 8]} />
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </mesh>

      <Flame isOn={isOn} />

      {isOn && (
        <pointLight 
          position={[0, 0.3, 0.2]} 
          intensity={2} 
          color="#FFAA00" 
          distance={3} 
          decay={2}
        />
      )}
    </group>
  )
}

function DeepamController({ isOn }) {
  return (
    <>
      <Deepam position={[-2, -1.2, -1]} isOn={isOn} side="left" />
      <Deepam position={[2, -1.2, -1]} isOn={isOn} side="right" />
    </>
  )
}

export default DeepamController
