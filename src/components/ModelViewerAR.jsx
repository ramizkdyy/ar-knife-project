import { useEffect } from 'react'

export function ModelViewerAR({ knifeType, onClose }) {

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const modelSrc = knifeType?.model || '/models/santoku/scene.gltf'

  return (
    <div className="ar-viewer-container">
      <button className="ar-close-btn" onClick={onClose}>✕</button>
      
      <model-viewer
  src={modelSrc}
  ar
  ar-modes="webxr scene-viewer quick-look"
  camera-controls
  auto-rotate
  shadow-intensity="1"
  ar-scale="auto"
  ar-placement="floor"
  orientation="90deg 0deg 0deg"
  style={{
    width: '100%',
    height: '100%'
  }}
>
        <button 
          slot="ar-button"
          className="ar-activate-btn"
        >
          📱 AR'da Görüntüle
        </button>

        <div slot="progress-bar" className="ar-progress-bar">
          <div className="ar-progress-fill"></div>
        </div>
      </model-viewer>

      <div className="ar-model-info">
        <span className="ar-info-kanji">{knifeType?.name}</span>
        <h3>{knifeType?.nameEn}</h3>
        <p>{knifeType?.steel} • {knifeType?.length}</p>
      </div>

      <div className="ar-instructions">
        <p>🔄 Döndürmek için sürükle</p>
        <p>📱 AR için butona dokun</p>
      </div>
    </div>
  )
}