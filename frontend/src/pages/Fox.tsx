import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import React, { Suspense, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

function FoxModel({ mousePosition }: { mousePosition: { x: number; y: number } }) {
    const gltf = useLoader(
        GLTFLoader,
        "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF/Fox.gltf"
    );
    const foxRef = useRef<THREE.Group>();

    useFrame(() => {
        if (foxRef.current) {
            // Calculate rotation based on mouse position
            const targetRotationY = (mousePosition.x - 0.5) * Math.PI * 0.5;
            const targetRotationX = (mousePosition.y - 0.5) * Math.PI * 0.25;

            // Smooth rotation
            foxRef.current.rotation.y += (targetRotationY - foxRef.current.rotation.y) * 0.05;
            foxRef.current.rotation.x += (targetRotationX - foxRef.current.rotation.x) * 0.05;
        }
    });

    return (
        <primitive
            ref={foxRef}
            object={gltf.scene}
            scale={0.03}
            position={[0, -1, 0]}
        />
    );
}

export default function Fox() {
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

    const handleMouseMove = (event: React.MouseEvent) => {
        setMousePosition({
            x: event.clientX / window.innerWidth,
            y: event.clientY / window.innerHeight
        });
    };

    return (
        <div className="w-full h-[calc(100vh-4rem)]" onMouseMove={handleMouseMove}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                style={{ background: "linear-gradient(to bottom, #1a1a1a, #4a4a4a)" }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Suspense fallback={null}>
                    <FoxModel mousePosition={mousePosition} />
                </Suspense>
                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
                <p className="text-lg font-medium">Move your mouse to interact with the fox!</p>
            </div>
        </div>
    );
}