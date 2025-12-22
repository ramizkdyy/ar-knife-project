import { Canvas } from '@react-three/fiber'
import { useState } from 'react'
import { Scene } from './components/Scene'
import { ModelViewerAR } from './components/ModelViewerAR'
import './index.css'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('/models/santoku/scene.gltf')
useGLTF.preload('/models/gyuto/scene.gltf')

const KNIFE_TYPES = {
  santoku: {
    id: 'santoku',
    name: "三徳包丁",
    nameEn: "Santoku",
    origin: "Japonya",
    steel: "VG-10 Şam Çeliği",
    length: "18 cm",
    handle: "Pakka Wood",
    usage: "Sebze, et ve balık için çok amaçlı",
    description: "Santoku, Japonca'da 'üç erdem' anlamına gelir: dilimleme, doğrama ve küp kesme.",
    model: "/models/santoku/scene.gltf",
    baseScale: 1,
    rotationFix: [Math.PI / 2, 0, 0]
  },
  gyuto: {
    id: 'gyuto',
    name: "牛刀",
    nameEn: "Gyuto",
    origin: "Japonya",
    steel: "Aogami Super",
    length: "21 cm",
    handle: "Kayın Ağacı",
    usage: "Et kesimi ve genel mutfak işleri",
    description: "Japon şef bıçağı. Batı tarzı chef knife'ın Japon yorumudur, daha ince ve keskin.",
    model: "/models/gyuto/scene.gltf",
    baseScale: 1,
    rotationFix: [Math.PI / 2, 0, 0]
  }
}

const VIEW_MODES = {
  NORMAL: 'normal',
  WIREFRAME: 'wireframe',
  XRAY: 'xray'
}

function App() {
  const [knives, setKnives] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [viewMode, setViewMode] = useState(VIEW_MODES.NORMAL)
  const [activeKnifeType, setActiveKnifeType] = useState('santoku')
  const [showKnifeMenu, setShowKnifeMenu] = useState(false)
  const [arMode, setArMode] = useState(false)

  const handlePlaceKnife = (position) => {
    setKnives(prev => [...prev, {
      id: Date.now(),
      type: activeKnifeType,
      position,
      scale: 4,
      rotation: 0
    }])
  }

  const handleMoveKnife = (id, newPosition) => {
    setKnives(prev => prev.map(knife =>
      knife.id === id ? { ...knife, position: newPosition } : knife
    ))
  }

  const handleScaleChange = (delta) => {
    if (!selectedId) return
    setKnives(prev => prev.map(knife =>
      knife.id === selectedId
        ? { ...knife, scale: Math.max(0.5, Math.min(8, knife.scale + delta)) }
        : knife
    ))
  }

  const handleRotate = () => {
    if (!selectedId) return
    setKnives(prev => prev.map(knife =>
      knife.id === selectedId
        ? { ...knife, rotation: (knife.rotation || 0) + Math.PI / 4 }
        : knife
    ))
  }

  const handleDelete = () => {
    if (!selectedId) return
    setKnives(prev => prev.filter(knife => knife.id !== selectedId))
    setSelectedId(null)
  }

  const cycleViewMode = () => {
    setViewMode(prev => {
      if (prev === VIEW_MODES.NORMAL) return VIEW_MODES.WIREFRAME
      if (prev === VIEW_MODES.WIREFRAME) return VIEW_MODES.XRAY
      return VIEW_MODES.NORMAL
    })
  }

  const getViewModeLabel = () => {
    if (viewMode === VIEW_MODES.WIREFRAME) return '🔲'
    if (viewMode === VIEW_MODES.XRAY) return '👁'
    return '🎨'
  }

  const selectedKnife = knives.find(k => k.id === selectedId)
  const selectedKnifeInfo = selectedKnife ? KNIFE_TYPES[selectedKnife.type] : null

  if (arMode) {
    return (
      <ModelViewerAR
        knifeType={KNIFE_TYPES[activeKnifeType]}
        onClose={() => setArMode(false)}
      />
    )
  }

  return (
    <div className="app-container">
      {/* Üst Bar */}
      <header className="top-bar">
        <div className="logo-section">
          <div>
            <div className="logo-kanji">刃物展示</div>
            <div className="logo-subtitle">Japanese Knife AR</div>
          </div>
        </div>

        <div className="top-actions">
          <button
            className="btn btn-secondary"
            onClick={() => { setKnives([]); setSelectedId(null) }}
          >
            Temizle
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setArMode(true)}
          >
            📷 AR
          </button>
        </div>
      </header>

      {/* Kontrol Paneli */}
      {selectedId && (
        <div className="control-panel">
          <button className="control-btn" onClick={() => handleScaleChange(-0.5)}>−</button>
          <span className="scale-display">×{selectedKnife?.scale.toFixed(1)}</span>
          <button className="control-btn" onClick={() => handleScaleChange(0.5)}>+</button>
          <div className="control-divider" />
          <button className="control-btn" onClick={handleRotate}>↻</button>
          <div className="control-divider" />
          <button
            className={`control-btn ${viewMode !== VIEW_MODES.NORMAL ? 'active' : ''}`}
            onClick={cycleViewMode}
            title={`Görünüm: ${viewMode}`}
          >
            {getViewModeLabel()}
          </button>
          <div className="control-divider" />
          <button className="control-btn danger" onClick={handleDelete}>✕</button>
        </div>
      )}

      {/* Görünüm Modu Göstergesi */}
      {viewMode !== VIEW_MODES.NORMAL && (
        <div className="view-mode-badge">
          {viewMode === VIEW_MODES.WIREFRAME ? 'Wireframe' : 'X-Ray'}
        </div>
      )}

      {/* Bilgi Paneli */}
      {selectedId && selectedKnifeInfo && (
        <div className="info-panel">
          <button className="info-close" onClick={() => setSelectedId(null)}>✕</button>

          <div className="info-header">
            <span className="info-kanji">{selectedKnifeInfo.name}</span>
            <h2 className="info-title">{selectedKnifeInfo.nameEn}</h2>
            <span className="info-origin">{selectedKnifeInfo.origin}</span>
          </div>

          <div className="info-body">
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Çelik Tipi</span>
                <span className="info-value">{selectedKnifeInfo.steel}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Bıçak Boyu</span>
                <span className="info-value">{selectedKnifeInfo.length}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Sap Malzemesi</span>
                <span className="info-value">{selectedKnifeInfo.handle}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Kullanım</span>
                <span className="info-value">{selectedKnifeInfo.usage}</span>
              </div>
            </div>

            <div className="info-description">
              <p>{selectedKnifeInfo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Boş Durum */}
      {knives.length === 0 && (
        <div className="empty-state">
          <div className="empty-kanji">刃</div>
          <p className="empty-text">Yerleştirmek için zemine dokunun</p>
          <p className="empty-hint">veya AR modunu başlatın</p>
        </div>
      )}

      {/* Bıçak Tipi Seçici */}
      <div className="knife-selector">
        <button
          className="knife-selector-btn"
          onClick={() => setShowKnifeMenu(!showKnifeMenu)}
        >
          <span className="knife-selector-kanji">{KNIFE_TYPES[activeKnifeType].name}</span>
          <span className="knife-selector-name">{KNIFE_TYPES[activeKnifeType].nameEn}</span>
          <span className={`knife-selector-arrow ${showKnifeMenu ? 'open' : ''}`}>▼</span>
        </button>

        {showKnifeMenu && (
          <>
            <div className="knife-menu-backdrop" onClick={() => setShowKnifeMenu(false)} />
            <div className="knife-menu">
              {Object.values(KNIFE_TYPES).map((knife) => (
                <button
                  key={knife.id}
                  className={`knife-menu-item ${activeKnifeType === knife.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveKnifeType(knife.id)
                    setShowKnifeMenu(false)
                  }}
                >
                  <span className="knife-menu-kanji">{knife.name}</span>
                  <div className="knife-menu-info">
                    <span className="knife-menu-name">{knife.nameEn}</span>
                    <span className="knife-menu-usage">{knife.usage}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Alt Durum Barı */}
      <div className="status-bar">
        <span className="status-text">
          {selectedId ? 'Zemine dokun: Taşı' : 'Zemine dokun: Yerleştir'}
        </span>
        <span className="status-divider">•</span>
        <span className="status-count">{knives.length} bıçak</span>
      </div>

      {/* 3D Canvas */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 10, 20], fov: 50 }}>
          <Scene
            knives={knives}
            onPlaceKnife={handlePlaceKnife}
            selectedId={selectedId}
            onSelectKnife={setSelectedId}
            onMoveKnife={handleMoveKnife}
            viewMode={viewMode}
            knifeTypes={KNIFE_TYPES}
          />
        </Canvas>
      </div>
    </div>
  )
}

export default App