import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function TempleDust({ count = 60 }) {
  const dustRef = useRef()

  const dustGeo = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = []
    const sizes = []
    const speeds = []
    const phases = []

    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 10,
        Math.random() * 6 - 1,
        (Math.random() - 0.5) * 8 - 2
      )
      sizes.push(0.02 + Math.random() * 0.04)
      speeds.push(0.1 + Math.random() * 0.2)
      phases.push(Math.random() * Math.PI * 2)
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))
    geometry.setAttribute('speed', new THREE.Float32BufferAttribute(speeds, 1))
    geometry.setAttribute('phase', new THREE.Float32BufferAttribute(phases, 1))

    return geometry
  }, [count])

  const dustMaterial = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(255, 255, 220, 0.8)')
    gradient.addColorStop(0.5, 'rgba(255, 240, 200, 0.3)')
    gradient.addColorStop(1, 'rgba(255, 220, 180, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)
    const texture = new THREE.CanvasTexture(canvas)

    return new THREE.PointsMaterial({
      size: 0.08,
      map: texture,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: new THREE.Color(1, 0.95, 0.8)
    })
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (dustRef.current) {
      const positions = dustRef.current.geometry.attributes.position.array
      const speeds = dustRef.current.geometry.attributes.speed.array
      const phases = dustRef.current.geometry.attributes.phase.array

      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const speed = speeds[i]
        const phase = phases[i]

        positions[i3 + 1] += Math.sin(time * 0.3 + phase) * 0.002
        positions[i3] += Math.cos(time * 0.2 + phase) * 0.001
        positions[i3 + 2] += Math.sin(time * 0.25 + phase) * 0.001
      }

      dustRef.current.geometry.attributes.position.needsUpdate = true
      dustRef.current.material.opacity = 0.3 + Math.sin(time * 0.5) * 0.1
    }
  })

  return <points ref={dustRef} geometry={dustGeo} material={dustMaterial} />
}

export default TempleDust
