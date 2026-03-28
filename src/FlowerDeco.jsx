import { useGLTF } from '@react-three/drei'

function FlowerDeco({ position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] }) {
  const { scene } = useGLTF('/flower_deco.glb')

  return <primitive object={scene.clone()} position={position} scale={scale} rotation={rotation} />
}

useGLTF.preload('/flower_deco.glb')

export default FlowerDeco
