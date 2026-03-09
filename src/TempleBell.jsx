import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
<<<<<<< HEAD
import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

function TempleBell() {
  const groupRef = useRef()
  const [ringing, setRinging] = useState(false)
  const ringTimeRef = useRef(0)
  const lastRingTime = useRef(0)

  const bellClangSound = useMemo(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    return audioContext
  }, [])

  const playBellSound = () => {
    try {
      const ctx = bellClangSound
      if (ctx.state === 'suspended') ctx.resume()
      
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.setValueAtTime(800, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3)
      
      gainNode.gain.setValueAtTime(0.4, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.5)
    } catch (e) {
      console.log('Audio not available')
    }
  }

  useFrame((state, delta) => {
    if (ringing && groupRef.current) {
      const elapsed = state.clock.getElapsedTime()
      const swingAngle = Math.sin((elapsed - lastRingTime.current) * 15) * 0.3
      groupRef.current.rotation.z = swingAngle
      
      if (elapsed - lastRingTime.current > 1.5) {
        setRinging(false)
        groupRef.current.rotation.z = 0
      }
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    const now = Date.now()
    if (!ringing || now - lastRingTime.current > 1500) {
      lastRingTime.current = Date.now() / 1000
      setRinging(true)
      playBellSound()
    }
  }

  return (
    <group onClick={handleClick}>
      <group ref={groupRef}>
        <mesh position={[0, 1.95, 0]}>
          <coneGeometry args={[0.25, 0.5, 32]} />
          <meshStandardMaterial color={0xD4AF37} roughness={0.3} metalness={0.8} />
        </mesh>

        <mesh position={[0, 1.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25, 0.03, 16, 32]} />
          <meshStandardMaterial color={0xFFD700} roughness={0.2} metalness={0.9} />
        </mesh>

        <mesh position={[0, 1.65, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color={0xB8860B} roughness={0.4} metalness={0.7} />
        </mesh>

        {[0, 1, 2].map((i) => {
          const angle = (i / 3) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.2, 1.75, Math.sin(angle) * 0.2]}>
              <coneGeometry args={[0.04, 0.08, 8]} />
              <meshStandardMaterial color={0xFFD700} roughness={0.2} metalness={0.9} />
            </mesh>
          )
        })}
      </group>

      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.8, 8]} />
        <meshStandardMaterial color={0x8B4513} roughness={0.9} />
      </mesh>

      <mesh position={[0, 2.22, 0]}>
=======
import gsap from 'gsap'

function TempleBell({ isRinging }) {
  const bellRef = useRef()
  const clapperRef = useRef()
  const lightRef = useRef()
  const ringIntervalRef = useRef(null)
  
  useEffect(() => {
    if (isRinging && bellRef.current) {
      const ring = () => {
        gsap.to(bellRef.current.rotation, {
          z: 0.35,
          duration: 0.12,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(bellRef.current.rotation, {
              z: -0.35,
              duration: 0.2,
              ease: "power2.in",
              onComplete: () => {
                gsap.to(bellRef.current.rotation, {
                  z: 0.2,
                  duration: 0.15,
                  ease: "power2.out",
                  onComplete: () => {
                    gsap.to(bellRef.current.rotation, {
                      z: 0,
                      duration: 0.3,
                      ease: "elastic.out(1, 0.5)"
                    })
                  }
                })
              }
            })
          }
        })
        
        gsap.to(clapperRef.current.position, {
          x: 0.06,
          duration: 0.08,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(clapperRef.current.position, {
              x: 0,
              duration: 0.25,
              ease: "elastic.out(1, 0.5)"
            })
          }
        })
        
        if (lightRef.current) {
          gsap.to(lightRef.current, {
            intensity: 2,
            duration: 0.05,
            onComplete: () => {
              gsap.to(lightRef.current, {
                intensity: 0.3,
                duration: 0.2
              })
            }
          })
        }
      }
      
      ring()
      ringIntervalRef.current = setInterval(ring, 400)
    } else if (!isRinging && bellRef.current) {
      if (ringIntervalRef.current) {
        clearInterval(ringIntervalRef.current)
        ringIntervalRef.current = null
      }
      gsap.to(bellRef.current.rotation, {
        z: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)"
      })
    }
    
    return () => {
      if (ringIntervalRef.current) {
        clearInterval(ringIntervalRef.current)
      }
    }
  }, [isRinging])

  useFrame((state) => {
    if (!isRinging && bellRef.current) {
      bellRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    }
  })

  return (
    <group ref={bellRef} position={[0, 1.9, 0]}>
      <mesh>
        <coneGeometry args={[0.25, 0.5, 32]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.8} />
      </mesh>

      <mesh position={[0, -0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.25, 0.03, 16, 32]} />
        <meshStandardMaterial color="#FFD700" roughness={0.2} metalness={0.9} />
      </mesh>

      <mesh ref={clapperRef} position={[0, -0.35, 0]}>
>>>>>>> origin/main
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#B8860B" roughness={0.4} metalness={0.7} />
      </mesh>

<<<<<<< HEAD
      <mesh visible={false}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial visible={false} />
=======
      {[0, 1, 2].map((i) => {
        const angle = (i / 3) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.2, 0.05, Math.sin(angle) * 0.2]}>
            <coneGeometry args={[0.04, 0.08, 8]} />
            <meshStandardMaterial color="#FFD700" roughness={0.2} metalness={0.9} />
          </mesh>
        )
      })}

      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
>>>>>>> origin/main
      </mesh>

      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.8} />
      </mesh>

      <pointLight 
        ref={lightRef}
        position={[0, 0, 0.2]} 
        color="#FFD700" 
        intensity={0.3} 
        distance={3} 
        decay={2}
      />
    </group>
  )
}

export default TempleBell
