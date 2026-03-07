import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

function Flower({ position, targetPosition, delay, color }) {
  const meshRef = useRef()
  const startPos = useMemo(() => [...position], [position])
  
  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        x: targetPosition[0] + (Math.random() - 0.5) * 0.5,
        y: targetPosition[1] - 1.5,
        z: targetPosition[2] + (Math.random() - 0.5) * 0.5,
        duration: 1.2 + Math.random() * 0.5,
        delay: delay,
        ease: "power2.in"
      })
      gsap.to(meshRef.current.rotation, {
        x: Math.random() * Math.PI * 4,
        y: Math.random() * Math.PI * 4,
        z: Math.random() * Math.PI * 4,
        duration: 1.5,
        delay: delay,
        ease: "none"
      })
    }
  }, [delay, targetPosition])

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.03, 6, 6]} />
      <meshStandardMaterial color={color} roughness={0.6} emissive={color} emissiveIntensity={0.2} />
    </mesh>
  )
}

function FlowerParticles({ active, handPosition }) {
  const particlesRef = useRef()
  const particleCount = 30
  
  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const vel = []
    const cols = new Float32Array(particleCount * 3)
    
    const flowerColors = [
      [1, 0.3, 0.3],
      [1, 0.8, 0.2],
      [1, 0.5, 0.8],
      [1, 1, 0.3],
      [0.8, 0.4, 1]
    ]
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = 0
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = 0
      
      vel.push({
        x: (Math.random() - 0.5) * 0.05,
        y: -0.03 - Math.random() * 0.02,
        z: (Math.random() - 0.5) * 0.05
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

  if (!active || !handPosition) return null

  return (
    <points ref={particlesRef} position={[handPosition[0], handPosition[1] - 0.3, handPosition[2]]}>
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
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.95} sizeAttenuation />
    </points>
  )
}

function SprinklingHand({ isActive, onStatusChange }) {
  const handRef = useRef()
  const bowlRef = useRef()
  const [isSprinkling, setIsSprinkling] = useState(false)
  const [flowers, setFlowers] = useState([])
  const [handPos, setHandPos] = useState([1.2, 0.8, 0])
  const flowerCount = 40
  const sprinkleIntervalRef = useRef(null)
  
  const flowerColors = ['#FF6B6B', '#FFE66D', '#C44DFF', '#FF9F43', '#EE5A24']

  useEffect(() => {
    if (isActive && !isSprinkling) {
      setIsSprinkling(true)
      onStatusChange?.('🌸 Sprinkling flowers...')
      
      gsap.to(handRef.current.position, {
        x: 0.5,
        y: 1.8,
        z: 0.5,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: () => {
          if (handRef.current) {
            setHandPos([
              handRef.current.position.x,
              handRef.current.position.y,
              handRef.current.position.z
            ])
          }
        }
      })

      const generateFlower = (index) => {
        const newFlower = {
          id: Date.now() + index,
          position: [
            0.5 + (Math.random() - 0.5) * 0.3,
            1.8 + (Math.random() - 0.5) * 0.2,
            0.5 + (Math.random() - 0.5) * 0.3
          ],
          color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
          delay: index * 0.08
        }
        setFlowers(prev => [...prev.slice(-50), newFlower])
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
            onStatusChange?.('🌺 Sprinkle Flowers')
          }, 2500)
        }
      }, 100)

    } else if (!isActive && isSprinkling) {
      clearInterval(sprinkleIntervalRef.current)
      setIsSprinkling(false)
      setFlowers([])
      onStatusChange?.('🌺 Sprinkle Flowers')
      
      gsap.to(handRef.current.position, {
        x: 1.2,
        y: 0.8,
        z: 0,
        duration: 0.5,
        ease: "power2.in"
      })
    }

    return () => clearInterval(sprinkleIntervalRef.current)
  }, [isActive, isSprinkling, onStatusChange])

  useFrame((state) => {
    if (handRef.current && isSprinkling) {
      handRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 6) * 0.15
      handRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 4) * 0.1 - 0.3
      
      setHandPos([
        handRef.current.position.x,
        handRef.current.position.y,
        handRef.current.position.z
      ])
    }
  })

  return (
    <>
      <group ref={handRef} position={[1.2, 0.8, 0]} rotation={[0, 0, 0]}>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 0.3, 8]} />
          <meshStandardMaterial color="#D4A574" roughness={0.7} />
        </mesh>
        
        <mesh position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#D4A574" roughness={0.7} />
        </mesh>
        
        <mesh position={[0.06, 0.4, 0]} rotation={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.02, 0.025, 0.12, 6]} />
          <meshStandardMaterial color="#D4A574" roughness={0.7} />
        </mesh>
        <mesh position={[-0.06, 0.4, 0]} rotation={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.02, 0.025, 0.12, 6]} />
          <meshStandardMaterial color="#D4A574" roughness={0.7} />
        </mesh>
        
        <mesh ref={bowlRef} position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.1, 0.08, 0.06, 12]} />
          <meshStandardMaterial color="#8B4513" roughness={0.5} metalness={0.1} />
        </mesh>
        
        <pointLight position={[0, 0.3, 0.1]} intensity={0.5} color="#FFAA00" distance={1} decay={2} />
      </group>
      
      {flowers.map((flower) => (
        <Flower
          key={flower.id}
          position={flower.position}
          targetPosition={[0, 0.5, -2]}
          delay={flower.delay}
          color={flower.color}
        />
      ))}
      
      <FlowerParticles active={isSprinkling} handPosition={handPos} />
    </>
  )
}

function FlowerSprinkler({ isActive, onStatusChange }) {
  return (
    <SprinklingHand 
      isActive={isActive} 
      onStatusChange={onStatusChange}
    />
  )
}

export default FlowerSprinkler
