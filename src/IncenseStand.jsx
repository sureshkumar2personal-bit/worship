import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function IncenseStand({ position = [-1.5, -2, -1.5] }) {
  const smokeParticlesRef = useRef([])
  const particleCount = 40

  const smokeTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(220, 220, 220, 0.9)')
    gradient.addColorStop(0.3, 'rgba(190, 190, 190, 0.5)')
    gradient.addColorStop(0.6, 'rgba(160, 160, 160, 0.2)')
    gradient.addColorStop(1, 'rgba(140, 140, 140, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 128, 128)
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    smokeParticlesRef.current.forEach((particle, i) => {
      if (particle) {
        particle.position.y += 0.004

        const swirlX = Math.sin(time * 1.2 + i * 0.5) * 0.006
        const swirlZ = Math.cos(time * 1.0 + i * 0.6) * 0.006
        const chaosX = Math.sin(time * 2.5 + i * 0.8) * 0.002
        const chaosZ = Math.cos(time * 2.0 + i * 1.1) * 0.002

        particle.position.x += swirlX + chaosX
        particle.position.z += swirlZ + chaosZ

        const age = particle.position.y - 0.5
        const maxHeight = 2.0
        const life = 1 - age / maxHeight

        const scale = Math.max(0.1, life * 0.8)
        particle.scale.setScalar(scale)

        particle.material.opacity = Math.max(0, life * 0.4)

        if (particle.position.y > 0.5 + maxHeight) {
          particle.position.set(0, 0.5, 0)
          particle.material.opacity = 0.4
        }
      }
    })
  })

  const smokeMaterial = useMemo(() => {
    return new THREE.SpriteMaterial({
      map: smokeTexture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })
  }, [smokeTexture])

  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.1, 32]} />
        <meshStandardMaterial color="#8B4513" roughness={0.6} />
      </mesh>

      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.1, 32]} />
        <meshStandardMaterial color="#A0522D" roughness={0.6} />
      </mesh>

      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.15, 16]} />
        <meshStandardMaterial color="#444444" roughness={0.8} />
      </mesh>

      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.7} />
      </mesh>

      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#ff4400" />
      </mesh>

      <pointLight
        position={[0, 0.5, 0]}
        intensity={0.8}
        color="#ff6600"
        distance={2}
        decay={2}
      />

      {[...Array(particleCount)].map((_, i) => (
        <sprite
          key={i}
          ref={(el) => {
            if (el) {
              smokeParticlesRef.current[i] = el
              el.position.set(
                (Math.random() - 0.5) * 0.05,
                0.5 + (i / particleCount) * 2,
                (Math.random() - 0.5) * 0.05
              )
            }
          }}
          position={[0, 0.5, 0]}
          material={smokeMaterial.clone()}
        />
      ))}
    </group>
  )
}

export default IncenseStand
