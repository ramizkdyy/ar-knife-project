import { useGLTF, Center } from '@react-three/drei'
import { useMemo } from 'react'

export function Knife({ position = [0, 0, 0], scale = 2, rotation = 0, isSelected, onSelect }) {
    const { scene } = useGLTF('/models/scene.gltf')
    const clonedScene = useMemo(() => scene.clone(), [scene])

    const handleClick = (e) => {
        e.stopPropagation()
        onSelect()
    }

    return (
        <group position={position} rotation={[0, rotation, 0]} onClick={handleClick}>
            <Center>
                <primitive
                    object={clonedScene}
                    scale={scale}
                    rotation={[Math.PI / 2, 0, 0]}
                />
            </Center>

            {isSelected && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                    <ringGeometry args={[scale * 1.5, scale * 1.6, 32]} />
                    <meshBasicMaterial color="#00ff00" transparent opacity={0.7} />
                </mesh>
            )}
        </group>
    )
}