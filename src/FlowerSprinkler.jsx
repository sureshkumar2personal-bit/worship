import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

function RoseFlower({ position, delay }) {
  const meshRef = useRef()
  const startPos = useMemo(() => [...position], [position])
  
  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        y: -2,
        duration: 2 + Math.random(),
        delay: delay,
        ease: "power2.in",
        repeat: -1,
        yoyo: false
      })
      gsap.to(meshRef.current.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        z: Math.PI,
        duration: 3,
        delay: delay,
        ease: "none",
        repeat: -1
      })
    }
  }, [delay])

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#DC143C" roughness={0.8} />
      </mesh>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} rotation={[i * 0.5, i * 0.3, 0]} position={[0, 0.02, 0]}>
          <planeGeometry args={[0.12, 0.1]} />
          <meshStandardMaterial color="#DC143C" side={THREE.DoubleSide} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function Sunflower({ position, delay }) {
  const meshRef = useRef()
  
  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        y: -2,
        duration: 2.2 + Math.random() * 0.5,
        delay: delay,
        ease: "power2.in",
        repeat: -1,
        yoyo: false
      })
      gsap.to(meshRef.current.rotation, {
        y: Math.PI * 2,
        duration: 4,
        delay: delay,
        ease: "none",
        repeat: -1
      })
    }
  }, [delay])

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <circleGeometry args={[0.08, 16]} />
        <meshStandardMaterial color="#8B4513" side={THREE.DoubleSide} />
      </mesh>
      {[...Array(12)].map((_, i) => (
        <mesh key={i} rotation={[0, (i * Math.PI * 2) / 12, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[0.08, 0.12]} />
          <meshStandardMaterial color="#FFD700" side={THREE.DoubleSide} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function FlowerParticles({ active, handPosition }) {
  const particlesRef = useRef()
  const particleCount = 40
  const startTime = useRef(Date.now())
  
  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const vel = []
    const cols = new Float32Array(particleCount * 3)
    
    const flowerColors = [
      [0.86, 0.08, 0.24],
      [1, 0.84, 0],
      [1, 0.5, 0.8],
      [1, 0.6, 0.2],
      [0.9, 0.3, 0.5]
    ]
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.3
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3
      
      vel.push({
        x: (Math.random() - 0.5) * 0.02,
        y: -0.04 - Math.random() * 0.02,
        z: (Math.random() - 0.5) * 0.02
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
    
    const elapsed = (Date.now() - startTime.current) / 1000
    const posArray = particlesRef.current.geometry.attributes.position.array
    
    for (let i = 0; i < particleCount; i++) {
      const vel = velocities[i]
      posArray[i * 3] += vel.x + Math.sin(elapsed + i) * 0.005
      posArray[i * 3 + 1] += vel.y
      posArray[i * 3 + 2] += vel.z + Math.cos(elapsed + i) * 0.005
      
      if (posArray[i * 3 + 1] < -2) {
        posArray[i * 3] = (Math.random() - 0.5) * 0.3
        posArray[i * 3 + 1] = 0
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 0.3
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  if (!active || !handPosition) return null

  return (
    <points ref={particlesRef} position={handPosition}>
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

function SprinklingHand({ isActive, onStatusChange }) {
  const handRef = useRef()
  const [isSprinkling, setIsSprinkling] = useState(false)
  const [flowers, setFlowers] = useState([])
  const [handPos, setHandPos] = useState([-1.5, 2, 1])
  const sprinkleIntervalRef = useRef(null)

  useEffect(() => {
    if (isActive && !isSprinkling) {
      setIsSprinkling(true)
      onStatusChange?.('🌸 Flowers falling...')
      
      gsap.to(handRef.current.position, {
        x: -1.5,
        y: 2,
        z: 1,
        duration: 0.5,
        ease: "power2.out"
      })

      const generateFlower = (index) => {
        const isRose = index % 2 === 0
        const newFlower = {
          id: Date.now() + index,
          position: [
            -1.5 + (Math.random() - 0.5) * 0.6,
            2 + (Math.random() - 0.5) * 0.4,
            1 + (Math.random() - 0.5) * 0.6
          ],
          type: isRose ? 'rose' : 'sunflower',
          delay: index * 0.15
        }
        setFlowers(prev => [...prev.slice(-30), newFlower])
      }

      let count = 0
      sprinkleIntervalRef.current = setInterval(() => {
        generateFlower(count)
        count++
      }, 200)

    } else if (!isActive && isSprinkling) {
      clearInterval(sprinkleIntervalRef.current)
      setIsSprinkling(false)
      setFlowers([])
      onStatusChange?.('🌹🌻 Sprinkle Flowers')
      
      gsap.to(handRef.current.position, {
        x: 1.5,
        y: 0.5,
        z: 1.5,
        duration: 0.5,
        ease: "power2.in"
      })
    }

    return () => clearInterval(sprinkleIntervalRef.current)
  }, [isActive, isSprinkling, onStatusChange])

  useFrame((state) => {
    if (handRef.current) {
      if (isSprinkling) {
        handRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 5) * 0.12
        handRef.current.rotation.x = -0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.08
      }
      
      setHandPos([
        handRef.current.position.x,
        handRef.current.position.y,
        handRef.current.position.z
      ])
    }
  })

  return (
    <>
      <group ref={handRef} position={[1.5, 0.5, 1.5]} rotation={[0, 0, 0]}>
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
        
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.1, 0.08, 0.06, 12]} />
          <meshStandardMaterial color="#8B4513" roughness={0.5} metalness={0.1} />
        </mesh>
        
        <pointLight position={[0, 0.3, 0.1]} intensity={0.8} color="#FFAA00" distance={1.5} decay={2} />
      </group>
      
      {flowers.map((flower) => (
        flower.type === 'rose' ? (
          <RoseFlower
            key={flower.id}
            position={flower.position}
            delay={flower.delay}
          />
        ) : (
          <Sunflower
            key={flower.id}
            position={flower.position}
            delay={flower.delay}
          />
        )
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
