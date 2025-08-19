import React, { useRef, useEffect, useState } from 'react';

const WebcamCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (cameraOn) {
      // Start the webcam stream when cameraOn is true
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setStream(stream);
          }
        })
        .catch((err) => {
          console.error('Error accessing webcam:', err);
        });
    } else {
      // Stop the webcam stream when cameraOn is false
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraOn]);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/png');
    setCapturedImages((prev) => [...prev, imageData]);
    setSelectedImage(imageData);
    if (onCapture) {
      onCapture(imageData);
    }
  };

  const toggleCamera = () => {
    setCameraOn((prev) => !prev);
  };

  const deleteImage = () => {
    if (!selectedImage) return;
    setCapturedImages((prev) => prev.filter((img) => img !== selectedImage));
    setSelectedImage(null);
  };

  const recaptureImage = () => {
    setSelectedImage(null);
    if (!cameraOn) {
      setCameraOn(true);
    }
  };

  return (
    <div className="container">
      <h2 className="text-xl font-bold mb-4">Capture Image</h2>

      <button onClick={toggleCamera} className="btn btn-primary mb-2">
        {cameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
      </button>

      {cameraOn && (
        <div>
          <video ref={videoRef} autoPlay playsInline className="mb-2" />
          <button type="button" onClick={captureImage} className="btn btn-success mb-2">
            Capture Image
          </button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {capturedImages.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Captured Images</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {capturedImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Captured ${index + 1}`}
                className={`w-24 h-24 object-cover cursor-pointer border-4 ${
                  selectedImage === img ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
          <button onClick={deleteImage} className="btn btn-danger mr-2" disabled={!selectedImage}>
            Delete Selected Image
          </button>
          <button onClick={recaptureImage} className="btn btn-secondary" disabled={cameraOn}>
            Recapture Image
          </button>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
