import React from 'react'
import { useRive, Layout, Fit } from '@rive-app/react-canvas'
import RiveAnimation from './assets/drgenius_framework_header_27_10.riv'
import video from './assets/Scroll_Animation.webm'

/**
 * Isolated Rive wrapper component for proper canvas management
 */
function RiveWrapper({ dimensions, windowSize }) {
  const containerRef = React.useRef(null)
  
  const { rive, RiveComponent } = useRive({
    src: RiveAnimation,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: 'center',
    }),
  })

  // Comprehensive resize handling for Rive canvas
  React.useEffect(() => {
    if (!rive || !rive.canvas) return

    const handleRiveResize = () => {
      try {
        rive.resizeDrawingSurfaceToCanvas()
      } catch (error) {
        console.warn('Rive resize failed:', error)
      }
    }

    // Initial resize
    handleRiveResize()

    // Window resize listener
    window.addEventListener('resize', handleRiveResize)
    window.addEventListener('orientationchange', handleRiveResize)

    // Container resize observer
    let resizeObserver = null
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(handleRiveResize)
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      window.removeEventListener('resize', handleRiveResize)
      window.removeEventListener('orientationchange', handleRiveResize)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [rive, dimensions])

  // Trigger resize when dimensions change
  React.useEffect(() => {
    if (!rive || !rive.canvas) return

    const timeoutId = setTimeout(() => {
      try {
        rive.resizeDrawingSurfaceToCanvas()
      } catch (error) {
        console.warn('Dimension change resize failed:', error)
      }
    }, 50)

    return () => clearTimeout(timeoutId)
  }, [rive, windowSize])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <RiveComponent
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </div>
  )
}

/**
 * Custom hook to manage responsive dimensions with real-time updates
 */
function useResponsiveDimensions() {
  const [dimensions, setDimensions] = React.useState({
    width: '100vw',
    height: '100vh',
  })
  const [windowSize, setWindowSize] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  })

  React.useEffect(() => {
    const updateDimensions = () => {
      const { innerWidth, innerHeight } = window
      
      // Update window size for tracking changes
      setWindowSize({ width: innerWidth, height: innerHeight })
      
      if (innerWidth >= 1024) {
        // Desktop
        setDimensions({ width: '700px', height: '700px' })
      } else if (innerWidth >= 768) {
        // Tablet
        setDimensions({ width: '500px', height: '500px' })
      } else {
        // Mobile
        setDimensions({ width: '90vw', height: '90vw' })
      }
    }

    updateDimensions()
    
    // Use both resize and orientationchange for better mobile support
    window.addEventListener('resize', updateDimensions)
    window.addEventListener('orientationchange', updateDimensions)

    return () => {
      window.removeEventListener('resize', updateDimensions)
      window.removeEventListener('orientationchange', updateDimensions)
    }
  }, [])

  return { dimensions, windowSize }
}

export default function App() {
  const { dimensions, windowSize } = useResponsiveDimensions()
  
  const videoRef = React.useRef(null)
  const [isLoaded, setIsLoaded] = React.useState(false)
  React.useEffect(() => {
    if (!videoRef.current) return

    const handleLoadedData = () => {
      console.log('Loaded')
      setIsLoaded(true)
    }

    videoRef.current.addEventListener('loadeddata', handleLoadedData)

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', handleLoadedData)
      }
    }
  }, [])

  return (
    <div className="App">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        {!isLoaded && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: '1.2rem',
              zIndex: 10,
            }}
          >
            Loading...
          </div>
        )}
        
        <div
          style={{
            position: 'relative',
            width: dimensions.width,
            height: dimensions.height,
          }}
        >
          <video
            ref={videoRef}
            src={video}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              visibility: isLoaded ? 'visible' : 'hidden',
            }}
          />
          
          {isLoaded && (
            <RiveWrapper 
              dimensions={dimensions} 
              windowSize={windowSize} 
            />
          )}
        </div>
      </div>
    </div>
  )
}
