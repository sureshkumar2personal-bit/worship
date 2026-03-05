function ColoredStatue() {
  return (
    <group position={[0, -0.5, -3]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 1, 0.4, 32]} />
        <meshStandardMaterial color="#4a0080" roughness={0.4} metalness={0.3} />
      </mesh>

      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.6, 32]} />
        <meshStandardMaterial color="#ff0066" roughness={0.3} metalness={0.2} />
      </mesh>

      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.45, 0.5, 0.5, 32]} />
        <meshStandardMaterial color="#00ccff" roughness={0.3} metalness={0.4} />
      </mesh>

      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#ffcc00" roughness={0.2} metalness={0.5} />
      </mesh>

      <mesh position={[0, 1.9, 0]}>
        <coneGeometry args={[0.3, 0.5, 32]} />
        <meshStandardMaterial color="#ff6600" roughness={0.3} />
      </mesh>

      <mesh position={[0, 2.3, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#00ff66" emissive="#00ff66" emissiveIntensity={0.5} />
      </mesh>

      <mesh position={[-0.5, 1.1, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.12, 0.15, 0.8, 16]} />
        <meshStandardMaterial color="#ff9900" roughness={0.3} />
      </mesh>

      <mesh position={[0.5, 1.1, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.12, 0.15, 0.8, 16]} />
        <meshStandardMaterial color="#ff9900" roughness={0.3} />
      </mesh>

      <mesh position={[-0.9, 0.6, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#00ffcc" roughness={0.2} metalness={0.3} />
      </mesh>

      <mesh position={[0.9, 0.6, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#00ffcc" roughness={0.2} metalness={0.3} />
      </mesh>

      <mesh position={[0, 0.1, 0.5]}>
        <boxGeometry args={[0.4, 0.6, 0.15]} />
        <meshStandardMaterial color="#ff3366" roughness={0.3} />
      </mesh>

      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[(i - 2) * 0.12, 0.5, 0.58]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.3} />
        </mesh>
      ))}

      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 0.2, 32]} />
        <meshStandardMaterial color="#6600cc" roughness={0.3} metalness={0.4} />
      </mesh>
    </group>
  )
}

export default ColoredStatue
