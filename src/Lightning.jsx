import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Lightning({ position = [0, 0, 0] }) {
  const boltRef = useRef()
  const glowRef = useRef()
  const lightRef = useRef()
  const sparkRefs = useRef([])

  const lightningMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#00ffff'),
      transparent: true,
      opacity: 0.9,
    })
  }, [])

  const coreMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#ffffff'),
      transparent: true,
      opacity: 1,
    })
  }, [])

  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#0088ff'),
      transparent: true,
      opacity: 0.4,
    })
  }, [])

  const generateBoltPath = () => {
    const points = []
    const segments = 8
    for (let i = 0; i <= segments; i++) {
      const y = (i / segments) * 0.6 - 0.3
      const x = (Math.random() - 0.5) * 0.15
      const z = (Math.random() - 0.5) * 0.15
      points.push(new THREE.Vector3(x, y, z))
    }
    return points
  }

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    const isFlashing = Math.random() > 0.85

    if (lightRef.current) {
      if (isFlashing) {
        lightRef.current.intensity = 3 + Math.random() * 4
        lightRef.current.color.setHex(Math.random() > 0.5 ? 0x00ffff : 0xaaddff)
      } else {
        lightRef.current.intensity = 0.5 + Math.sin(time * 20) * 0.3
      }
    }

    if (boltRef.current) {
      boltRef.current.visible = isFlashing
      boltRef.current.rotation.z = (Math.random() - 0.5) * 0.3
      boltRef.current.scale.set(
        0.8 + Math.random() * 0.4,
        1 + Math.random() * 0.3,
        0.8 + Math.random() * 0.4
      )
    }

    if (glowRef.current) {
      const pulse = isFlashing ? 1.5 + Math.random() : 1 + Math.sin(time * 15) * 0.2
      glowRef.current.scale.set(pulse, pulse * 1.2, pulse)
      glowRef.current.material.opacity = isFlashing ? 0.6 : 0.2
    }

    sparkRefs.current.forEach((spark, i) => {
      if (spark) {
        spark.visible = isFlashing && Math.random() > 0.3
        spark.position.x = (Math.random() - 0.5) * 0.4
        spark.position.y = Math.random() * 0.4
        spark.position.z = (Math.random() - 0.5) * 0.4
      }
    })
  })

  const boltPoints = useMemo(() => generateBoltPath(), [])
  const boltGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(boltPoints)
    return new THREE.TubeGeometry(curve, 8, 0.03, 6, false)
  }, [boltPoints])

  return (
    <group position={position}>
      <pointLight
        ref={lightRef}
        position={[0, 0, 0]}
        intensity={2}
        color="#00ffff"
        distance={5}
        decay={2}
      />

      <mesh ref={glowRef}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <primitive object={glowMaterial} />
      </mesh>

      <mesh ref={boltRef} geometry={boltGeometry}>
        <primitive object={lightningMaterial} />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
        <primitive object={coreMaterial} />
      </mesh>

      {[...Array(6)].map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (sparkRefs.current[i] = el)}
          position={[(Math.random() - 0.5) * 0.3, Math.random() * 0.3, (Math.random() - 0.5) * 0.3]}
        >
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  )
}

export default Lightning
