import { useGLTF } from '@react-three/drei'

function Poo({ position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] }) {
  const { scene } = useGLTF('/poo.glb')

  return <primitive object={scene.clone()} position={position} scale={scale} rotation={rotation} />
}

useGLTF.preload('/poo.glb')

export default Poo
