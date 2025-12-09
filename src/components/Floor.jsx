export function Floor({ onPlaceKnife, onDeselect, selectedId, onMoveKnife }) {
    const handleClick = (e) => {
        e.stopPropagation()
        const point = e.point

        if (selectedId) {
            // Seçili bıçak varsa, onu tıklanan yere taşı
            onMoveKnife(selectedId, [point.x, 0, point.z])
        } else {
            // Seçili bıçak yoksa, yeni bıçak yerleştir
            onPlaceKnife([point.x, 0, point.z])
        }
    }

    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0, 0]}
            onClick={handleClick}
        >
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#555" />
        </mesh>
    )
}