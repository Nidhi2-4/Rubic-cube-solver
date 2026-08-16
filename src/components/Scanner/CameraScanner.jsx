import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle2, AlertCircle, ArrowRight, VideoOff } from 'lucide-react';
import { FACES, FACE_NAMES, CUBE_COLORS } from '../../types/cube.js';
import { sampleCanvasROI } from '../../utils/colorClassifier.js';
import FaceProgress from './FaceProgress.jsx';
import Button from '../UI/Button.jsx';

export default function CameraScanner({
  onFacesComplete,
  onSwitchToNet
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [activeFaceIndex, setActiveFaceIndex] = useState(0); // 0..5
  const [capturedFaces, setCapturedFaces] = useState({}); // { U: [...], R: [...] }
  const [liveColors, setLiveColors] = useState(Array(9).fill({ colorKey: 'W', hex: '#FFFFFF', confidence: 0.9 }));
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [cameraError, setCameraError] = useState(null);
  const [isCameraLoading, setIsCameraLoading] = useState(true);

  const activeFace = FACES[activeFaceIndex];

  // 1. Enumerate camera devices
  useEffect(() => {
    async function getCameraDevices() {
      try {
        const devList = await navigator.mediaDevices.enumerateDevices();
        const videoDevs = devList.filter(d => d.kind === 'videoinput');
        setDevices(videoDevs);
        if (videoDevs.length > 0) {
          setSelectedDeviceId(videoDevs[0].deviceId);
        }
      } catch (err) {
        console.warn('Unable to enumerate camera devices:', err);
      }
    }
    getCameraDevices();
  }, []);

  // 2. Start Video Stream
  useEffect(() => {
    let currentStream = null;

    async function startCamera() {
      setIsCameraLoading(true);
      setCameraError(null);

      try {
        const constraints = {
          video: selectedDeviceId
            ? { deviceId: { exact: selectedDeviceId } }
            : { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setIsCameraLoading(false);
      } catch (err) {
        console.error('Camera stream error:', err);
        setCameraError(err.message || 'Unable to access camera device. Please grant camera permissions.');
        setIsCameraLoading(false);
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedDeviceId]);

  // 3. Real-time Sampling Loop
  useEffect(() => {
    let animFrameId = null;

    const processFrame = () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === 4) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Grid center and spacing
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const spacing = Math.min(canvas.width, canvas.height) * 0.22;

        const samples = [];
        const offsets = [-1, 0, 1];

        // Sample 3x3 grid from top-left row-by-row
        for (let row of offsets) {
          for (let col of offsets) {
            const sx = cx + col * spacing;
            const sy = cy + row * spacing;
            const sampled = sampleCanvasROI(ctx, sx, sy, 10);
            samples.push(sampled);
          }
        }

        setLiveColors(samples);
      }

      animFrameId = requestAnimationFrame(processFrame);
    };

    animFrameId = requestAnimationFrame(processFrame);

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, []);

  // 4. Capture Face Action
  const handleCaptureFace = () => {
    const faceColors = liveColors.map(c => c.colorKey);
    const updatedCaptures = { ...capturedFaces, [activeFace]: faceColors };
    setCapturedFaces(updatedCaptures);

    if (activeFaceIndex < 5) {
      setActiveFaceIndex(prev => prev + 1);
    } else {
      // All 6 faces captured!
      onFacesComplete(updatedCaptures);
    }
  };

  const handleResetCaptures = () => {
    setCapturedFaces({});
    setActiveFaceIndex(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Face Step Progression Guide */}
      <FaceProgress
        activeFaceIndex={activeFaceIndex}
        capturedFaces={capturedFaces}
        onSelectFace={setActiveFaceIndex}
        onResetCaptures={handleResetCaptures}
      />

      {/* Main Scanner Viewport */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col items-center gap-4 relative overflow-hidden">
        {/* Header Bar */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">
              Live Webcam Feed
            </span>
          </div>

          {/* Camera Selection */}
          {devices.length > 1 && (
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="bg-slate-900 text-xs text-slate-200 px-3 py-1.5 rounded-xl border border-slate-800 outline-none"
            >
              {devices.map(d => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Camera ${d.deviceId.slice(0, 5)}`}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Video & Canvas Viewport */}
        {cameraError ? (
          <div className="w-full h-80 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <VideoOff className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Webcam Access Unavailable</h4>
              <p className="text-xs text-slate-400 max-w-md mt-1">
                {cameraError}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="primary" onClick={onSwitchToNet}>
                Use 2D Net Editor Instead
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl flex items-center justify-center">
            {/* Hidden Video Source */}
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Processing Canvas */}
            <canvas ref={canvasRef} className="hidden" />

            {/* 3x3 Overlay Grid */}
            <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
              <div className="w-full h-full grid grid-cols-3 gap-3 p-3 border-2 border-dashed border-blue-400/60 rounded-2xl bg-slate-950/20 backdrop-blur-[2px]">
                {liveColors.map((col, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border-2 transition-all duration-150 flex items-center justify-center shadow-lg relative"
                    style={{
                      backgroundColor: col.hex,
                      borderColor: col.confidence > 0.75 ? '#60A5FA' : '#F43F5E'
                    }}
                  >
                    <span className="font-mono font-extrabold text-sm drop-shadow-md text-black">
                      {col.colorKey}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions overlay */}
            <div className="absolute top-3 left-3 right-3 py-1.5 px-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-center">
              <span className="text-xs font-semibold text-white">
                Align <span className="text-blue-400">{FACE_NAMES[activeFace]} ({activeFace})</span> face inside grid
              </span>
            </div>
          </div>
        )}

        {/* Capture Action Controls */}
        {!cameraError && (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-400">
              Center sticker should match face color <strong className="text-white">({activeFace})</strong>.
            </span>

            <Button
              variant="primary"
              size="lg"
              onClick={handleCaptureFace}
              className="w-full sm:w-auto px-8 glow-blue"
            >
              <Camera className="w-5 h-5" />
              <span>Capture {FACE_NAMES[activeFace]} Face</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
