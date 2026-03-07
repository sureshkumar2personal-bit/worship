import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

function FlowerParticles({ active, position }) {
  const particlesRef = useRef()
  const particleCount = 25
  
  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const vel = []
    const cols = new Float32Array(particleCount * 3)
    
    const flowerColors = [
      [1, 0.8, 0.2],
      [1, 0.4, 0.6],
      [1, 0.9, 0.9],
      [1, 1, 0.5],
      [0.9, 0.5, 0.8]
    ]
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = 0
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = 0
      
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 0.03 + 0.02
      
      vel.push({
        x: Math.cos(angle) * speed,
        y: -Math.random() * 0.04 - 0.02,
        z: Math.sin(angle) * speed
      })
      
      const color = flowerColors[Math.floor(Math.random() * flowerColors.length)]
      cols[i * 3] = color[0]
      cols[i * 3 + 1] = color[1]
      cols[i * 3 + 2] = color[2]
    }
    
    return { positions: pos, velocities: vel, colors: cols }
  }, [])

  useFrame(() => {
    if (!active || !particlesRef.current) return
    
    const posArray = particlesRef.current.geometry.attributes.position.array
    
    for (let i = 0; i < particleCount; i++) {
      const vel = velocities[i]
      posArray[i * 3] += vel.x
      posArray[i * 3 + 1] += vel.y
      posArray[i * 3 + 2] += vel.z
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  if (!active) return null

  return (
    <points ref={particlesRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.9} sizeAttenuation />
    </points>
  )
}

function Flower({ position, rotation, delay }) {
  const meshRef = useRef()
  const initialY = position[1]
  
  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        y: initialY - 2,
        duration: 1.5 + Math.random() * 0.5,
        delay: delay,
        ease: "power2.in"
      })
      gsap.to(meshRef.current.rotation, {
        x: Math.random() * Math.PI * 2,
        y: Math.random() * Math.PI * 2,
        z: Math.random() * Math.PI * 2,
        duration: 1.5,
        delay: delay,
        ease: "power1.inOut"
      })
    }
  }, [delay, initialY])

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial color="#FFD700" roughness={0.8} />
    </mesh>
  )
}

function SprinklingHand({ isActive, onStatusChange }) {
  const handRef = useRef()
  const armRef = useRef()
  const flowerBowlRef = useRef()
  const [isSprinkling, setIsSprinkling] = useState(false)
  const [flowers, setFlowers] = useState([])
  const flowerCount = 50
  const sprinkleIntervalRef = useRef(null)

  useEffect(() => {
    if (isActive && !isSprinkling) {
      setIsSprinkling(true)
      onStatusChange?.('Flower sprinkling active')
      
      gsap.to(handRef.current.position, {
        x: 0.8,
        y: 1.5,
        z: 0,
        duration: 0.8,
        ease: "power2.out"
      })
      gsap.to(handRef.current.rotation, {
        x: -Math.PI / 4,
        y: 0,
        z: Math.PI / 6,
        duration: 0.8,
        ease: "power2.out"
      })

      const generateFlower = (index) => {
        const newFlower = {
          id: Date.now() + index,
          position: [
            0.8 + (Math.random() - 0.5) * 0.2,
            1.3 + (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.3
          ],
          rotation: [
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          ],
          delay: index * 0.15
        }
        setFlowers(prev => [...prev.slice(-30), newFlower])
      }

      let count = 0
      sprinkleIntervalRef.current = setInterval(() => {
        if (count < flowerCount) {
          generateFlower(count)
          count++
        } else {
          clearInterval(sprinkleIntervalRef.current)
          setTimeout(() => {
            setIsSprinkling(false)
            setFlowers([])
            onStatusChange?.('Click to sprinkle flowers')
          }, 2000)
        }
      }, 150)

    } else if (!isActive && isSprinkling) {
      clearInterval(sprinkleIntervalRef.current)
      setIsSprinkling(false)
      setFlowers([])
      onStatusChange?.('Click to sprinkle flowers')
      
      gsap.to(handRef.current.position, {
        x: 2,
        y: -1,
        z: 1,
        duration: 0.6,
        ease: "power2.in"
      })
      gsap.to(handRef.current.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.6,
        ease: "power2.in"
      })
    }

    return () => clearInterval(sprinkleIntervalRef.current)
  }, [isActive, isSprinkling, onStatusChange])

  useFrame((state) => {
    if (handRef.current && isSprinkling) {
      handRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * 0.1
    }
  })

  return (
    <>
      <group ref={handRef} position={[2, -1, 1]} rotation={[0, 0, 0]}>
        <group ref={armRef}>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 0.5, 8]} />
            <meshStandardMaterial color="#D4A574" roughness={0.7} />
          </mesh>
          
          <mesh position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#D4A574" roughness={0.7} />
          </mesh>
          
          <mesh position={[0.08, 0.6, 0]} rotation={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.025, 0.03, 0.15, 8]} />
            <meshStandardMaterial color="#D4A574" roughness={0.7} />
          </mesh>
          <mesh position={[-0.08, 0.6, 0]} rotation={[0, 0, -0.3]}>
            <cylinderGeometry args={[0.025, 0.03, 0.15, 8]} />
            <meshStandardMaterial color="#D4A574" roughness={0.7} />
          </mesh>
          
          <mesh ref={flowerBowlRef} position={[0, 0.65, 0]}>
            <cylinderGeometry args={[0.12, 0.1, 0.08, 16]} />
            <meshStandardMaterial color="#8B4513" roughness={0.6} />
          </mesh>
          
          {flowers.map((flower) => (
            <Flower
              key={flower.id}
              position={flower.position}
              rotation={flower.rotation}
              delay={flower.delay}
            />
          ))}
        </group>
      </group>
      
      {isSprinkling && (
        <FlowerParticles 
          active={isSprinkling} 
          position={[0.8, 1.3, 0]} 
        />
      )}
    </>
  )
}

function FlowerSprinkler({ onStatusChange }) {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const handleToggle = () => {
      setIsActive(prev => !prev)
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'f' || e.key === 'F') {
        handleToggle()
      }
    })

    return () => window.removeEventListener('keydown', handleToggle)
  }, [])

  return (
    <SprinklingHand 
      isActive={isActive} 
      onStatusChange={onStatusChange}
    />
  )
}

export default FlowerSprinkler
