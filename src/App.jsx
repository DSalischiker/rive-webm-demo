import React from 'react'
import { useRive, Layout, Fit } from '@rive-app/react-canvas'
import RiveAnimation from './assets/drgenius_framework_header_27_10.riv'
import video from './assets/Scroll_Animation.webm'

/**
 * Isolated Rive wrapper component for proper canvas management
 * Memoized to prevent unnecessary re-renders
 */
const RiveWrapper = React.memo(function RiveWrapper({ dimensions, windowSize }) {
  const containerRef = React.useRef(null)
  const resizeTimeoutRef = React.useRef(null)
  const isResizingRef = React.useRef(false)
  
  const riveConfig = React.useMemo(() => ({
    src: RiveAnimation,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: 'center',
    }),
  }), [])
  
  const { rive, RiveComponent } = useRive(riveConfig)

  // Debounced resize handler to prevent glitching
  const debouncedResize = React.useCallback(() => {
    if (!rive || !rive.canvas) return

    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current)
    }

    isResizingRef.current = true

    resizeTimeoutRef.current = setTimeout(() => {
      try {
        rive.resizeDrawingSurfaceToCanvas()
        isResizingRef.current = false
      } catch (error) {
        console.warn('❌ Rive resize failed:', error)
        isResizingRef.current = false
      }
    }, 100)
  }, [rive])

  // Comprehensive resize handling for Rive canvas
  React.useEffect(() => {
    if (!rive || !rive.canvas) return

    // Initial resize without debounce
    const handleInitialResize = () => {
      try {
        rive.resizeDrawingSurfaceToCanvas()
      } catch (error) {
        console.warn('❌ Initial Rive resize failed:', error)
      }
    }

    // Debounced resize for ongoing events
    const handleResize = () => {
      if (!isResizingRef.current) {
        debouncedResize()
      }
    }

    // Initial resize
    handleInitialResize()

    // Window resize listener with debouncing
    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('orientationchange', handleResize, { passive: true })

    // Container resize observer with debouncing
    let resizeObserver = null
    if (containerRef.current) {
      resizeObserver = new ResizeObserver((entries) => {
        // Only trigger if the size actually changed
        const entry = entries[0]
        if (entry && !isResizingRef.current) {
          debouncedResize()
        }
      })
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [rive, debouncedResize])

  // Trigger resize when dimensions change (less aggressive)
  React.useEffect(() => {
    if (!rive || !rive.canvas) return

    const timeoutId = setTimeout(() => {
      if (!isResizingRef.current) {
        debouncedResize()
      }
    }, 150)

    return () => clearTimeout(timeoutId)
  }, [rive, dimensions, debouncedResize])

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%', 
        height: '100%',
        // Prevent layout shift during resize
        contain: 'layout style paint',
      }}
    >
      <RiveComponent
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          // Smooth transitions and prevent flicker
          transition: 'none',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      />
    </div>
  )
})

/**
 * Custom hook to manage responsive dimensions with real-time updates
 * Memoized to prevent unnecessary re-calculations
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

  const updateDimensions = React.useCallback(() => {
    const { innerWidth, innerHeight } = window
    
    // Update window size for tracking changes
    setWindowSize(prevSize => {
      if (prevSize.width === innerWidth && prevSize.height === innerHeight) {
        return prevSize // Prevent unnecessary state update
      }
      return { width: innerWidth, height: innerHeight }
    })
    
    let newDimensions
    if (innerWidth >= 1024) {
      // Desktop
      newDimensions = { width: '700px', height: '700px' }
    } else if (innerWidth >= 768) {
      // Tablet
      newDimensions = { width: '500px', height: '500px' }
    } else {
      // Mobile
      newDimensions = { width: '90vw', height: '90vw' }
    }
    
    setDimensions(prevDimensions => {
      if (prevDimensions.width === newDimensions.width && 
          prevDimensions.height === newDimensions.height) {
        return prevDimensions // Prevent unnecessary state update
      }
      return newDimensions
    })
  }, [])

  React.useEffect(() => {
    updateDimensions()
    
    // Use both resize and orientationchange for better mobile support
    window.addEventListener('resize', updateDimensions)
    window.addEventListener('orientationchange', updateDimensions)

    return () => {
      window.removeEventListener('resize', updateDimensions)
      window.removeEventListener('orientationchange', updateDimensions)
    }
  }, [updateDimensions])

  return React.useMemo(() => ({ dimensions, windowSize }), [dimensions, windowSize])
}

export default function App() {
  const responsiveDimensions = useResponsiveDimensions()
  
  const videoRef = React.useRef(null)
  const [isLoaded, setIsLoaded] = React.useState(false)
  
  const handleLoadedData = React.useCallback(() => {
    setIsLoaded(true)
  }, [])
  
  React.useEffect(() => {
    if (!videoRef.current) return

    videoRef.current.addEventListener('loadeddata', handleLoadedData)

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', handleLoadedData)
      }
    }
  }, [handleLoadedData])

  // Memoize the container style to prevent re-renders
  const containerStyle = React.useMemo(() => ({
    position: 'relative',
    width: responsiveDimensions.dimensions.width,
    height: responsiveDimensions.dimensions.height,
  }), [responsiveDimensions.dimensions])

  const videoStyle = React.useMemo(() => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    visibility: isLoaded ? 'visible' : 'hidden',
  }), [isLoaded])

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
        
        <div style={containerStyle}>
          <video
            ref={videoRef}
            src={video}
            autoPlay
            loop
            muted
            playsInline
            style={videoStyle}
          />
          
          {isLoaded && (
            <RiveWrapper 
              dimensions={responsiveDimensions.dimensions} 
              windowSize={responsiveDimensions.windowSize} 
            />
          )}
        </div>
      </div>
    </div>
  )
}
