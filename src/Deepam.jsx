import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import { shaderMaterial, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

const FlameMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color('#ff5a1f'),
    uColor2: new THREE.Color('#ffb000'),
    uColor3: new THREE.Color('#fff2a8'),
  },
  `
    varying vec2 vUv;
    varying float vDisplacement;
    uniform float uTime;

    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

    float snoise(vec3 v){
      const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.xxx * 2.0;
      vec3 x3 = x0 - 1.0 + C.xxx * 3.0;
      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 1.0 / 7.0;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }

    void main() {
      vUv = uv;
      vec3 pos = position;
      float noise = snoise(vec3(pos.x * 3.0, pos.y * 2.0 - uTime * 3.0, pos.z * 3.0));
      vDisplacement = noise;
      pos.x += noise * 0.08;
      pos.z += noise * 0.06;
      pos.y *= 1.0 + noise * 0.15;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  `
    varying vec2 vUv;
    varying float vDisplacement;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;

    void main() {
      float height = vUv.y;
      vec3 color = mix(uColor1, uColor2, smoothstep(0.0, 0.5, height));
      color = mix(color, uColor3, smoothstep(0.5, 1.0, height));
      float alpha = smoothstep(0.0, 0.2, height) * smoothstep(1.0, 0.7, height);
      alpha *= 0.9 - vDisplacement * 0.3;
      gl_FragColor = vec4(color, alpha);
    }
  `
)

extend({ FlameMaterial })

function Flame({ isOn, offset = [0, 0.95, 0.05] }) {
  const flameRef = useRef()
  const lightRef = useRef()
  const materialRef = useRef()

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime
    }

    if (flameRef.current && isOn) {
      const time = state.clock.elapsedTime
      flameRef.current.scale.y = 1 + Math.sin(time * 12) * 0.12
      flameRef.current.scale.x = 1 + Math.sin(time * 16) * 0.08
      flameRef.current.rotation.z = Math.sin(time * 5) * 0.08
    }

    if (lightRef.current && isOn) {
      lightRef.current.intensity = 2.8 + Math.sin(state.clock.elapsedTime * 18) * 0.35
    }
  })

  if (!isOn) return null

  return (
    <>
      <group ref={flameRef} position={offset}>
        <mesh>
          <coneGeometry args={[0.08, 0.24, 16, 8]} />
          <flameMaterial
            ref={materialRef}
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh position={[0, 0.015, 0]}>
          <coneGeometry args={[0.035, 0.12, 12]} />
          <meshBasicMaterial color="#fff2c7" transparent opacity={0.95} />
        </mesh>
      </group>

      <pointLight
        ref={lightRef}
        position={[offset[0], offset[1] + 0.08, offset[2] + 0.03]}
        intensity={2.8}
        color="#ffb347"
        distance={5}
        decay={2}
      />
      <pointLight
        position={[offset[0], offset[1] - 0.05, offset[2] + 0.08]}
        intensity={1.3}
        color="#ff7a1a"
        distance={3}
        decay={2}
      />
    </>
  )
}

function LampModel({ scale = [0.42, 0.42, 0.42] }) {
  const { scene } = useGLTF('/lamp.glb')
  const lampRootRef = useRef()
  const lampScene = useMemo(() => {
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
    if (!lampRootRef.current) {
      return
    }

    const bounds = new THREE.Box3().setFromObject(lampRootRef.current)
    const size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())
    const maxAxis = Math.max(size.x, size.y, size.z)

    if (maxAxis > 0) {
      const normalizedScale = 1 / maxAxis
      lampRootRef.current.scale.setScalar(normalizedScale)
      lampRootRef.current.position.set(-center.x * normalizedScale, -bounds.min.y * normalizedScale, -center.z * normalizedScale)
    }
  }, [lampScene])

  return (
    <group scale={scale}>
      <group ref={lampRootRef}>
        <primitive object={lampScene} />
      </group>
    </group>
  )
}

useGLTF.preload('/lamp.glb')

function DeepamInstance({
  position,
  rotation = [0, 0, 0],
  scale = [0.42, 0.42, 0.42],
  flameOffset = [0, 0.52, 0.05],
  defaultOn = false,
  syncSignal = 0,
  syncedIsOn = false,
}) {
  const groupRef = useRef()
  const [isOn, setIsOn] = useState(defaultOn)

  useEffect(() => {
    if (!groupRef.current) {
      return undefined
    }

    const targetScale = isOn ? 1 : 0.94
    const tween = gsap.to(groupRef.current.scale, {
      x: targetScale,
      y: targetScale,
      z: targetScale,
      duration: isOn ? 0.35 : 0.2,
      ease: isOn ? 'back.out(1.4)' : 'power2.out',
    })

    return () => tween.kill()
  }, [isOn])

  useEffect(() => {
    if (syncSignal > 0) {
      setIsOn(syncedIsOn)
    }
  }, [syncSignal, syncedIsOn])

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerDown={(event) => {
        if (event.button !== 0) {
          return
        }
        event.stopPropagation()
        setIsOn((prev) => !prev)
      }}
    >
      <LampModel scale={scale} />
      <Flame isOn={isOn} offset={flameOffset} />
    </group>
  )
}

function DeepamController({ syncSignal = 0, syncedIsOn = false }) {
  return (
    <>
      <DeepamInstance
        position={[-1.5, 1.75, -1.75]}
        rotation={[0, 0.18, 0]}
        scale={[1.2, 1.2, 1.2]}
        syncSignal={syncSignal}
        syncedIsOn={syncedIsOn}
      />
      <DeepamInstance
        position={[1.5, 1.75, -1.75]}
        rotation={[0, -0.18, 0]}
        scale={[1.2, 1.2, 1.2]}
        syncSignal={syncSignal}
        syncedIsOn={syncedIsOn}
      />
    </>
  )
}

export default DeepamController
