import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import gsap from 'gsap'

function CoconutModel(props) {
  const { scene } = useGLTF('/Images/coco3d.glb')
  return <primitive object={scene.clone()} {...props} />
}

function CrackedCoconutModel(props) {
  const { scene } = useGLTF('/Images/coco.glb')
  const crackedScene = useMemo(() => {
    const cloned = scene.clone()
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    return cloned
  }, [scene])

  return <primitive object={crackedScene} {...props} />
}

useGLTF.preload('/Images/coco3d.glb')
useGLTF.preload('/Images/coco.glb')

function Coconut({ position, rotation = [0, 0, 0], scale = [0.8, 0.8, 0.8], isCracking, onCrackComplete }) {
  const groupRef = useRef()
  const [isCracked, setIsCracked] = useState(false)

  useEffect(() => {
    if (isCracking && !isCracked && groupRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsCracked(true)
          onCrackComplete?.()
        },
      })

      tl.to(groupRef.current.position, {
        y: position[1] + 1.2,
        duration: 0.4,
        ease: 'power2.in',
      })
        .to(groupRef.current.position, {
          y: position[1] - 0.5,
          duration: 0.15,
          ease: 'power3.in',
        })
        .to(groupRef.current.position, {
          y: position[1],
          duration: 0.3,
          ease: 'bounce.out',
        })

      return () => tl.kill()
    }
  }, [isCracking, isCracked, onCrackComplete, position, rotation, scale])

  useFrame((state) => {
    if (groupRef.current && !isCracking && !isCracked) {
      groupRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.06
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.02
    }
  })

  if (isCracked) {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        <CrackedCoconutModel position={[-1, -0.2, -0.03]} rotation={[0.2, -0.65, -0.4]} scale={0.5} />
        <CrackedCoconutModel position={[-0.1, -0.22
          , 0.08]} rotation={[-0.14, 0.62, -0.22]} scale={0.5} />
        <CoconutParticles active />
        <CoconutWaterSpray active />
      </group>
    )
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <CoconutModel scale={0.5} />
      <CoconutParticles active={isCracking} />
    </group>
  )
}

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
      <pointsMaterial size={0.02} color="#4A3020" transparent opacity={0.9} sizeAttenuation />
    </points>
  )
}

function CoconutWaterSpray({ active }) {
  const particlesRef = useRef()
  const particleCount = 60
  const startTime = useRef(Date.now())

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

    const elapsed = (Date.now() - startTime.current) / 1000
    const posArray = particlesRef.current.geometry.attributes.position.array

    for (let i = 0; i < particleCount; i++) {
      const vel = velocities[i]
      posArray[i * 3] += vel.x * 0.95
      posArray[i * 3 + 1] += vel.y - elapsed * 0.015
      posArray[i * 3 + 2] += vel.z * 0.95
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
      <pointsMaterial size={0.04} color="#8bd3ff" transparent opacity={0.75} sizeAttenuation />
    </points>
  )
}

function CoconutController({
  position = [1.5, -1.3, -0.5],
  rotation = [0, 0, 0],
  scale = [0.8, 0.8, 0.8],
}) {
  const [isCracking, setIsCracking] = useState(false)
  const [instanceKey, setInstanceKey] = useState(0)
  const [hasCracked, setHasCracked] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== 'Enter') return

      if (!isCracking && !hasCracked) {
        setIsCracking(true)
        return
      }

      setInstanceKey((prev) => prev + 1)
      setIsCracking(false)
      setHasCracked(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hasCracked, isCracking])

  return (
    <Coconut
      key={instanceKey}
      position={position}
      rotation={rotation}
      scale={scale}
      isCracking={isCracking}
      onCrackComplete={() => setHasCracked(true)}
    />
  )
}

export default CoconutController
