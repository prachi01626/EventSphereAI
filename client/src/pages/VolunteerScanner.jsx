import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { passService } from '../services/passService';
import { sound } from '../utils/sound';
import { StatusBadge } from '../components/Badges';
import { useAuth } from '../context/AuthContext';
import {
  ScanLine,
  Camera,
  Flashlight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles,
  Play,
  Square,
  AlertCircle,
  UserCheck,
  Shield,
  RefreshCw,
} from 'lucide-react';

export const VolunteerScanner = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanLogs, setScanLogs] = useState([]);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [manualPayload, setManualPayload] = useState('');
  const [cameraError, setCameraError] = useState('');

  // WebRTC & Scanner Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanAnimationRef = useRef(null);
  const isPausedRef = useRef(false);

  // Stop camera tracks cleanly on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const processScanData = async (rawString) => {
    setLoadingVerify(true);
    try {
      let payload;
      try {
        payload = JSON.parse(rawString);
      } catch (e) {
        const parts = rawString.trim().split(/[,|\s]+/);
        payload = { registrationId: parts[0], token: parts[1] };
      }

      if (!payload.registrationId || !payload.token) {
        throw new Error('QR code missing registration ID or dynamic TOTP token');
      }

      // Verify scan with Node.js/MongoDB backend
      const response = await passService.verifyScan(payload.registrationId, payload.token);

      sound.playSuccess();
      setScanResult({
        success: true,
        status: response.status || 'VALID',
        message: response.message,
        participant: response.participant,
        event: response.event,
        timestamp: new Date(),
      });

      setScanLogs((prev) => [
        {
          id: Date.now(),
          regId: payload.registrationId,
          status: 'VALID',
          message: response.message,
          name: response.participant?.name || 'Attendee',
          time: new Date(),
        },
        ...prev,
      ]);
    } catch (err) {
      sound.playError();
      const errData = err.response?.data || {};
      const statusType = errData.status || 'INVALID';
      const msg = errData.message || err.message || 'Scan validation failed';

      setScanResult({
        success: false,
        status: statusType,
        message: msg,
        participant: errData.participant,
        timestamp: new Date(),
      });

      setScanLogs((prev) => [
        {
          id: Date.now(),
          regId: 'SCAN-ERROR',
          status: statusType,
          message: msg,
          name: errData.participant?.name || 'Unknown',
          time: new Date(),
        },
        ...prev,
      ]);
    } finally {
      setLoadingVerify(false);
    }
  };

  // Continuous QR scan loop using jsQR
  const scanLoop = () => {
    if (!videoRef.current || !streamRef.current) return;

    const video = videoRef.current;
    if (video.readyState === video.HAVE_ENOUGH_DATA && !isPausedRef.current) {
      try {
        const canvas = canvasRef.current || document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data && code.data.trim()) {
          isPausedRef.current = true;
          processScanData(code.data.trim());

          // Cooldown for 2.5s before allowing next scan
          setTimeout(() => {
            isPausedRef.current = false;
          }, 2500);
        }
      } catch (scanErr) {
        // Continue scanning silently on transient frame read errors
      }
    }

    scanAnimationRef.current = requestAnimationFrame(scanLoop);
  };

  // Direct WebRTC getUserMedia implementation
  const startCamera = async () => {
    setCameraError('');
    try {
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e) {
        // Fallback for laptops/webcams without environment facing mode
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      streamRef.current = stream;

      // Correctly bind media stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }

      setIsCameraActive(true);
      isPausedRef.current = false;

      // Launch real-time frame scanning loop
      scanAnimationRef.current = requestAnimationFrame(scanLoop);
    } catch (err) {
      console.error('Camera stream initiation error:', err);
      setIsCameraActive(false);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera access permission denied. Please enable camera permissions in your browser.'
          : err.name === 'NotFoundError'
          ? 'No compatible camera hardware detected on this device.'
          : `Camera error: ${err.message}`
      );
    }
  };

  // Safe camera track teardown
  const stopCamera = () => {
    if (scanAnimationRef.current) {
      cancelAnimationFrame(scanAnimationRef.current);
      scanAnimationRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setTorchOn(false);
  };

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const nextTorch = !torchOn;
      const capabilities = track.getCapabilities?.() || {};
      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: nextTorch }],
        });
      }
      setTorchOn(nextTorch);
    } catch (err) {
      console.warn('Torch constraint not supported by device:', err.message);
      setTorchOn(!torchOn);
    }
  };

  // Fast Presentation Simulators (Testing real MongoDB verification API)
  const handleSimulateValidScan = async () => {
    try {
      const passes = await passService.getMyPasses();
      if (passes.length > 0) {
        const qr = await passService.getDynamicQR(passes[0]._id);
        const payloadString = JSON.stringify({
          registrationId: passes[0]._id,
          token: qr.token,
        });
        await processScanData(payloadString);
      } else {
        // Fallback with demo registration format
        await processScanData(JSON.stringify({ registrationId: 'demo_reg_001', token: '123456' }));
      }
    } catch (e) {
      console.error('Simulate scan error:', e);
    }
  };

  const handleSimulateExpiredScan = async () => {
    const passes = await passService.getMyPasses().catch(() => []);
    const regId = passes[0]?._id || 'demo_reg_seed';
    const payloadString = JSON.stringify({
      registrationId: regId,
      token: '000000',
    });
    await processScanData(payloadString);
  };

  const handleSimulateDuplicateScan = async () => {
    const passes = await passService.getMyPasses().catch(() => []);
    if (passes.length > 0) {
      const qr = await passService.getDynamicQR(passes[0]._id);
      await passService.verifyScan(passes[0]._id, qr.token).catch(() => {});
      await processScanData(JSON.stringify({ registrationId: passes[0]._id, token: qr.token }));
    } else {
      await processScanData(JSON.stringify({ registrationId: 'demo_reg_seed', token: '999999' }));
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-white/80 shadow-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-xs">
              <ScanLine className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Volunteer Gate Scanner</h1>
          </div>
          <p className="text-xs text-slate-600">
            Hardware-accelerated TOTP Dynamic Pass inspection, anti-proxy token verification & entry check-in
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Marshal: {user?.name?.split(' ')[0]}</span>
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs shadow-xs">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span>Turnstile Gate 01 Online</span>
          </div>
        </div>
      </div>

      {/* Role Reminder if guest */}
      {!isAuthenticated && (
        <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-emerald-950 font-medium">
            <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Operating in Standalone Gate Mode. Sign in as an official <strong>Volunteer</strong> or <strong>Organizer</strong> to link scans to your staff profile.
            </span>
          </div>
          <button
            onClick={() => openAuthModal('login', 'Volunteer')}
            className="px-4 py-2 forest-pill-active rounded-xl font-bold text-xs shrink-0 shadow-xs"
          >
            Sign In as Volunteer
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Mobile Camera Viewport Mockup */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-sm rounded-[40px] p-4 bg-slate-950 border-[6px] border-emerald-900/40 shadow-2xl shadow-emerald-950/20 overflow-hidden">
            <div className="w-32 h-4 bg-slate-800 rounded-full mx-auto mb-3"></div>

            {/* Viewport Screen */}
            <div className="relative w-full h-[400px] bg-slate-900 rounded-[28px] overflow-hidden flex flex-col items-center justify-center border border-slate-800">
              {/* WebRTC Video Stream binding */}
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className={`w-full h-full object-cover rounded-[28px] ${
                  isCameraActive ? 'block' : 'hidden'
                }`}
              />

              {/* Offscreen frame capture canvas */}
              <canvas ref={canvasRef} className="hidden" />

              {!isCameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="relative w-52 h-52 border-2 border-dashed border-emerald-500/50 rounded-2xl flex items-center justify-center bg-emerald-950/20">
                    <div className="scanner-laser"></div>
                    <Camera className="w-12 h-12 text-emerald-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Camera Viewport Idle</h3>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                      Click below to activate live WebCam stream and align attendee's 30s Dynamic QR Pass
                    </p>
                  </div>
                  {cameraError && (
                    <div className="p-2.5 bg-rose-950/80 border border-rose-500/40 rounded-xl text-[11px] text-rose-300 max-w-[260px]">
                      {cameraError}
                    </div>
                  )}
                </div>
              )}

              {isCameraActive && <div className="scanner-laser z-20"></div>}

              {/* Top Viewport Toolbar */}
              <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
                <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  TOTP Engine Active
                </span>

                <button
                  onClick={toggleTorch}
                  className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                    torchOn
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                      : 'bg-black/60 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                  title="Toggle Flash / Torch"
                >
                  <Flashlight className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Viewport Camera Control */}
              <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center">
                {!isCameraActive ? (
                  <button
                    onClick={startCamera}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold shadow-lg shadow-emerald-600/40 transition-all hover:scale-105"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Activate WebCam Scanner
                  </button>
                ) : (
                  <button
                    onClick={stopCamera}
                    className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-xs font-bold shadow-lg shadow-rose-600/40 transition-all hover:scale-105"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    Stop Camera
                  </button>
                )}
              </div>
            </div>

            <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto mt-3"></div>
          </div>

          {/* Presentation Simulators */}
          <div className="w-full max-w-sm mt-5 space-y-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-600 block text-center">
              ⚡ Instant Presentation Simulators
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={handleSimulateValidScan}
                disabled={loadingVerify}
                className="w-full py-2.5 px-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Simulate Valid Pass Scan (Chime)</span>
              </button>

              <button
                onClick={handleSimulateDuplicateScan}
                disabled={loadingVerify}
                className="w-full py-2.5 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-xs"
              >
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Simulate Duplicate Scan (Already Checked In)</span>
              </button>

              <button
                onClick={handleSimulateExpiredScan}
                disabled={loadingVerify}
                className="w-full py-2.5 px-3 bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-xs"
              >
                <XCircle className="w-4 h-4 text-rose-700" />
                <span>Simulate Expired Token (&gt;30s Anti-Proxy Alert)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Instant Scan Feedback Banner & Live Activity Log */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-white/80 shadow-glass space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              Scan Verdict & Telemetry
            </h2>

            {scanResult ? (
              <div
                className={`p-5 rounded-3xl border transition-all animate-fadeIn space-y-3 ${
                  scanResult.success
                    ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                    : scanResult.status === 'ALREADY_USED'
                    ? 'bg-amber-50 border-amber-300 shadow-sm'
                    : 'bg-rose-50 border-rose-300 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  {scanResult.success ? (
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  ) : scanResult.status === 'ALREADY_USED' ? (
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 shrink-0">
                      <XCircle className="w-6 h-6" />
                    </div>
                  )}

                  <div>
                    <h3
                      className={`text-base font-extrabold ${
                        scanResult.success
                          ? 'text-emerald-900'
                          : scanResult.status === 'ALREADY_USED'
                          ? 'text-amber-900'
                          : 'text-rose-900'
                      }`}
                    >
                      {scanResult.message}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono font-medium">
                      Timestamp: {scanResult.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {scanResult.participant && (
                  <div className="pt-2 border-t border-emerald-900/10 text-xs text-slate-700 space-y-1">
                    <p>
                      <strong>Attendee:</strong> {scanResult.participant.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {scanResult.participant.email}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 bg-emerald-50/50 rounded-2xl border border-emerald-200/50">
                Awaiting first scan. Use WebCam or click any simulation button above.
              </div>
            )}
          </div>

          {/* Manual Key-in Box */}
          <div className="glass-card p-5 rounded-3xl border border-white/80 shadow-glass space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Manual Payload Key-In
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualPayload}
                onChange={(e) => setManualPayload(e.target.value)}
                placeholder='e.g., {"registrationId": "xyz", "token": "123456"}'
                className="flex-1 bg-white border border-emerald-900/15 rounded-2xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-mono shadow-xs"
              />
              <button
                onClick={() => {
                  if (manualPayload) processScanData(manualPayload);
                }}
                disabled={loadingVerify || !manualPayload}
                className="px-5 py-2 forest-pill-active rounded-2xl text-xs font-bold shrink-0 shadow-xs"
              >
                Verify
              </button>
            </div>
          </div>

          {/* Live Gate Scan Activity Log */}
          <div className="glass-card rounded-3xl border border-white/80 shadow-glass overflow-hidden">
            <div className="p-4 border-b border-emerald-900/10 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Turnstile Scan Log ({scanLogs.length})
              </h3>
              <button
                onClick={() => setScanLogs([])}
                className="text-[11px] text-slate-500 hover:text-slate-800"
              >
                Clear
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-emerald-900/10 text-xs">
              {scanLogs.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-[11px]">
                  No scans logged in this session yet.
                </div>
              ) : (
                scanLogs.map((log) => (
                  <div key={log.id} className="p-3 hover:bg-emerald-50/50 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{log.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]">
                        {log.message}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={log.status === 'VALID' ? 'Valid' : 'Failed'} />
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {log.time.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
