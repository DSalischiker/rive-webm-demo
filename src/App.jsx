import React from "react";
import Rive from "@rive-app/react-canvas";
import { useRive } from "@rive-app/react-canvas";
import RiveAnimation from "./assets/drgenius_framework_header_27_10.riv";
import video from "./assets/Scroll_Animation.webm";
export default function App() {
  const { rive, RiveComponent } = useRive({
    src: RiveAnimation,
    autoplay: true,
  });

  const videoRef = React.useRef(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  React.useEffect(() => {
    if (!videoRef.current) return;

    const handleLoadedData = (event) => {
      console.log("Loaded");
      setIsLoaded(true);
    };

    videoRef.current.addEventListener("loadeddata", handleLoadedData);

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadeddata", handleLoadedData);
      }
    };
  }, []); // Empty dependency array

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <>
          {!isLoaded && (
            <span style={{ color: "white" }}>Loading...</span>
          )}
          <video
            ref={videoRef}
            src={video}
            autoPlay
            loop
            muted
            playsInline
            style={{ 
              width: "700px", 
              height: "700px",
              visibility: isLoaded ? "visible" : "hidden"
            }}
          />
          {isLoaded && (
            <RiveComponent
              style={{
                width: "700px",
                height: "700px",
                position: "absolute",
                margin: "auto",
                pointerEvents: "none",
              }}
            />
          )}
        </>
      </div>
    </div>
  );
}
