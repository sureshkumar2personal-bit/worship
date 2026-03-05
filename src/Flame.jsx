import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Flame({ position = [0, 0, 0] }) {
  const outerFlameRef = useRef()
  const midFlameRef = useRef()
  const innerFlameRef = useRef()
  const glowRef = useRef()
  const lightRef = useRef()

  const outerMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#ff4500'),
      transparent: true,
      opacity: 0.7,
    })
  }, [])

  const midMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#ff6600'),
      transparent: true,
      opacity: 0.85,
    })
  }, [])

  const innerMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#ffaa00'),
      transparent: true,
      opacity: 0.95,
    })
  }, [])

  const coreMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#ffffcc'),
      transparent: true,
      opacity: 1,
    })
  }, [])

  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#ff2200'),
      transparent: true,
      opacity: 0.3,
    })
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (outerFlameRef.current) {
      const flicker = 1 + Math.sin(time * 12) * 0.15 + Math.sin(time * 23) * 0.08
      outerFlameRef.current.scale.set(flicker * 0.9, flicker, flicker * 0.9)
      outerFlameRef.current.rotation.y = Math.sin(time * 8) * 0.15
      outerFlameRef.current.rotation.z = Math.sin(time * 5) * 0.05
    }

    if (midFlameRef.current) {
      const flicker = 1 + Math.sin(time * 15) * 0.12 + Math.sin(time * 27) * 0.06
      midFlameRef.current.scale.set(flicker * 0.85, flicker, flicker * 0.85)
      midFlameRef.current.rotation.y = Math.sin(time * 10) * 0.1
    }

    if (innerFlameRef.current) {
      const flicker = 1 + Math.sin(time * 18) * 0.1 + Math.sin(time * 31) * 0.05
      innerFlameRef.current.scale.set(flicker * 0.7, flicker, flicker * 0.7)
    }

    if (glowRef.current) {
      const pulse = 1 + Math.sin(time * 10) * 0.2
      glowRef.current.scale.set(pulse * 1.2, pulse * 1.5, pulse * 1.2)
      glowRef.current.material.opacity = 0.25 + Math.sin(time * 15) * 0.1
    }

    if (lightRef.current) {
      lightRef.current.intensity = 2 + Math.sin(time * 20) * 0.8 + Math.sin(time * 35) * 0.4
    }
  })

  return (
    <group position={position}>
      <pointLight
        ref={lightRef}
        position={[0, 0.3, 0]}
        intensity={2.5}
        color="#ff6600"
        distance={4}
        decay={2}
      />

      <mesh ref={glowRef} position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <primitive object={glowMaterial} />
      </mesh>

      <mesh ref={outerFlameRef} position={[0, 0.25, 0]}>
        <coneGeometry args={[0.18, 0.5, 8]} />
        <primitive object={outerMaterial} />
      </mesh>

      <mesh ref={midFlameRef} position={[0, 0.2, 0]}>
        <coneGeometry args={[0.12, 0.4, 8]} />
        <primitive object={midMaterial} />
      </mesh>

      <mesh ref={innerFlameRef} position={[0, 0.15, 0]}>
        <coneGeometry args={[0.07, 0.28, 8]} />
        <primitive object={innerMaterial} />
      </mesh>

      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <primitive object={coreMaterial} />
      </mesh>
    </group>
  )
}

export default Flame
