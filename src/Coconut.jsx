import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from './gsapLite'

function CoconutParticles({ active }) {
  const particlesRef = useRef()
  const particleCount = 40
  
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const vel = []
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 0.6 + 0.2
      
      pos[i * 3] = Math.cos(angle) * radius * 0.3
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.2
      pos[i * 3 + 2] = Math.sin(angle) * radius * 0.3
      
      vel.push({
        x: Math.cos(angle) * (Math.random() * 0.06 + 0.03),
        y: Math.random() * 0.05 + 0.02,
        z: Math.sin(angle) * (Math.random() * 0.06 + 0.03)
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
      posArray[i * 3 + 1] += vel.y - 0.004
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
      <pointsMaterial size={0.025} color="#6B4423" transparent opacity={0.85} sizeAttenuation />
    </points>
  )
}

function Coconut({ position, isCracking, onCrackComplete }) {
  const groupRef = useRef()
  const topHalfRef = useRef()
  const bottomHalfRef = useRef()
  const handRef = useRef()
  const [isCracked, setIsCracked] = useState(false)
  const [showHand, setShowHand] = useState(true)
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
        y: position[1] + 0.8,
        duration: 0.35,
        ease: "power2.in"
      })
      .to(groupRef.current.rotation, {
        x: -0.3,
        z: 0.1,
        duration: 0.35,
        ease: "power2.in"
      }, 0)
      .to(groupRef.current.position, {
        y: position[1] - 0.3,
        duration: 0.12,
        ease: "power3.in"
      })
      .to(groupRef.current.rotation, {
        x: 0.5,
        z: -0.3,
        duration: 0.12,
        ease: "power3.in"
      }, "<")
      .to(groupRef.current.scale, {
        x: 1.15,
        y: 0.85,
        z: 1.15,
        duration: 0.08,
        ease: "power2.in",
        yoyo: true,
        repeat: 4
      })
      .to(groupRef.current.position, {
        y: position[1],
        duration: 0.25,
        ease: "bounce.out"
      })
      .to(groupRef.current.rotation, {
        x: 0,
        z: 0,
        duration: 0.3,
        ease: "elastic.out(1, 0.5)"
      }, "<")

      return () => tl.kill()
    }
  }, [isCracking, isCracked, position, onCrackComplete])

  useEffect(() => {
    if (isCracked && !scattered) {
      setScattered(true)
      setShowHand(false)

      const topAngle = -Math.PI / 4
      const topRadius = 0.7

      const bottomAngle = Math.PI / 3
      const bottomRadius = 0.6

      if (topHalfRef.current) {
        gsap.to(topHalfRef.current.position, {
          x: Math.cos(topAngle) * topRadius,
          y: -0.2,
          z: Math.sin(topAngle) * topRadius * 0.4,
          duration: 0.5,
          ease: "power2.out"
        })
        gsap.to(topHalfRef.current.rotation, {
          x: Math.PI * 0.35,
          y: topAngle,
          duration: 0.5,
          ease: "power2.out"
        })
      }

      if (bottomHalfRef.current) {
        gsap.to(bottomHalfRef.current.position, {
          x: Math.cos(bottomAngle) * bottomRadius,
          y: -0.5,
          z: Math.sin(bottomAngle) * bottomRadius * 0.4,
          duration: 0.5,
          ease: "power2.out"
        })
        gsap.to(bottomHalfRef.current.rotation, {
          x: -Math.PI * 0.3,
          y: bottomAngle,
          duration: 0.5,
          ease: "power2.out"
        })
      }
    }
  }, [isCracked, scattered])

  useFrame((state) => {
    if (groupRef.current && !isCracking && !isCracked) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1) * 0.03
    }
  })

  const coconutColor = "#4A3020"

  if (isCracked) {
    return (
      <group position={position}>
        <group ref={topHalfRef} position={[0, 0.15, 0]} rotation={[0.4, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.35, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial 
              color={coconutColor} 
              roughness={0.88}
              metalness={0.02}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        <group ref={bottomHalfRef} position={[0, -0.15, 0]} rotation={[-0.35, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.35, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
            <meshStandardMaterial 
              color={coconutColor} 
              roughness={0.88}
              metalness={0.02}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        <CoconutParticles active={true} />

        <pointLight position={[0, 0, 0.6]} intensity={1.5} color="#FFFAF0" distance={2} decay={2} />
      </group>
    )
  }

  return (
    <group ref={groupRef} position={position}>
      {showHand && (
        <group ref={handRef} position={[0.5, -0.4, 0]} rotation={[0, 0, -0.3]}>
          <mesh>
            <boxGeometry args={[0.18, 0.4, 0.12]} />
            <meshStandardMaterial color="#D4A574" roughness={0.7} />
          </mesh>
          <mesh position={[0.12, 0.15, 0]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.08, 0.25, 0.1]} />
            <meshStandardMaterial color="#D4A574" roughness={0.7} />
          </mesh>
        </group>
      )}

      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial 
          color={coconutColor} 
          roughness={0.92}
          metalness={0.01}
        />
      </mesh>

      <mesh position={[0, 0.33, 0]}>
        <cylinderGeometry args={[0.1, 0.14, 0.14, 16]} />
        <meshStandardMaterial color="#2D1F14" roughness={0.95} />
      </mesh>

      <CoconutParticles active={isCracking} />
    </group>
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

  const handleCrackComplete = () => {
    setTimeout(() => {
    }, 300)
  }

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
