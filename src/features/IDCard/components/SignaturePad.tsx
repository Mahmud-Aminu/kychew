import { useRef, useState, useEffect } from 'react';
import Button from '@/components/common/Button';

interface SignaturePadProps {
    onChange: (dataUrl: string) => void;
    initialValue?: string;
}

export default function SignaturePad({ onChange, initialValue }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set up context styling
        ctx.strokeStyle = '#1e293b'; // slate-800
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Load initial signature if provided
        if (initialValue) {
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                setIsEmpty(false);
            };
            img.src = initialValue;
        }
    }, [initialValue]);

    const getCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();
        
        // Handle touch coordinates
        if ('touches' in e) {
            if (e.touches.length === 0) return null;
            
            // Adjust touch coordinates based on css scale
            const clientX = e.touches[0].clientX;
            const clientY = e.touches[0].clientY;
            
            return {
                x: ((clientX - rect.left) / rect.width) * canvas.width,
                y: ((clientY - rect.top) / rect.height) * canvas.height
            };
        } else {
            // Handle mouse coordinates
            return {
                x: ((e.clientX - rect.left) / rect.width) * canvas.width,
                y: ((e.clientY - rect.top) / rect.height) * canvas.height
            };
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        // Prevent scrolling on mobile touch
        if ('touches' in e) {
            e.preventDefault();
        }

        const coords = getCoords(e);
        if (!coords) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
        setIsDrawing(true);
        setIsEmpty(false);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        
        // Prevent scrolling on mobile touch
        if ('touches' in e) {
            e.preventDefault();
        }

        const coords = getCoords(e);
        if (!coords) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        saveSignature();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsEmpty(true);
        onChange('');
    };

    const saveSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Extract base64 png
        const dataUrl = canvas.toDataURL('image/png');
        onChange(dataUrl);
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">
                Draw Your Signature
            </label>
            
            <div className="relative border border-surface-200 dark:border-surface-700 rounded-xl bg-surface-50 dark:bg-surface-900 overflow-hidden shadow-inner">
                {/* Empty State Instructions Overlay */}
                {isEmpty && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-surface-400 dark:text-surface-500 text-xs sm:text-sm">
                        Use mouse or finger to draw your signature here
                    </div>
                )}
                
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={150}
                    className="w-full h-[150px] cursor-crosshair touch-none bg-transparent"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            </div>

            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearCanvas}
                    disabled={isEmpty}
                >
                    Clear Signature
                </Button>
            </div>
        </div>
    );
}
