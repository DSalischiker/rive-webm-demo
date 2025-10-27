import { useRef, useState, useEffect } from 'react'
import { useRive } from '@rive-app/react-canvas'
import './App.css'

function App() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const videoRef = useRef(null)

  const { RiveComponent } = useRive({
    src: '/drgenius_framework_header_27_10.riv',
    autoplay: true,
  })

  useEffect(() => {
    const videoElement = videoRef.current
    if (videoElement) {
      const handleLoadedData = () => {
        setIsVideoLoaded(true)
      }
      
      videoElement.addEventListener('loadeddata', handleLoadedData)
      
      return () => {
        videoElement.removeEventListener('loadeddata', handleLoadedData)
      }
    }
  }, [])

  if (!isVideoLoaded) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      position: 'relative'
    }}>
      <div style={{ position: 'relative', width: '700px', height: '700px' }}>
        <video
          ref={videoRef}
          src="/Scroll_Animation.webm"
          autoPlay
          loop
          muted
          style={{
            width: '700px',
            height: '700px',
            display: 'block'
          }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '700px',
          height: '700px',
          pointerEvents: 'none'
        }}>
          <RiveComponent />
        </div>
      </div>
    </div>
  )
}

export default App
