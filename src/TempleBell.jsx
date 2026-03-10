import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

function BellModel({ scale = [0.6, 0.6, 0.6] }) {
  const { scene } = useGLTF('/bell.glb')
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

useGLTF.preload('/bell.glb')

function TempleBell({ isRinging, position = [0, 0, 0] }) {
  const bellRef = useRef()
  const lightRef = useRef()
  const ringIntervalRef = useRef(null)

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

  useFrame((state) => {
    if (!isRinging && bellRef.current) {
      bellRef.current.rotation.z = -Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    }
  })

  return (
    <group ref={bellRef} position={position}>
      <BellModel scale={[0.58, 0.58, 0.58]} />
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
