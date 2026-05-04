import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const DATA = [
  { id: 1, title: 'Project 1', color: '#ff5f6d', text: 'Modern Web Architecture', img: 'https://picsum.photos/400/600?random=1' },
  { id: 2, title: 'Project 2', color: '#ffc371', text: 'Interactive 3D Experience', img: 'https://picsum.photos/400/600?random=2' },
  { id: 3, title: 'Project 3', color: '#4facfe', text: 'UI/UX Design System', img: 'https://picsum.photos/400/600?random=3' },
  { id: 4, title: 'Project 4', color: '#00f2fe', text: 'E-commerce Dashboard', img: 'https://picsum.photos/400/600?random=4' },
  { id: 5, title: 'Project 5', color: '#a8edea', text: 'Mobile App Development', img: 'https://picsum.photos/400/600?random=5' },
];

const AccordionItem = ({ index, data, activeIndex, setActiveIndex }) => {
  const meshRef = useRef();
  const isHovered = useRef(false);

  useFrame(() => {
    const targetScale = isHovered.current ? 1.1 : 1;
    const targetY = (index - 2) * 1.2;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
  });

  return (
    <group position={[0, (index - 2) * 1.2, 0]}>
      <mesh 
        ref={meshRef} 
        onClick={() => setActiveIndex(index)}
        onPointerOver={() => (isHovered.current = true)}
        onPointerOut={() => (isHovered.current = false)}
      >
        <boxGeometry args={[3, 1, 0.5]} />
        <meshStandardMaterial color={data.color} />
        <Text 
          position={[0, 0, 0.3]} 
          fontSize={0.3} 
          color="white" 
          anchorX="center" 
          anchorY="middle"
        >
          {data.title}
        </Text>
      </mesh>
    </group>
  );
};

const Card = ({ index, activeIndex, onCardImgClick }) => {
  const ref = useRef();
  const isActive = activeIndex === index;

  useFrame(() => {
    const targetPos = isActive ? [2.5, (index - 2) * 1.2, 0] : [10, (index - 2) * 1.2, 0];
    ref.current.position.lerp(new THREE.Vector3(...targetPos), 0.1);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, isActive ? 0 : Math.PI / 2, 0.1);
  });

  return (
    <group ref={ref} position={[10, (index - 2) * 1.2, 0]}>
      <mesh onClick={() => onCardImgClick()}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial color="white" />
        <Text position={[0, 1, 0.06]} fontSize={0.2} color="black">View Project</Text>
      </mesh>
    </group>
  );
};

const Scene = ({ activeIndex, setActiveIndex, onCardImgClick }) => {
  const groupRef = useRef();

  useFrame(() => {
    const targetX = activeIndex !== null ? -2 : 0;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);
  });

  return (
    <group ref={groupRef}>
      {DATA.map((item, i) => (
        <AccordionItem key={i} index={i} data={item} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      ))}
      {DATA.map((item, i) => (
        <Card key={i} index={i} activeIndex={activeIndex} onCardImgClick={onCardImgClick} />
      ))}
    </group>
  );
};

export default function App() {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleCardImgClick = () => {
    gsap.to('.hero-section', { y: 0, duration: 1, ease: 'power4.out' });
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111', overflow: 'hidden', position: 'relative' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Scene activeIndex={activeIndex} setActiveIndex={setActiveIndex} onCardImgClick={handleCardImgClick} />
      </Canvas>

      <div 
        className="hero-section" 
        style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          background: 'white', 
          transform: 'translateY(100%)', 
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          fontFamily: 'sans-serif',
          transition: 'none' 
        }}
      >
        <h1 style={{ color: 'black' }}>Project Detail</h1>
        <p style={{ fontSize: '1.5rem', color: '#666' }}>Full case study goes here</p>
        <button 
          onClick={() => gsap.to('.hero-section', { y: '100%', duration: 1, ease: 'power4.in' })}
          style={{ position: 'absolute', top: 20, right: 20, padding: '10px 20px', cursor: 'pointer' }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
