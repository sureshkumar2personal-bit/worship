import { useGLTF } from '@react-three/drei'

function Flower() {
  const { scene } = useGLTF('/flower.glb')

  return <primitive object={scene.clone()} scale={[0.8, 0.8, 0.8]} />
}

useGLTF.preload('/flower.glb')

export default Flower
