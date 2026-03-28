import { useGLTF } from '@react-three/drei'

function Food({ position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] }) {
  const { scene } = useGLTF('/food.glb')

  return <primitive object={scene.clone()} position={position} scale={scale} rotation={rotation} />
}

useGLTF.preload('/food.glb')

export default Food
