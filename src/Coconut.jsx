import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import gsap from './gsapLite'

function CoconutModel({ scale = [0.8, 0.8, 0.8] }) {
  const { scene } = useGLTF('/coconut.glb')
  return <primitive object={scene.clone()} scale={scale} />
}

useGLTF.preload('/coconut.glb')

function CoconutParticles({ active }) {
  const particlesRef = useRef()
  const particleCount = 30

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const vel = []

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 0.4 + 0.1

      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.2
      pos[i * 3 + 2] = Math.sin(angle) * radius

      vel.push({
        x: Math.cos(angle) * (Math.random() * 0.04 + 0.02),
        y: Math.random() * 0.03 + 0.01,
        z: Math.sin(angle) * (Math.random() * 0.04 + 0.02),
      })
    }

    return { positions: pos, velocities: vel }
  }, [])

  useFrame(() => {
    if (!active || !particlesRef.current) return

    const posArray = particlesRef.current.geometry.attributes.position.array

    for (let i = 0; i < particleCount; i++) {
      const vel = velocities[i]
      posArray[i * 3] += vel.x
      posArray[i * 3 + 1] += vel.y - 0.003
      posArray[i * 3 + 2] += vel.z
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  if (!active) return null

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#4A3020" transparent opacity={0.9} />
    </points>
  )
}

function CoconutWaterSpray({ active }) {
  const particlesRef = useRef()
  const particleCount = 60

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const vel = []

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const spread = Math.random() * 0.5

      pos[i * 3] = Math.cos(angle) * spread * 0.3
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = Math.sin(angle) * spread * 0.3

      vel.push({
        x: Math.cos(angle) * (Math.random() * 0.08 + 0.04),
        y: Math.random() * 0.1 + 0.05,
        z: Math.sin(angle) * (Math.random() * 0.08 + 0.04),
      })
    }

    return { positions: pos, velocities: vel }
  }, [])

  useFrame(() => {
    if (!active || !particlesRef.current) return

    const posArray = particlesRef.current.geometry.attributes.position.array

    for (let i = 0; i < particleCount; i++) {
      const vel = velocities[i]
      posArray[i * 3] += vel.x
      posArray[i * 3 + 1] += vel.y - 0.02
      posArray[i * 3 + 2] += vel.z
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  if (!active) return null

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#E8F4F8" transparent opacity={0.85} />
    </points>
  )
}

function Coconut({
  position,
  rotation = [0, 0, 0],
  scale = [0.8, 0.8, 0.8],
  crackTrigger = 0,
}) {
  const groupRef = useRef()
  const leftHalfRef = useRef()
  const rightHalfRef = useRef()
  const [hasCracked, setHasCracked] = useState(false)
  const [showPieces, setShowPieces] = useState(false)

  useEffect(() => {
    if (crackTrigger > 0 && !hasCracked && groupRef.current) {
      const tl = gsap.timeline({
        onComplete: () => setHasCracked(true),
      })

      tl.to(groupRef.current.position, {
        y: position[1] + 1,
        duration: 0.3,
      })
        .to(groupRef.current.position, {
          y: position[1] - 0.5,
          duration: 0.15,
        })
        .to(groupRef.current.position, {
          y: position[1],
          duration: 0.3,
          ease: 'bounce.out',
          onComplete: () => setShowPieces(true),
        })

      return () => tl.kill()
    }
  }, [crackTrigger, hasCracked, position])

  useEffect(() => {
    if (!showPieces || !leftHalfRef.current || !rightHalfRef.current) {
      return undefined
    }

    const tl = gsap.timeline()
    tl.set([leftHalfRef.current.position, rightHalfRef.current.position], {
      x: 0,
      y: 0,
      z: 0,
    })
      .set([leftHalfRef.current.rotation, rightHalfRef.current.rotation], {
        x: 0,
        y: 0,
        z: 0,
      })
      .to(leftHalfRef.current.position, {
        x: -0.34,
        z: 0.2,
        duration: 0.5,
        ease: 'power2.out',
      })
      .to(rightHalfRef.current.position, {
        x: 0.34,
        z: -0.14,
        duration: 0.5,
        ease: 'power2.out',
      }, '<')
      .to(leftHalfRef.current.rotation, {
        z: -0.9,
        y: -0.3,
        duration: 0.5,
        ease: 'power2.out',
      }, '<')
      .to(rightHalfRef.current.rotation, {
        z: 0.9,
        y: 0.3,
        duration: 0.5,
        ease: 'power2.out',
      }, '<')

    return () => tl.kill()
  }, [showPieces])

  useFrame((state) => {
    if (groupRef.current && !hasCracked) {
      groupRef.current.rotation.set(
        rotation[0],
        rotation[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.06,
        rotation[2]
      )
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {!showPieces && <CoconutModel scale={scale} />}
      {showPieces && (
        <>
          <group ref={leftHalfRef}>
            <group position={[-0.08, 0, 0]} scale={[scale[0] * 0.48, scale[1], scale[2]]}>
              <CoconutModel />
            </group>
          </group>
          <group ref={rightHalfRef}>
            <group position={[0.08, 0, 0]} scale={[scale[0] * 0.48, scale[1], scale[2]]}>
              <CoconutModel />
            </group>
          </group>
        </>
      )}
      <CoconutParticles active={crackTrigger > 0 && !showPieces} />
      <CoconutWaterSpray active={hasCracked} />
    </group>
  )
}

function CoconutController({
  position = [0.8, -0.8, -1],
  rotation = [0, 0, 0],
  scale = [0.8, 0.8, 0.8],
}) {
  const [crackTrigger, setCrackTrigger] = useState(0)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Enter') {
        setCrackTrigger((prev) => prev + 1)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <Coconut
      position={position}
      rotation={rotation}
      scale={scale}
      crackTrigger={crackTrigger}
    />
  )
}

export default CoconutController
