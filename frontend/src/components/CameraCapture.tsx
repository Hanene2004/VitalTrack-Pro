import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, RotateCcw, Check, Loader } from 'lucide-react';

interface CameraCaptureProps {
    onCapture: (imageData: string) => void;
    onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: 1280, height: 720 }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError(null);
        } catch (err) {
            console.error('Camera error:', err);
            setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0);
                const imageData = canvas.toDataURL('image/jpeg', 0.8);
                setCapturedImage(imageData);
            }
        }
    };

    const retake = () => {
        setCapturedImage(null);
    };

    const confirmCapture = async () => {
        if (capturedImage) {
            setIsAnalyzing(true);
            stopCamera();
            // Simulate AI analysis delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            onCapture(capturedImage);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-[#020617] flex items-center justify-center">
            <AnimatePresence>
                {error ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md p-12 glass-card rounded-[60px] border-rose-500/30 text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-6">
                            <Camera size={40} className="text-rose-500" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-4">Caméra Indisponible</h3>
                        <p className="text-slate-400 mb-8">{error}</p>
                        <button
                            onClick={onClose}
                            className="px-8 py-4 bg-rose-500 rounded-2xl text-white font-black uppercase text-xs tracking-widest hover:bg-rose-600 transition-all"
                        >
                            Fermer
                        </button>
                    </motion.div>
                ) : (
                    <div className="relative w-full h-full flex flex-col">
                        {/* Header */}
                        <div className="absolute top-0 left-0 right-0 z-10 p-8 bg-gradient-to-b from-[#020617] to-transparent">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-black text-white italic">
                                    {capturedImage ? 'Photo Capturée' : 'Scanner votre Repas'}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                                >
                                    <X size={28} />
                                </button>
                            </div>
                        </div>

                        {/* Camera/Image Display */}
                        <div className="flex-1 flex items-center justify-center p-8">
                            {capturedImage ? (
                                <motion.img
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    src={capturedImage}
                                    alt="Captured meal"
                                    className="max-w-full max-h-full rounded-[40px] shadow-2xl"
                                />
                            ) : (
                                <div className="relative w-full max-w-4xl aspect-video rounded-[40px] overflow-hidden shadow-2xl">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Overlay Grid */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                                            {[...Array(9)].map((_, i) => (
                                                <div key={i} className="border border-white/10" />
                                            ))}
                                        </div>
                                        {/* Center Focus Frame */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-64 h-64 border-4 border-emerald-500/50 rounded-3xl" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <canvas ref={canvasRef} className="hidden" />
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#020617] to-transparent">
                            <div className="flex justify-center items-center gap-8">
                                {capturedImage ? (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={retake}
                                            className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-black uppercase text-xs tracking-widest flex items-center gap-3 hover:bg-white/20 transition-all"
                                        >
                                            <RotateCcw size={20} />
                                            Reprendre
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={confirmCapture}
                                            disabled={isAnalyzing}
                                            className="px-12 py-6 bg-emerald-500 rounded-2xl text-white font-black uppercase text-xs tracking-widest flex items-center gap-3 hover:bg-emerald-600 transition-all disabled:opacity-50 shadow-[0_20px_60px_-10px_rgba(16,185,129,0.5)]"
                                        >
                                            {isAnalyzing ? (
                                                <>
                                                    <Loader size={20} className="animate-spin" />
                                                    Analyse IA...
                                                </>
                                            ) : (
                                                <>
                                                    <Check size={20} />
                                                    Analyser
                                                </>
                                            )}
                                        </motion.button>
                                    </>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={capturePhoto}
                                        className="w-24 h-24 rounded-full bg-white border-8 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:shadow-[0_0_60px_rgba(16,185,129,0.8)] transition-all flex items-center justify-center"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-emerald-500" />
                                    </motion.button>
                                )}
                            </div>
                            {!capturedImage && (
                                <p className="text-center text-slate-400 text-sm mt-6 font-medium">
                                    Centrez votre repas dans le cadre et appuyez pour capturer
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
