import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { useState } from 'react'
import { Scene } from './components/Scene'

const store = createXRStore()

// Bıçak bilgileri
const KNIFE_INFO = {
  name: "Santoku Bıçağı",
  origin: "Japonya",
  steel: "VG-10 Şam Çeliği",
  length: "18 cm",
  handle: "Pakka Wood",
  usage: "Sebze, et ve balık için çok amaçlı",
  description: "Santoku, Japonca'da 'üç erdem' anlamına gelir: dilimleme, doğrama ve küp kesme."
}

function App() {
  const [knives, setKnives] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  const handlePlaceKnife = (position) => {
    setKnives(prev => [...prev, {
      id: Date.now(),
      position,
      scale: 4,
      rotation: 0
    }])
  }

  const handleMoveKnife = (id, newPosition) => {
    setKnives(prev => prev.map(knife =>
      knife.id === id
        ? { ...knife, position: newPosition }
        : knife
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

  const clearKnives = () => {
    setKnives([])
    setSelectedId(null)
  }

  const selectedKnife = knives.find(k => k.id === selectedId)

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Üst butonlar */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 10,
        zIndex: 1000
      }}>
        <button onClick={() => store.enterAR()} style={btnStyle('#4CAF50')}>
          AR'a Gir
        </button>
        <button onClick={clearKnives} style={btnStyle('#f44336')}>
          Temizle
        </button>
      </div>

      {/* Seçili bıçak kontrolleri */}
      {selectedId && (
        <div style={{
          position: 'absolute',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 10,
          zIndex: 1000,
          background: 'rgba(0,0,0,0.8)',
          padding: '15px 20px',
          borderRadius: 10
        }}>
          <button onClick={() => handleScaleChange(-0.5)} style={btnStyle('#2196F3')}>
            − Küçült
          </button>
          <span style={{ color: 'white', alignSelf: 'center' }}>
            {selectedKnife?.scale.toFixed(1)}
          </span>
          <button onClick={() => handleScaleChange(0.5)} style={btnStyle('#2196F3')}>
            + Büyüt
          </button>
          <button onClick={handleRotate} style={btnStyle('#9C27B0')}>
            ↻ Döndür
          </button>
          <button onClick={handleDelete} style={btnStyle('#ff5722')}>
            🗑️ Sil
          </button>
          <button onClick={() => setSelectedId(null)} style={btnStyle('#607D8B')}>
            ✕ Kapat
          </button>
        </div>
      )}

      {/* Bilgi Paneli - Sağ tarafta */}
      {selectedId && (
        <div style={{
          position: 'absolute',
          top: '50%',
          right: 20,
          transform: 'translateY(-50%)',
          width: 280,
          background: 'rgba(0,0,0,0.85)',
          padding: 20,
          borderRadius: 12,
          zIndex: 1000,
          color: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          <h2 style={{ margin: '0 0 15px 0', color: '#4CAF50', fontSize: 22 }}>
            {KNIFE_INFO.name}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <InfoRow label="Menşei" value={KNIFE_INFO.origin} />
            <InfoRow label="Çelik" value={KNIFE_INFO.steel} />
            <InfoRow label="Bıçak Boyu" value={KNIFE_INFO.length} />
            <InfoRow label="Sap" value={KNIFE_INFO.handle} />
            <InfoRow label="Kullanım" value={KNIFE_INFO.usage} />
          </div>

          <p style={{
            marginTop: 15,
            fontSize: 13,
            color: '#aaa',
            lineHeight: 1.5,
            borderTop: '1px solid #333',
            paddingTop: 15
          }}>
            {KNIFE_INFO.description}
          </p>
        </div>
      )}

      {/* Alt bilgi */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        background: 'rgba(0,0,0,0.7)',
        padding: '10px 20px',
        borderRadius: 8,
        zIndex: 1000,
        textAlign: 'center'
      }}>
        {selectedId
          ? 'Zemine tıkla = Bıçağı taşı | Başka bıçağa tıkla = Seç'
          : 'Zemine tıkla = Bıçak yerleştir | Bıçağa tıkla = Seç'
        }
        <br />
        Toplam: {knives.length}
      </div>

      <Canvas camera={{ position: [0, 10, 20], fov: 50 }}>
        <XR store={store}>
          <Scene
            knives={knives}
            onPlaceKnife={handlePlaceKnife}
            selectedId={selectedId}
            onSelectKnife={setSelectedId}
            onMoveKnife={handleMoveKnife}
          />
        </XR>
      </Canvas>
    </div>
  )
}

// Bilgi satırı komponenti
function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: '#888' }}>{label}:</span>
      <span style={{ color: '#fff', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

const btnStyle = (bg) => ({
  padding: '12px 24px',
  fontSize: 16,
  background: bg,
  color: 'white',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer'
})

export default App