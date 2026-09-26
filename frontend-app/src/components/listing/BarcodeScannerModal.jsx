import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Camera, X, AlertCircle, RefreshCw, Barcode, CheckCircle2 } from "lucide-react";

export default function BarcodeScannerModal({ isOpen, onClose, onScanSuccess }) {
  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);
  const [scannedResult, setScannedResult] = useState(null);
  const [manualCode, setManualCode] = useState("");

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 1200;
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, 150);
    } catch {
      // AudioContext not allowed or not supported
    }

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  const handleDetected = async (decodedText) => {
    if (scannedResult) return; // Prevent multiple triggers
    const clean = decodedText.trim().replace(/[^0-9X]/gi, "");
    if (!clean) return;

    setScannedResult(clean);
    playBeep();

    // Stop camera before closing
    stopScanner();

    setTimeout(() => {
      onScanSuccess(clean);
    }, 600);
  };

  const stopScanner = () => {
    if (scannerRef.current && isRunningRef.current) {
      isRunningRef.current = false;
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current?.clear();
        })
        .catch((err) => {
          console.warn("Failed to stop scanner gracefully:", err);
        });
    }
  };

  const startScanner = async () => {
    setErrorMsg("");
    setIsInitializing(true);
    setScannedResult(null);

    const elementId = "isbn-barcode-reader";
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      // Create new instance if not exists
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(elementId, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
          ],
          verbose: false,
        });
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 15,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const width = Math.floor(viewfinderWidth * 0.82);
            const height = Math.floor(Math.min(viewfinderHeight * 0.55, 200));
            return { width, height };
          },
          aspectRatio: 1.333334,
        },
        (decodedText) => {
          handleDetected(decodedText);
        },
        () => {
          // Frame read callback, intentionally empty to avoid console flood
        }
      );

      isRunningRef.current = true;
      setIsInitializing(false);
    } catch (err) {
      console.warn("Camera start error:", err);
      setIsInitializing(false);
      isRunningRef.current = false;
      if (err?.name === "NotAllowedError" || String(err).includes("permission")) {
        setErrorMsg("Camera access denied. Please enable camera permission in your browser or enter the ISBN below.");
      } else if (err?.name === "NotFoundError" || String(err).includes("not found")) {
        setErrorMsg("No camera detected on this device. You can type the ISBN code manually.");
      } else {
        setErrorMsg("Could not start camera feed. Please enter the ISBN manually below.");
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        startScanner();
      }, 200);

      return () => {
        clearTimeout(timer);
        stopScanner();
      };
    } else {
      stopScanner();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 text-[#17152A]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#6C4BF4]/10 text-[#6C4BF4] flex items-center justify-center shrink-0">
              <Camera size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#17152A]">Scan Textbook Barcode</h3>
              <p className="text-[11px] text-gray-500 font-medium">Point camera at 13-digit ISBN barcode</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="h-8 w-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Camera Viewfinder */}
        <div className="mt-4 relative rounded-2xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center border border-gray-200 shadow-inner">
          <div id="isbn-barcode-reader" className="w-full h-full object-cover" />

          {/* Scanner Guide Overlay when camera is active */}
          {!errorMsg && !scannedResult && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              {/* Corner target brackets */}
              <div className="relative w-[78%] h-[50%] border-2 border-emerald-400/80 rounded-xl bg-emerald-400/5 shadow-[0_0_15px_rgba(52,211,153,0.3)] flex items-center justify-center">
                {/* Horizontal scan line */}
                <div
                  className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399]"
                  style={{
                    animation: "barcodeScan 2s ease-in-out infinite alternate",
                  }}
                />
              </div>
              <p className="mt-3 text-[11px] font-bold text-white/90 bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs">
                Align barcode inside frame
              </p>
            </div>
          )}

          {/* Initializing Spinner */}
          {isInitializing && !errorMsg && (
            <div className="absolute inset-0 bg-gray-900/90 flex flex-col items-center justify-center text-white gap-2">
              <RefreshCw size={24} className="animate-spin text-[#6C4BF4]" />
              <span className="text-xs font-semibold text-gray-300">Starting camera...</span>
            </div>
          )}

          {/* Scan Success Overlay */}
          {scannedResult && (
            <div className="absolute inset-0 bg-emerald-600/95 flex flex-col items-center justify-center text-white gap-2 animate-fade-in">
              <CheckCircle2 size={36} className="text-white animate-bounce" />
              <span className="text-sm font-extrabold tracking-wide">Barcode Scanned!</span>
              <span className="text-xs font-mono bg-white/20 px-3 py-1 rounded-lg">{scannedResult}</span>
            </div>
          )}

          {/* Camera Error Message */}
          {errorMsg && (
            <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
              <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                <AlertCircle size={22} />
              </div>
              <p className="text-xs font-bold text-gray-800 mb-1">Camera Not Available</p>
              <p className="text-[11px] text-gray-500 max-w-xs mb-3">{errorMsg}</p>
              <button
                onClick={startScanner}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6C4BF4] hover:underline cursor-pointer"
              >
                <RefreshCw size={12} /> Retry Camera
              </button>
            </div>
          )}
        </div>

        {/* Manual Input Fallback */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Or Enter ISBN Directly
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="e.g. 9780262033848"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && manualCode.trim()) {
                    e.preventDefault();
                    handleDetected(manualCode);
                  }
                }}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-[#F8F7FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4BF4]/20 focus:border-[#6C4BF4] font-mono text-[#17152A]"
              />
              <Barcode className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            </div>
            <button
              type="button"
              onClick={() => {
                if (manualCode.trim()) {
                  handleDetected(manualCode);
                }
              }}
              disabled={!manualCode.trim()}
              className="px-4 py-2 bg-[#6C4BF4] disabled:opacity-50 hover:bg-[#5B3DE0] text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
            >
              Apply
            </button>
          </div>
        </div>

        <style>{`
          @keyframes barcodeScan {
            0% { top: 10%; }
            100% { top: 90%; }
          }
        `}</style>
      </div>
    </div>
  );
}
