import * as THREE from 'three'

function AartiPlate() {
  return (
    <group>
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.15, 64]} />
        <meshStandardMaterial 
          color="#B8860B" 
          roughness={0.15} 
          metalness={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.15, 0.06, 64]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          roughness={0.15} 
          metalness={0.95} 
        />
      </mesh>

      <mesh position={[0, 0.035, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.02, 64]} />
        <meshStandardMaterial 
          color="#C5A028" 
          roughness={0.2} 
          metalness={0.9} 
        />
      </mesh>

      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.35, 64]} />
        <meshStandardMaterial 
          color="#B8960C" 
          roughness={0.25} 
          metalness={0.85} 
          side={2}
        />
      </mesh>

      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.55, 64]} />
        <meshStandardMaterial 
          color="#B8960C" 
          roughness={0.25} 
          metalness={0.85} 
          side={2}
        />
      </mesh>

      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.75, 64]} />
        <meshStandardMaterial 
          color="#B8960C" 
          roughness={0.25} 
          metalness={0.85} 
          side={2}
        />
      </mesh>

      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 0.95, 64]} />
        <meshStandardMaterial 
          color="#B8960C" 
          roughness={0.25} 
          metalness={0.85} 
          side={2}
        />
      </mesh>

      <mesh position={[0, 0.06, 0.5]}>
        <cylinderGeometry args={[0.12, 0.1, 0.04, 16]} />
        <meshStandardMaterial 
          color="#C0C0C0" 
          roughness={0.2} 
          metalness={0.95} 
        />
      </mesh>

      <mesh position={[0, 0.085, 0.5]}>
        <cylinderGeometry args={[0.08, 0.06, 0.03, 16]} />
        <meshStandardMaterial 
          color="#FFFFF0" 
          roughness={0.3} 
          metalness={0.1}
          emissive="#FFFFFF"
          emissiveIntensity={0.2}
        />
      </mesh>

      <mesh position={[0, 0.105, 0.5]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.1} 
          metalness={0.0}
          emissive="#FFFFCC"
          emissiveIntensity={0.5}
          transparent
          opacity={0.85}
        />
      </mesh>

      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.28, 0.25, 0.15, 32]} />
        <meshStandardMaterial 
          color="#C9A227" 
          roughness={0.2} 
          metalness={0.9} 
        />
      </mesh>

      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.25, 0.28, 0.06, 32]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          roughness={0.15} 
          metalness={0.95} 
        />
      </mesh>

      {[
        [0, 0.19, 0.08],
        [0.08, 0.19, 0],
        [0, 0.19, -0.08],
        [-0.08, 0.19, 0],
        [0.06, 0.19, 0.06],
        [-0.06, 0.19, 0.06],
        [0.06, 0.19, -0.06],
        [-0.06, 0.19, -0.06],
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.025, 0.025, 0.02, 8]} />
          <meshStandardMaterial 
            color="#FFFFF0" 
            roughness={0.6} 
            metalness={0.1} 
          />
        </mesh>
      ))}

      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 0.12, 32]} />
        <meshStandardMaterial 
          color="#C9A227" 
          roughness={0.2} 
          metalness={0.9} 
        />
      </mesh>

      <mesh position={[0, 0.33, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.04, 32]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          roughness={0.15} 
          metalness={0.95} 
        />
      </mesh>

      {[
        [0.04, 0.35, 0.04],
        [-0.04, 0.35, 0.04],
        [0.04, 0.35, -0.04],
        [-0.04, 0.35, -0.04],
        [0, 0.35, 0.05],
        [0, 0.35, -0.05],
        [0.05, 0.35, 0],
        [-0.05, 0.35, 0],
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial 
            color="#FFFFF0" 
            roughness={0.5} 
            emissive="#FFFFFF"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

export default AartiPlate
