import { useRef, Suspense, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import AartiPlate from './AartiPlate'
import FireParticles from './FireParticles'
import IncenseStand from './IncenseStand'
import TempleBell from './TempleBell'
import TempleDust from './TempleDust'
import CoconutController from './Coconut'
import FlowerSprinkler from './FlowerSprinkler'
import Flower from './Flower'
import Deepam from './Deepam'

const incensePosition = [-1.5, -2, -1.5]
const flowerPosition = [1.5, -1.5, -2]
const coconutPosition = [1.5, -1.55, -0.9]
const rightLampPosition = [1.8, 1.75, -1.75]
const bellPosition = [rightLampPosition[0], rightLampPosition[1] - 0.72, rightLampPosition[2]]

function getFacingRotationY(from, to) {
  return Math.atan2(to[0] - from[0], to[2] - from[2])
}

function GLBModel() {
  const { scene } = useGLTF('/murugan.glb')
  return <primitive object={scene} position={[0, 0.5, -2]} scale={[4, 4, 4]} />
}

useGLTF.preload('/murugan.glb')
useGLTF.preload('/flower.glb')

function Scene() {
  const { viewport, scene } = useThree()
  const cursorRef = useRef()
  const cursorTarget = useRef({ x: 0, y: 0 })
  const cursorVelocity = useRef({ x: 0, y: 0 })
  const spotLightRef = useRef()
  const [flowerActive, setFlowerActive] = useState(false)
  const [bellRinging, setBellRinging] = useState(false)
  const [lampSyncSignal, setLampSyncSignal] = useState(0)
  const [lampsOn, setLampsOn] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'f' || e.key === 'F') {
        setFlowerActive(prev => !prev)
      }
      if (e.key === 'l' || e.key === 'L') {
        setLampsOn(prev => {
          const next = !prev
          setLampSyncSignal(signal => signal + 1)
          return next
        })
      }
      if (e.key === 'b' || e.key === 'B') {
        setBellRinging(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  const spotLightTarget = useMemo(() => {
    const target = new THREE.Object3D()
    target.position.set(0, 0.5, -2)
    return target
  }, [])

  scene.fog = new THREE.FogExp2(0x0f3460, 0.08)

  useEffect(() => {
    if (spotLightRef.current) {
      spotLightRef.current.target = spotLightTarget
    }
  }, [spotLightTarget])

  useFrame((state) => {
    const mouse = state.pointer
    
    cursorTarget.current.x = mouse.x * (viewport.width / 2.5)
    cursorTarget.current.y = mouse.y * (viewport.height / 2.5) + 0.5

    if (cursorRef.current) {
      const prevX = cursorRef.current.position.x
      const prevY = cursorRef.current.position.y
      
      cursorRef.current.position.x += (cursorTarget.current.x - cursorRef.current.position.x) * 0.12
      cursorRef.current.position.y += (cursorTarget.current.y - cursorRef.current.position.y) * 0.12
      
      cursorVelocity.current.x = cursorRef.current.position.x - prevX
      cursorVelocity.current.y = cursorRef.current.position.y - prevY
    }
  })

  return (
    <>
      <color attach="background" args={['#1a0a2e']} />
      <ambientLight intensity={0.3} color="#663399" />
      <ambientLight intensity={0.3} color="#554433" />
      <pointLight
        position={[0, 0.5, 0]}
        intensity={1}
        color="#4466aa"
        distance={8}
        decay={2}
      />
      <pointLight
        position={[0, 1, 1]}
        intensity={0.5}
        color="#6688cc"
        distance={5}
        decay={2}
      />
      <spotLight
        position={[5, 5, 5]}
        intensity={1}
        color="#ff0066"
        angle={Math.PI / 4}
        penumbra={0.5}
      />
      <spotLight
        position={[-5, 5, 5]}
        intensity={1}
        color="#00ffcc"
        angle={Math.PI / 4}
        penumbra={0.5}
      />
      <spotLight
        ref={spotLightRef}
        position={[0, 8, 2]}
        intensity={20}
        color="#ffaa33"
        angle={Math.PI / 5}
        penumbra={0.3}
        distance={30}
        decay={0.5}
        castShadow
      />
      <primitive object={spotLightTarget} />
      <pointLight position={[0, 5, 0]} intensity={15} color="#ffdd88" distance={25} decay={0.5} />

      <Suspense fallback={null}>
        <GLBModel />
      </Suspense>

      <group position={incensePosition} scale={[1.5, 1.5, 1.5]}>
        <IncenseStand position={[0, 0, 0]} />
      </group>

      <group position={flowerPosition} rotation={[0, -0.5, 0]} scale={[0.8, 0.8, 0.8]}>
        <Flower />
      </group>

      <TempleBell position={bellPosition} isRinging={bellRinging} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#16213e" roughness={0.8} emissive="#0f3460" emissiveIntensity={0.2} />
      </mesh>

      <TempleDust count={60} />

      <group ref={cursorRef} position={[0, 0.5, 3]} scale={[0.12, 0.12, 0.12]} rotation={[0, Math.PI, 0]}>
        <AartiPlate />
        <FireParticles position={[0, 0.55, 0.5]} count={80} velocity={cursorVelocity} />
      </group>

      <CoconutController
        position={coconutPosition}
        rotation={[0, getFacingRotationY(coconutPosition, incensePosition), 0]}
        scale={[0.95, 0.95, 0.95]}
      />

      <FlowerSprinkler 
        isActive={flowerActive}
      />

      <Deepam syncSignal={lampSyncSignal} syncedIsOn={lampsOn} />
    </>
  )
}

export default Scene
