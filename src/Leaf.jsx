import { useGLTF } from '@react-three/drei'

function Leaf({ position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] }) {
  const { scene } = useGLTF('/leaf.glb')

  return <primitive object={scene.clone()} position={position} scale={scale} rotation={rotation} />
}

useGLTF.preload('/leaf.glb')

export default Leaf
