import { useRef, Suspense, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import AartiPlate from './AartiPlate'
import FireParticles from './FireParticles'
import IncenseStand from './IncenseStand'
import TempleDust from './TempleDust'

function GLBModel() {
  const { scene } = useGLTF('/sample.glb')
  return <primitive object={scene} position={[0, 0, -2]} scale={[3, 3, 3]} />
}

useGLTF.preload('/sample.glb')

function Scene() {
  const { viewport, scene } = useThree()
  const plateRef = useRef()
  const targetPosition = useRef({ x: 0, y: -0.5 })
  const lastPosition = useRef({ x: 0, y: -0.5 })
  const velocity = useRef({ x: 0, y: 0 })
  const spotLightRef = useRef()
  const spotLightTarget = useMemo(() => {
    const target = new THREE.Object3D()
    target.position.set(0, 0, -2)
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
    
    targetPosition.current.x = mouse.x * (viewport.width / 4)
    targetPosition.current.y = mouse.y * (viewport.height / 4) - 0.5

    if (plateRef.current) {
      const prevX = plateRef.current.position.x
      const prevY = plateRef.current.position.y
      
      plateRef.current.position.x += (targetPosition.current.x - plateRef.current.position.x) * 0.08
      plateRef.current.position.y += (targetPosition.current.y - plateRef.current.position.y) * 0.08
      
      velocity.current.x = plateRef.current.position.x - prevX
      velocity.current.y = plateRef.current.position.y - prevY
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

      <group position={[-1.5, -2, -1.5]} scale={[1.5, 1.5, 1.5]}>
        <IncenseStand position={[0, 0, 0]} />
      </group>

      <group ref={plateRef} position={[0, -0.5, 2]} scale={[0.25, 0.25, 0.25]}>
        <AartiPlate />
        <FireParticles position={[0, 0.55, 0]} count={200} velocity={velocity} />
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#16213e" roughness={0.8} emissive="#0f3460" emissiveIntensity={0.2} />
      </mesh>

      <TempleDust count={60} />
    </>
  )
}

export default Scene
