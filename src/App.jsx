import { useRef, useState, useEffect } from 'react'
import { useRive } from '@rive-app/react-canvas'
import './App.css'

const VIDEO_DIMENSIONS = '700px'

function App() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const videoRef = useRef(null)

  const { RiveComponent, error } = useRive({
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

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px',
        color: 'red'
      }}>
        Error loading Rive animation. Please ensure drgenius_framework_header_27_10.riv is in the public folder.
      </div>
    )
  }

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
      <div style={{ position: 'relative', width: VIDEO_DIMENSIONS, height: VIDEO_DIMENSIONS }}>
        <video
          ref={videoRef}
          src="/Scroll_Animation.webm"
          autoPlay
          loop
          muted
          style={{
            width: VIDEO_DIMENSIONS,
            height: VIDEO_DIMENSIONS,
            display: 'block'
          }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: VIDEO_DIMENSIONS,
          height: VIDEO_DIMENSIONS,
          pointerEvents: 'none'
        }}>
          <RiveComponent />
        </div>
      </div>
    </div>
  )
}

export default App
