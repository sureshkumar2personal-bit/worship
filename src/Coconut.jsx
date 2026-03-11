import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

function CoconutModel(props) {
  const { scene } = useGLTF('/Images/coco3d.glb')
  return <primitive object={scene.clone()} {...props} />
}

function ScatterModel(props) {
  const { scene } = useGLTF('/Images/scatter1.glb')
  return <primitive object={scene.clone()} {...props} />
}

function Coconut({ position, isCracking, onCrackComplete }) {
  const groupRef = useRef()
  const topHalfRef = useRef()
  const bottomHalfRef = useRef()
  const [isCracked, setIsCracked] = useState(false)
  const [scattered, setScattered] = useState(false)

  useEffect(() => {
    if (isCracking && !isCracked) {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsCracked(true)
          onCrackComplete?.()
        }
      })

      tl.to(groupRef.current.position, {
        y: position[1] + 1.2,
        duration: 0.4,
        ease: "power2.in"
      })
      .to(groupRef.current.rotation, {
        x: -0.5,
        z: 0.2,
        duration: 0.4,
        ease: "power2.in"
      }, 0)
      .to(groupRef.current.position, {
        y: position[1] - 0.5,
        duration: 0.15,
        ease: "power3.in"
      })
      .to(groupRef.current.rotation, {
        x: 0.8,
        z: -0.4,
        duration: 0.15,
        ease: "power3.in"
      }, "<")
      .to(groupRef.current.scale, {
        x: 1.1,
        y: 0.9,
        z: 1.1,
        duration: 0.06,
        ease: "power1.inOut",
        yoyo: true,
        repeat: 6
      })
      .to(groupRef.current.position, {
        y: position[1],
        duration: 0.3,
        ease: "bounce.out"
      })
      .to(groupRef.current.rotation, {
        x: 0,
        z: 0,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)"
      }, "<")

      return () => tl.kill()
    }
  }, [isCracking, isCracked, position, onCrackComplete])

  useEffect(() => {
    if (isCracked && !scattered) {
      setScattered(true)

      if (topHalfRef.current) {
        gsap.to(topHalfRef.current.position, {
          x: -0.5,
          y: -0.15,
          z: -0.2,
          duration: 0.4,
          ease: "power2.out"
        })
        gsap.to(topHalfRef.current.rotation, {
          x: -Math.PI * 0.15,
          y: -Math.PI * 0.25,
          z: Math.PI * 0.1,
          duration: 0.4,
          ease: "power2.out"
        })
      }

      if (bottomHalfRef.current) {
        gsap.to(bottomHalfRef.current.position, {
          x: 0.4,
          y: -0.4,
          z: 0.3,
          duration: 0.4,
          ease: "power2.out"
        })
        gsap.to(bottomHalfRef.current.rotation, {
          x: Math.PI * 0.2,
          y: Math.PI * 0.35,
          z: -Math.PI * 0.15,
          duration: 0.4,
          ease: "power2.out"
        })
      }
    }
  }, [isCracked, scattered])

  useFrame((state) => {
    if (groupRef.current && !isCracking && !isCracked) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.06
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.02
    }
  })

  const coconutColor = "#5a3a1a"
  const huskColor = "#4a3520"
  const fleshColor = "#f7f1e8"
  const edgeColor = "#3d2815"

  if (isCracked) {
    return (
      <group position={position}>
        <pointLight position={[0.3, 0.5, 0.6]} intensity={1.6} color="#fff2dd" distance={2.5} decay={2} />
        <pointLight position={[-0.4, 0.2, -0.4]} intensity={0.8} color="#ffd9a6" distance={2} decay={2} />
        
        <group ref={topHalfRef} position={[-0.2, -0.1, 0]} rotation={[0, -0.5, 0.2]} scale={[0.8, 0.8, 0.8]}>
          <ScatterModel />
        </group>

        <group ref={bottomHalfRef} position={[0.15, -0.2, 0.1]} rotation={[0, 0.7, -0.3]} scale={[0.8, 0.8, 0.8]}>
          <ScatterModel />
        </group>

        <CoconutParticles active={true} />
        <CoconutWaterSpray active={true} />
        <pointLight position={[0, 0, 0.4]} intensity={2.5} color="#FFFAF0" distance={2} decay={2} />
      </group>
    )
  }

  return (
    <group ref={groupRef} position={position}>
      <pointLight position={[0.3, 0.5, 0.6]} intensity={1.6} color="#fff2dd" distance={2.5} decay={2} />
      <pointLight position={[-0.4, 0.2, -0.4]} intensity={0.8} color="#ffd9a6" distance={2} decay={2} />
      
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
        z: Math.sin(angle) * (Math.random() * 0.04 + 0.02)
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
        z: Math.sin(angle) * (Math.random() * 0.08 + 0.04)
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

function CoconutController() {
  const [isCracking, setIsCracking] = useState(false)
  const [coconutVisible, setCoconutVisible] = useState(true)
  const [key, setKey] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (!coconutVisible) {
          setCoconutVisible(true)
          setIsCracking(false)
          setKey(k => k + 1)
        } else {
          setIsCracking(prev => !prev)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [coconutVisible])

  const handleCrackComplete = () => {}

  if (!coconutVisible) return null

  return (
    <Coconut 
      key={key}
      position={[1.5, -1.3, -0.5]}
      isCracking={isCracking} 
      onCrackComplete={handleCrackComplete}
    />
  )
}

export default CoconutController
