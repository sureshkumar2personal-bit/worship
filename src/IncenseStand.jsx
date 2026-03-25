import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Incense({ position = [0, 0, 0], smokeEnabled = true }) {
  const smokeGroup1 = useRef()
  const smokeGroup2 = useRef()
  const smokeGroup3 = useRef()
  const particleCount = 20

  const smokeTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 256
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, 64, 256)

    const gradient = ctx.createLinearGradient(32, 0, 32, 256)
    gradient.addColorStop(0, 'rgba(220, 220, 220, 0)')
    gradient.addColorStop(0.2, 'rgba(200, 200, 200, 0.4)')
    gradient.addColorStop(0.4, 'rgba(180, 180, 180, 0.6)')
    gradient.addColorStop(0.6, 'rgba(160, 160, 160, 0.5)')
    gradient.addColorStop(0.8, 'rgba(140, 140, 140, 0.3)')
    gradient.addColorStop(1, 'rgba(120, 120, 120, 0)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.ellipse(32, 128, 28, 120, 0, 0, Math.PI * 2)
    ctx.fill()

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  const godPosition = useMemo(() => new THREE.Vector3(0, 1, -2), [])
  const godRadius = 1.2

  useFrame((state) => {
    if (!smokeEnabled) {
      ;[smokeGroup1.current, smokeGroup2.current, smokeGroup3.current].forEach((group) => {
        if (!group) return
        group.children.forEach((child) => {
          if (child.isSprite) {
            child.material.opacity = 0
          }
        })
      })
      return
    }

    const time = state.clock.elapsedTime

    if (smokeGroup1.current) {
      smokeGroup1.current.children.forEach((child, i) => {
        if (child.isSprite) {
          const cycleTime = (time * 0.3 + i * 0.15) % (particleCount * 0.15)
          const progress = cycleTime / (particleCount * 0.15)
          
          const twistAngle = progress * Math.PI * 4
          const twistRadius = progress * 0.08
          
          let y = 0.26 + progress * 1.25
          let x = Math.sin(twistAngle) * twistRadius
          let z = Math.cos(twistAngle) * twistRadius
          
          const worldPos = new THREE.Vector3(
            position[0] + x,
            position[1] + y,
            position[2] + z
          )
          
          const distToGod = worldPos.distanceTo(godPosition)
          let opacity = Math.max(0, 0.6 - progress * 0.55)
          
          if (distToGod < godRadius) {
            const splitFactor = 1 - (distToGod / godRadius)
            opacity *= splitFactor * 0.3
            
            const splitAngle = Math.atan2(z, x) + Math.PI
            x += Math.cos(splitAngle) * splitFactor * 0.15
            z += Math.sin(splitAngle) * splitFactor * 0.15
          }
          
          child.position.y = y
          child.position.x = x
          child.position.z = z
          
          child.scale.set(0.02 + progress * 0.03, 0.075 + progress * 0.075, 1)
          child.material.opacity = opacity
          
          child.rotation.z = twistAngle * 0.5
        }
      })
    }
    if (smokeGroup2.current) {
      smokeGroup2.current.children.forEach((child, i) => {
        if (child.isSprite) {
          const cycleTime = (time * 0.3 + i * 0.15 + 0.5) % (particleCount * 0.15)
          const progress = cycleTime / (particleCount * 0.15)
          
          const twistAngle = progress * Math.PI * 4 + Math.PI * 0.66
          const twistRadius = progress * 0.08
          
          let y = 0.26 + progress * 1.25
          let x = Math.sin(twistAngle) * twistRadius
          let z = Math.cos(twistAngle) * twistRadius
          
          const worldPos = new THREE.Vector3(
            position[0] + x,
            position[1] + y,
            position[2] + z
          )
          
          const distToGod = worldPos.distanceTo(godPosition)
          let opacity = Math.max(0, 0.6 - progress * 0.55)
          
          if (distToGod < godRadius) {
            const splitFactor = 1 - (distToGod / godRadius)
            opacity *= splitFactor * 0.3
            
            const splitAngle = Math.atan2(z, x) + Math.PI
            x += Math.cos(splitAngle) * splitFactor * 0.15
            z += Math.sin(splitAngle) * splitFactor * 0.15
          }
          
          child.position.y = y
          child.position.x = x
          child.position.z = z
          
          child.scale.set(0.02 + progress * 0.03, 0.075 + progress * 0.075, 1)
          child.material.opacity = opacity
          
          child.rotation.z = twistAngle * 0.5
        }
      })
    }
    if (smokeGroup3.current) {
      smokeGroup3.current.children.forEach((child, i) => {
        if (child.isSprite) {
          const cycleTime = (time * 0.3 + i * 0.15 + 1) % (particleCount * 0.15)
          const progress = cycleTime / (particleCount * 0.15)
          
          const twistAngle = progress * Math.PI * 4 + Math.PI * 1.33
          const twistRadius = progress * 0.08
          
          let y = 0.26 + progress * 1.25
          let x = Math.sin(twistAngle) * twistRadius
          let z = Math.cos(twistAngle) * twistRadius
          
          const worldPos = new THREE.Vector3(
            position[0] + x,
            position[1] + y,
            position[2] + z
          )
          
          const distToGod = worldPos.distanceTo(godPosition)
          let opacity = Math.max(0, 0.6 - progress * 0.55)
          
          if (distToGod < godRadius) {
            const splitFactor = 1 - (distToGod / godRadius)
            opacity *= splitFactor * 0.3
            
            const splitAngle = Math.atan2(z, x) + Math.PI
            x += Math.cos(splitAngle) * splitFactor * 0.15
            z += Math.sin(splitAngle) * splitFactor * 0.15
          }
          
          child.position.y = y
          child.position.x = x
          child.position.z = z
          
          child.scale.set(0.02 + progress * 0.03, 0.075 + progress * 0.075, 1)
          child.material.opacity = opacity
          
          child.rotation.z = twistAngle * 0.5
        }
      })
    }
  })

  return (
    <group position={position}>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.04, 0.045, 0.08, 8]} />
        <meshStandardMaterial color="#D2B48C" roughness={0.7} />
      </mesh>

      <group position={[0, 0.08, 0]} rotation={[0.2, 0, 0.2]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.006, 0.0075, 0.24, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.003, 6, 6]} />
          <meshBasicMaterial color="#FF4500" />
        </mesh>
        <group ref={smokeGroup1}>
          {[...Array(particleCount)].map((_, i) => (
            <sprite
              key={i}
              position={[0, 0.26 + i * 0.05, 0]}
              scale={[0.02, 0.075, 1]}
            >
              <spriteMaterial
                map={smokeTexture}
                transparent
                opacity={smokeEnabled ? 0.6 - (i / particleCount) * 0.5 : 0}
                depthWrite={false}
                blending={THREE.NormalBlending}
              />
            </sprite>
          ))}
        </group>
      </group>

      <group position={[0, 0.08, 0]} rotation={[0.2, 0, -0.2]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.006, 0.0075, 0.24, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.003, 6, 6]} />
          <meshBasicMaterial color="#FF4500" />
        </mesh>
        <group ref={smokeGroup2}>
          {[...Array(particleCount)].map((_, i) => (
            <sprite
              key={i}
              position={[0, 0.26 + i * 0.05, 0]}
              scale={[0.02, 0.075, 1]}
            >
              <spriteMaterial
                map={smokeTexture}
                transparent
                opacity={smokeEnabled ? 0.6 - (i / particleCount) * 0.5 : 0}
                depthWrite={false}
                blending={THREE.NormalBlending}
              />
            </sprite>
          ))}
        </group>
      </group>

      <group position={[0, 0.08, 0]} rotation={[-0.2, 0, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.006, 0.0075, 0.24, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.003, 6, 6]} />
          <meshBasicMaterial color="#FF4500" />
        </mesh>
        <group ref={smokeGroup3}>
          {[...Array(particleCount)].map((_, i) => (
            <sprite
              key={i}
              position={[0, 0.26 + i * 0.05, 0]}
              scale={[0.02, 0.075, 1]}
            >
              <spriteMaterial
                map={smokeTexture}
                transparent
                opacity={smokeEnabled ? 0.6 - (i / particleCount) * 0.5 : 0}
                depthWrite={false}
                blending={THREE.NormalBlending}
              />
            </sprite>
          ))}
        </group>
      </group>
    </group>
  )
}

export default Incense
