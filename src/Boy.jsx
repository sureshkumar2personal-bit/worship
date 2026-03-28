import { useGLTF } from '@react-three/drei'

function Boy({ position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] }) {
  const { scene } = useGLTF('/boy1.glb')

  return <primitive object={scene.clone()} position={position} scale={scale} rotation={rotation} />
}

useGLTF.preload('/boy1.glb')

export default Boy
