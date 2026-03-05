import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function FireParticles({ position = [0, 0, 0], count = 100, velocity = { current: { x: 0, y: 0 } } }) {
  const fireRef = useRef()
  const smokeRef = useRef()
  const lightRef = useRef()

  const fireGeo = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = []
    const sizes = []
    const speeds = []
    const offsets = []

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 0.06
      positions.push(Math.cos(angle) * radius, Math.random() * 0.1, Math.sin(angle) * radius)
      sizes.push(0.03 + Math.random() * 0.05)
      speeds.push(0.5 + Math.random() * 0.5)
      offsets.push(Math.random() * Math.PI * 2)
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))
    geometry.setAttribute('speed', new THREE.Float32BufferAttribute(speeds, 1))
    geometry.setAttribute('offset', new THREE.Float32BufferAttribute(offsets, 1))

    return geometry
  }, [count])

  const smokeGeo = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = []
    const sizes = []
    const speeds = []
    const offsets = []
    const smokeCount = Math.floor(count * 0.4)

    for (let i = 0; i < smokeCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 0.08
      positions.push(Math.cos(angle) * radius, Math.random() * 0.2, Math.sin(angle) * radius)
      sizes.push(0.05 + Math.random() * 0.08)
      speeds.push(0.2 + Math.random() * 0.3)
      offsets.push(Math.random() * Math.PI * 2)
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))
    geometry.setAttribute('speed', new THREE.Float32BufferAttribute(speeds, 1))
    geometry.setAttribute('offset', new THREE.Float32BufferAttribute(offsets, 1))

    return geometry
  }, [count])

  const fireMaterial = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')

    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(255, 255, 200, 1)')
    gradient.addColorStop(0.2, 'rgba(255, 200, 50, 1)')
    gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.8)')
    gradient.addColorStop(1, 'rgba(255, 50, 0, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)

    const texture = new THREE.CanvasTexture(canvas)

    return new THREE.PointsMaterial({
      size: 0.15,
      map: texture,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: false,
      color: new THREE.Color(1, 0.6, 0.1)
    })
  }, [])

  const smokeMaterial = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')

    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(100, 100, 100, 0.3)')
    gradient.addColorStop(0.5, 'rgba(80, 80, 80, 0.2)')
    gradient.addColorStop(1, 'rgba(50, 50, 50, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)

    const texture = new THREE.CanvasTexture(canvas)

    return new THREE.PointsMaterial({
      size: 0.2,
      map: texture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      blending: THREE.NormalBlending,
      color: new THREE.Color(0.3, 0.3, 0.35)
    })
  }, [])

  const basePositions = useMemo(() => {
    const positions = []
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 0.06
      positions.push(Math.cos(angle) * radius, Math.random() * 0.1, Math.sin(angle) * radius)
    }
    return positions
  }, [count])

  const smokeBasePositions = useMemo(() => {
    const positions = []
    const smokeCount = Math.floor(count * 0.4)
    for (let i = 0; i < smokeCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 0.08
      positions.push(Math.cos(angle) * radius, Math.random() * 0.2, Math.sin(angle) * radius)
    }
    return positions
  }, [count])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const velX = velocity.current.x
    const velY = velocity.current.y
    const windX = -velX * 3
    const windZ = 0

    if (fireRef.current) {
      const positions = fireRef.current.geometry.attributes.position.array
      const speeds = fireRef.current.geometry.attributes.speed.array
      const offsets = fireRef.current.geometry.attributes.offset.array

      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const speed = speeds[i]
        const offset = offsets[i]

        let y = positions[i3 + 1]
        y += speed * 0.02

        if (y > 0.8) {
          y = 0
          const angle = Math.random() * Math.PI * 2
          const radius = Math.random() * 0.06
          basePositions[i3] = Math.cos(angle) * radius
          basePositions[i3 + 2] = Math.sin(angle) * radius
        }

        const heightFactor = Math.min(y * 2, 1)
        const baseX = basePositions[i3]
        const baseZ = basePositions[i3 + 2]

        positions[i3 + 1] = y
        positions[i3] = baseX + windX * heightFactor + Math.sin(time * 3 + offset) * 0.002
        positions[i3 + 2] = baseZ + windZ * heightFactor + Math.cos(time * 2.5 + offset) * 0.002
      }

      fireRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (smokeRef.current) {
      const smokeCount = Math.floor(count * 0.4)
      const positions = smokeRef.current.geometry.attributes.position.array
      const speeds = smokeRef.current.geometry.attributes.speed.array

      for (let i = 0; i < smokeCount; i++) {
        const i3 = i * 3
        const speed = speeds[i]

        let y = positions[i3 + 1]
        y += speed * 0.015

        if (y > 1.5) {
          y = 0.1
          const angle = Math.random() * Math.PI * 2
          const radius = Math.random() * 0.08
          smokeBasePositions[i3] = Math.cos(angle) * radius
          smokeBasePositions[i3 + 2] = Math.sin(angle) * radius
        }

        const heightFactor = Math.min(y * 1.5, 1)
        const baseX = smokeBasePositions[i3]
        const baseZ = smokeBasePositions[i3 + 2]

        positions[i3 + 1] = y
        positions[i3] = baseX + windX * heightFactor * 1.5 + (Math.random() - 0.5) * 0.005
        positions[i3 + 2] = baseZ + windZ * heightFactor * 1.5 + (Math.random() - 0.5) * 0.005
      }

      smokeRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (lightRef.current) {
      const flicker = 2 + Math.sin(time * 15) * 0.6 + Math.sin(time * 25) * 0.3
      lightRef.current.intensity = flicker
    }
  })

  return (
    <group position={position}>
      <points ref={smokeRef} geometry={smokeGeo} material={smokeMaterial} />
      <points ref={fireRef} geometry={fireGeo} material={fireMaterial} />

      <pointLight
        ref={lightRef}
        position={[0, 0.3, 0]}
        intensity={2}
        color="#ff6600"
        distance={4}
        decay={2}
      />

      <pointLight
        position={[0, 0.2, 0]}
        intensity={1.5}
        color="#ffaa55"
        distance={3}
        decay={2}
      />
    </group>
  )
}

export default FireParticles
