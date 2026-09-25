import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

type ScratchRevealProps = {
  date: string;
  time: string;
  venue: string;
  city: string;
};

type Point = { x: number; y: number };

export function ScratchReveal({ date, time, venue, city }: ScratchRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const reveal = useCallback(() => {
    if (revealed) return;
    setRevealed(true);
    setConfetti(true);
    window.setTimeout(() => setConfetti(false), 1800);
  }, [revealed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    if (!canvas || !frame) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const paintCover = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const rect = frame.getBoundingClientRect();
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const gradient = context.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, "#b38a4a");
      gradient.addColorStop(0.48, "#e2c47e");
      gradient.addColorStop(1, "#8a632d");
      context.globalCompositeOperation = "source-over";
      context.fillStyle = gradient;
      context.fillRect(0, 0, rect.width, rect.height);
      context.fillStyle = "rgba(57, 18, 21, .8)";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "500 11px Arial, sans-serif";
      context.fillText("SCRATCH TO REVEAL", rect.width / 2, rect.height / 2 - 6);
      context.font = "italic 18px Georgia, serif";
      context.fillText("the details", rect.width / 2, rect.height / 2 + 18);
    };

    paintCover();
    const observer = new ResizeObserver(paintCover);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const scratch = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || revealed) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const point = pointFromEvent(event);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    context.save();
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.globalCompositeOperation = "destination-out";
    context.lineWidth = 42;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    const previous = lastPointRef.current ?? point;
    context.moveTo(previous.x, previous.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    context.restore();
    lastPointRef.current = point;

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let index = 3; index < pixels.length; index += 160) {
      if ((pixels[index] ?? 255) < 40) transparent += 1;
    }
    if (transparent / (pixels.length / 160) > 0.42) reveal();
  };

  return (
    <div className="scratch-shell reveal-item" aria-label="Scratch to reveal the Barat date and venue">
      <div ref={frameRef} className="scratch-frame">
        <div className="scratch-content">
          <span className="eyebrow">Barat</span>
          <h3>{date}</h3>
          <div className="ornament-line" aria-hidden="true"><i /></div>
          <p>{time}</p>
          <strong>{venue}</strong>
          <span>{city}</span>
        </div>
        <canvas
          ref={canvasRef}
          className={revealed ? "scratch-canvas is-revealed" : "scratch-canvas"}
          onPointerDown={(event) => {
            drawingRef.current = true;
            lastPointRef.current = pointFromEvent(event);
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={scratch}
          onPointerUp={() => {
            drawingRef.current = false;
            lastPointRef.current = null;
          }}
          onPointerCancel={() => {
            drawingRef.current = false;
            lastPointRef.current = null;
          }}
        />
        {confetti && (
          <div className="confetti" aria-hidden="true">
            {Array.from({ length: 32 }, (_, index) => (
              <i key={index} style={{ "--i": index } as React.CSSProperties} />
            ))}
          </div>
        )}
      </div>
      <p className="scratch-hint"><Sparkles size={13} /> Gently scratch the gold paper</p>
    </div>
  );
}