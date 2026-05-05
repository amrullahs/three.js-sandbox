import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const DATA = [
  { id: 1, title: 'Artistas en movimiento', color: '#222', text: 'A study in clarity, rhythm, and space. Focused on simplifying the complex.', img: 'https://picsum.photos/400/300?random=1' },
  { id: 2, title: 'Project Beta', color: '#1a1a1a', text: 'Experimental exploration of 3D forms and digital interaction.', img: 'https://picsum.photos/400/300?random=2' },
  { id: 3, title: 'Project Gamma', color: '#111', text: 'Architectural visualization of futuristic urban spaces.', img: 'https://picsum.photos/400/300?random=3' },
  { id: 4, title: 'Project Delta', color: '#0a0a0a', text: 'Minimalist approach to high-end brand identity.', img: 'https://picsum.photos/400/300?random=4' },
  { id: 5, title: 'Project Epsilon', color: '#000', text: 'Dynamic motion graphics for digital storytelling.', img: 'https://picsum.photos/400/300?random=5' },
];

const AccordionItem = ({ index, data, activeIndex, setActiveIndex }) => {
  const meshRef = useRef();
  const contentRef = useRef();
  const isActive = activeIndex === index;

  useFrame(() => {
    // target height based on Spline example: expanded vs collapsed
    const targetHeight = isActive ? 3.5 : 0.8;
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetHeight, 0.1);
    
    // Calculate dynamic Y position to push items down
    let currentYOffset = 0;
    for (let i = 0; i < index; i++) {
      currentYOffset += (activeIndex === i) ? 3.5 : 0.8;
    }
    
    const centerOffset = -3; 
    const targetY = centerOffset + currentYOffset + (isActive ? 1.75 : 0.4);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
    
    if (contentRef.current) {
      const targetScale = isActive ? 1 : 0;
      contentRef.current.scale.setScalar(THREE.MathUtils.lerp(contentRef.current.scale.x, targetScale, 0.1));
    }
  });

  return (
    <group>
      <mesh 
        ref={meshRef} 
        onClick={() => setActiveIndex(activeIndex === index ? null : index)}
      >
        <boxGeometry args={[4, 0.8, 0.1]} />
        <meshStandardMaterial color={data.color} roughness={0.5} />
        
        <Text 
          position={[-1.8, 0.45, 0.06]} 
          fontSize={0.2} 
          color="white" 
          anchorX="left"
        >
          {`${index + 1}. ${data.title}`}
        </Text>

        <group ref={contentRef} position={[0, -0.4, 0.06]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[3.4, 2]} />
            <meshStandardMaterial color="#444" />
            <Text position={[0, 0, 0.01]} fontSize={0.1} color="white">IMAGE PLACEHOLDER</Text>
          </mesh>
          <Text 
            position={[-1.6, -1.2, 0]} 
            fontSize={0.15} 
            color="#aaa" 
            anchorX="left" 
            maxWidth={3}
          >
            {data.text}
          </Text>
        </group>
      </mesh>
    </group>
  );
};

const Scene = ({ activeIndex, setActiveIndex }) => {
  const groupRef = useRef();

  useFrame(() => {
    const targetX = activeIndex !== null ? -1 : 0;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);
  });

  return (
    <group ref={groupRef}>
      {DATA.map((item, i) => (
        <AccordionItem 
          key={i} 
          index={i} 
          data={item} 
          activeIndex={activeIndex} 
          setActiveIndex={setActiveIndex} 
        />
      ))}
    </group>
  );
};

export default function App() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505', overflow: 'hidden', position: 'relative' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <Scene activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      </Canvas>
      
      <div style={{ 
        position: 'absolute', 
        top: '40px', 
        left: '40px', 
        color: 'white', 
        fontFamily: 'sans-serif',
        pointerEvents: 'none'
      }}>
        <h1 style={{ fontSize: '1rem', fontWeight: '300', opacity: 0.3, letterSpacing: '2px' }}>SELECTED WORKS</h1>
      </div>
    </div>
  );
}
