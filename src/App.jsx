import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Scene from './Scene'

function App() {
  return (
    <Canvas
      camera={{ position: [0, 1, 5], fov: 60 }}
      style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)' }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}

export default App
