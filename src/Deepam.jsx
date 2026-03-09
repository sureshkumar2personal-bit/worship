import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useTexture, shaderMaterial } from '@react-three/drei'

const FlameMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color('#FF4400'),
    uColor2: new THREE.Color('#FFAA00'),
    uColor3: new THREE.Color('#FFFF00'),
  },
  `
    varying vec2 vUv;
    varying float vDisplacement;
    uniform float uTime;
    
    //	Simplex 3D Noise
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

    float snoise(vec3 v){ 
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1. + 3.0 * C.xxx;
      i = mod(i, 289.0 ); 
      vec4 p = permute( permute( permute( 
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 1.0/7.0;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
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

function Flame({ isOn }) {
  const flameRef = useRef()
  const innerRef = useRef()
  const glowRef = useRef()
  const materialRef = useRef()
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime
    }
    
    if (flameRef.current && isOn) {
      const time = state.clock.elapsedTime
      flameRef.current.scale.y = 1 + Math.sin(time * 12) * 0.12
      flameRef.current.scale.x = 1 + Math.sin(time * 15) * 0.08
      flameRef.current.rotation.z = Math.sin(time * 6) * 0.08
    }
    
    if (glowRef.current && isOn) {
      glowRef.current.intensity = 2.5 + Math.sin(state.clock.elapsedTime * 20) * 0.5
    }
  })

  if (!isOn) return null

  return (
    <>
      <group ref={flameRef} position={[0, 0.15, 0]}>
        <mesh ref={materialRef}>
          <coneGeometry args={[0.08, 0.25, 16, 8]} />
          <flameMaterial 
            transparent 
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        <mesh ref={innerRef} position={[0, 0.02, 0]}>
          <coneGeometry args={[0.04, 0.15, 12]} />
          <meshBasicMaterial color="#FFFFAA" transparent opacity={0.95} />
        </mesh>
      </group>
      
      <pointLight 
        ref={glowRef}
        position={[0, 0.35, 0]} 
        intensity={3} 
        color="#FF8800" 
        distance={5} 
        decay={2}
      />
    </>
  )
}

function Deepam({ position, isOn, side }) {
  const groupRef = useRef()
  const deepamTexture = useTexture('/deepam.jpg')

  useEffect(() => {
    if (groupRef.current) {
      if (isOn) {
        gsap.to(groupRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.3,
          ease: "back.out(1.5)"
        })
      } else {
        gsap.to(groupRef.current.scale, {
          x: 0.9,
          y: 0.9,
          z: 0.9,
          duration: 0.2
        })
      }
    }
  }, [isOn])

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} metalness={0.3} />
      </mesh>
      
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.04, 0.015, 8, 16]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} metalness={0.3} />
      </mesh>
      
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.08, 16]} />
        <meshStandardMaterial 
          map={deepamTexture}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.02, 16]} />
        <meshStandardMaterial 
          color={isOn ? "#8B4513" : "#5D3A1A"} 
          roughness={0.4}
          emissive={isOn ? "#FF6600" : "#000000"}
          emissiveIntensity={isOn ? 0.3 : 0}
        />
      </mesh>

      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.06, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.7} />
      </mesh>

      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 8]} />
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </mesh>

      <Flame isOn={isOn} />

      {isOn && (
        <>
          <pointLight 
            position={[0, 0.3, 0.2]} 
            intensity={2} 
            color="#FFAA00" 
            distance={4} 
            decay={2}
          />
          <pointLight 
            position={[0, 0.5, 0]} 
            intensity={1} 
            color="#FF6600" 
            distance={3} 
            decay={2}
          />
        </>
      )}
    </group>
  )
}

function DeepamController({ isOn }) {
  return (
    <>
      <Deepam position={[-1.2, 2.2, -2]} isOn={isOn} side="left" />
      <Deepam position={[1.2, 2.2, -2]} isOn={isOn} side="right" />
    </>
  )
}

export default DeepamController
