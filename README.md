# Hindu Temple Worship 3D Experience

A WebGL-based 3D interactive worship scene featuring a Hindu deity, incense stand, and a camphor plate cursor with realistic fire effects.

---

## Non-Technical Overview

### What is this project?

This is an interactive 3D web application that recreates a Hindu temple worship atmosphere. Users can move their mouse to control a camphor plate (kapoor patra) with a burning flame that follows the cursor.

### Features

- **3D Hindu Deity**: A temple god model rendered in the scene
- **Interactive Cursor**: A camphor plate with animated fire that follows your mouse movement
- **Realistic Fire**: Particle-based flame with smoke effects and flickering light
- **Incense Stand**: Decorative incense holder with aromatic smoke
- **Temple Atmosphere**: Ambient lighting, fog, and floating dust particles
- **Smooth Animations**: Fire responds to cursor movement with wind effects

### How to Use

1. Open the application in a web browser
2. Move your mouse to control the camphor plate cursor
3. The fire flame will sway based on your movement speed
4. Enjoy the immersive temple worship experience

---

## Technical Documentation

### Technology Stack

- **React** - UI framework
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **Vite** - Build tool and dev server

### Project Structure

```
src/
├── App.jsx              # Main app with Canvas setup
├── Scene.jsx           # Main 3D scene composition
├── AartiPlate.jsx      # Camphor plate 3D model
├── FireParticles.jsx   # Fire and smoke particle system
├── IncenseStand.jsx    # Incense stand component
├── TempleDust.jsx      # Floating dust particles
├── Flame.jsx           # Flame component
├── ColoredStatue.jsx   # Colored statue component
├── Lightning.jsx       # Lightning effect component
├── index.css           # Global styles
└── main.jsx            # Entry point
```

### Key Components

#### Scene.jsx
Main scene orchestrator that:
- Sets up lighting (ambient, point, spot lights)
- Manages cursor position with smooth interpolation
- Renders the GLB model (Hindu deity)
- Controls the camphor plate cursor with fire

#### FireParticles.jsx
Particle system for realistic fire:
- Uses `THREE.Points` with custom geometry
- Animated particles that rise and reset
- Wind effect based on cursor velocity
- Flickering point lights for glow effect
- Smoke particles with transparency

#### AartiPlate.jsx
3D model of the camphor plate:
- Silver/brass plate geometry using `cylinderGeometry`
- Decorative rings using `ringGeometry`
- Glowing camphor using `sphereGeometry` with emissive material

### Technical Implementation Details

#### Cursor Movement
```javascript
// Smooth cursor following with easing
cursorRef.current.position.x += (target.x - cursorRef.current.position.x) * 0.12
cursorRef.current.position.y += (target.y - cursorRef.current.position.y) * 0.12
```

#### Fire Particle Animation
- Particles rise upward with varying speeds
- Wind force applied based on cursor velocity
- Particles reset to base position when reaching max height
- Uses `AdditiveBlending` for glow effect

#### Lighting Setup
- Ambient lights for base illumination
- Spot lights with shadows for dramatic effect
- Point lights for fire glow with flicker animation

### Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Browser Support

Works on modern browsers with WebGL support:
- Chrome/Edge (recommended)
- Firefox
- Safari

---

## Credits

- 3D Model: sample.glb (Hindu deity)
- Built with React Three Fiber ecosystem
