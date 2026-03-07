import * as THREE from 'three'

function TempleBell() {
  return (
    <group>
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.8, 8]} />
        <meshStandardMaterial color={0x8B4513} roughness={0.9} />
      </mesh>

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

      <mesh position={[0, 2.22, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={0xD4AF37} roughness={0.3} metalness={0.8} />
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

      <mesh visible={false}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      <pointLight position={[0, 1.9, 0]} color={0xFFD700} intensity={0.3} distance={3} />
    </group>
  )
}

export default TempleBell
