import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';

const PlateScanner = () => {
  const webcamRef = useRef<Webcam>(null); 
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [plateText, setPlateText] = useState('');
  const [loading, setLoading] = useState(false);

  const captureImage = () => {
    const image = webcamRef.current?.getScreenshot();
    setImageSrc(image!);
    recognizeText(image);
  };

  const recognizeText = async (image) => {
    setLoading(true);
    setPlateText('');
    try {
      const { data: { text } } = await Tesseract.recognize(
        image,
        'eng',
        {
          logger: m => console.log(m)
        }
      );
      setPlateText(text);
    } catch (error) {
      console.error('OCR Error:', error);
      setPlateText('Failed to recognize plate.');
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>📷 Plate Number Scanner</h2>
      {!imageSrc ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          width="100%"
          style={{ maxWidth: '400px' }}
        />
      ) : (
        <img src={imageSrc} alt="Captured" style={{ maxWidth: '100%' }} />
      )}

      <div style={{ marginTop: 20 }}>
        {!imageSrc ? (
          <button onClick={captureImage}>📸 Capture</button>
        ) : (
          <button onClick={() => setImageSrc('')}>🔁 Retake</button>
        )}
      </div>

      {loading && <p>⏳ Recognizing...</p>}
      {plateText && <p><strong>Plate Number:</strong> {plateText}</p>}
    </div>
  );
};

export default PlateScanner;
