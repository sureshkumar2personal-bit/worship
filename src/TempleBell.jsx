import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

function BellModel({ scale = [0.6, 0.6, 0.6] }) {
  const { scene } = useGLTF('/bell2.glb')
  const bellRootRef = useRef()
  const bellScene = useMemo(() => {
    const cloned = scene.clone()
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    return cloned
  }, [scene])

  useLayoutEffect(() => {
    if (!bellRootRef.current) {
      return
    }

    const bounds = new THREE.Box3().setFromObject(bellRootRef.current)
    const size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())
    const maxAxis = Math.max(size.x, size.y, size.z)

    if (maxAxis > 0) {
      const normalizedScale = 1 / maxAxis
      bellRootRef.current.scale.setScalar(normalizedScale)
      bellRootRef.current.position.set(
        -center.x * normalizedScale,
        -bounds.max.y * normalizedScale,
        -center.z * normalizedScale
      )
    }
  }, [bellScene])

  return (
    <group scale={scale}>
      <group ref={bellRootRef}>
        <primitive object={bellScene} />
      </group>
    </group>
  )
}

function NipModel() {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.26, 24]} />
        <meshStandardMaterial color="#8a5a2b" metalness={0.65} roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.4, 0]}>
        <sphereGeometry args={[0.072, 24, 24]} />
        <meshStandardMaterial color="#b87432" metalness={0.55} roughness={0.35} />
      </mesh>
    </group>
  )
}

useGLTF.preload('/bell2.glb')

function TempleBell({ isRinging, shakeBell = false, position = [0, 0, 0] }) {
  const bellRef = useRef()
  const lightRef = useRef()
  const ringIntervalRef = useRef(null)
  const bellShakeTlRef = useRef(null)

  useEffect(() => {
    if (isRinging && bellRef.current) {
      const ring = () => {
        gsap.to(bellRef.current.rotation, {
          z: -0.35,
          duration: 0.12,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(bellRef.current.rotation, {
              z: 0.35,
              duration: 0.2,
              ease: 'power2.in',
              onComplete: () => {
                gsap.to(bellRef.current.rotation, {
                  z: -0.2,
                  duration: 0.15,
                  ease: 'power2.out',
                  onComplete: () => {
                    gsap.to(bellRef.current.rotation, {
                      z: 0,
                      duration: 0.3,
                      ease: 'elastic.out(1, 0.5)',
                    })
                  },
                })
              },
            })
          },
        })

        if (lightRef.current) {
          gsap.to(lightRef.current, {
            intensity: 2,
            duration: 0.05,
            onComplete: () => {
              gsap.to(lightRef.current, {
                intensity: 0.3,
                duration: 0.2,
              })
            },
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
        ease: 'elastic.out(1, 0.5)',
      })
    }

    return () => {
      if (ringIntervalRef.current) {
        clearInterval(ringIntervalRef.current)
      }
    }
  }, [isRinging])

  useEffect(() => {
    if (!bellRef.current) {
      return
    }

    if (bellShakeTlRef.current) {
      bellShakeTlRef.current.kill()
      bellShakeTlRef.current = null
    }
    gsap.killTweensOf(bellRef.current.position)

    if (shakeBell) {
      bellRef.current.position.x = position[0] - 0.08
      bellShakeTlRef.current = gsap.timeline({ repeat: -1, yoyo: true })
      bellShakeTlRef.current.to(bellRef.current.position, {
        x: position[0] + 0.08,
        duration: 0.45,
        ease: 'sine.inOut',
      })
      return
    }

    gsap.to(bellRef.current.position, {
      x: position[0],
      y: position[1],
      z: position[2],
      duration: 0.25,
      ease: 'power2.out',
    })
  }, [position, shakeBell])

  return (
    <group ref={bellRef} position={position}>
      <group position={[0, 0, -0.08]}>
        <BellModel scale={[0.9, 0.9, 0.9]} />
      </group>
      <pointLight
        ref={lightRef}
        position={[0, -0.2, 0.2]}
        color="#ffd166"
        intensity={0.3}
        distance={3}
        decay={2}
      />
    </group>
  )
}

export default TempleBell
