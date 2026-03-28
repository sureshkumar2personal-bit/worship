import { useGLTF } from '@react-three/drei'

function Peacock({ position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] }) {
  const { scene } = useGLTF('/peacock1.glb')

  return <primitive object={scene.clone()} position={position} scale={scale} rotation={rotation} />
}

useGLTF.preload('/peacock1.glb')

export default Peacock
