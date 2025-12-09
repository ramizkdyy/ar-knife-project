import { Environment, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { Knife } from './Knife'
import { Floor } from './Floor'

export function Scene({ knives, onPlaceKnife, selectedId, onSelectKnife, onMoveKnife }) {
    return (
        <>
            <Suspense fallback={null}>
                <Environment preset="city" />
            </Suspense>

            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 10]} intensity={1.5} />

            <Floor
                onPlaceKnife={onPlaceKnife}
                onDeselect={() => onSelectKnife(null)}
                selectedId={selectedId}
                onMoveKnife={onMoveKnife}
            />

            {knives.map((knife) => (
                <Knife
                    key={knife.id}
                    position={knife.position}
                    scale={knife.scale || 2}
                    rotation={knife.rotation || 0}
                    isSelected={selectedId === knife.id}
                    onSelect={() => onSelectKnife(knife.id)}
                />
            ))}

            {/* Seçili bıçak yokken kamerayı döndürebilirsin */}
            <OrbitControls enabled={!selectedId} />
            <gridHelper args={[50, 50]} />
        </>
    )
}