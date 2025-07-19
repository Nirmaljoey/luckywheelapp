import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import './Wheel.css';
import { PRIZES } from '../constants/prizes';
import { sendToSheet } from '../utils/sendToSheet';

const segments = PRIZES;
const colors = [
    '#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1',
    '#955251', '#B565A7', '#009B77', '#DD4124', '#45B8AC'
];

function getContrastColor(bgColor: string): string {
    // Remove hash and convert to RGB
    const color = bgColor.substring(1);
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);

    // Luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

    return luminance > 150 ? '#000000' : '#ffffff'; // light bg => black text
}
interface WheelProps {
    onResult: (result: string) => void;
    user: { name: string; email: string; phone: string };
}

const Wheel: React.FC<WheelProps> = ({ onResult, user }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [hasSpun, setHasSpun] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        drawWheel(ctx, canvas.width / 2 - 10);
    }, []);

    const drawWheel = (ctx: CanvasRenderingContext2D, radius: number) => {
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const arc = (2 * Math.PI) / segments.length;

        for (let i = 0; i < segments.length; i++) {
            const angle = i * arc;
            ctx.beginPath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, angle, angle + arc, false);
            ctx.fill();

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle + arc / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = getContrastColor(colors[i % colors.length]);
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText(segments[i], radius - 10, 10);
            ctx.restore();
        }

        // Draw logo in center
        const img = new Image();
        img.src = '/wheel-logo.jpg';
        img.onload = () => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img, centerX - 60, centerY - 60, 120, 120);
            ctx.restore();
        };
    };

    const spin = () => {
        if (hasSpun || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const arc = (2 * Math.PI) / segments.length;
        const duration = 12000;
        const spins = 10;
        const selectedIndex = Math.floor(Math.random() * segments.length);
        const selectedAngle = selectedIndex * arc;
        const finalRotation = spins * 2 * Math.PI + (Math.PI * 3 / 2 - selectedAngle); // needle at top

        let start: number | null = null;

        const animate = (timestamp: number) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const t = Math.min(elapsed / duration, 1);
            const eased = easeOut(t);
            const currentRotation = eased * finalRotation;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(currentRotation);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
            drawWheel(ctx, canvas.width / 2 - 10);
            ctx.restore();

            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                confetti({ particleCount: 100, spread: 60 });
                const prize = segments[selectedIndex];
                onResult(prize);
                setHasSpun(true);

                const key = `${user.email.trim().toLowerCase()}-${user.phone.trim()}`;
                localStorage.setItem(key, prize);

                // Optionally send to Google Sheets
                sendToSheet({
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    prize: prize,
                });
            }
        };

        requestAnimationFrame(animate);
    };

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const key = `${user.email.trim().toLowerCase()}-${user.phone.trim()}`;
        const storedResult = localStorage.getItem(key);

        if (!hasSpun && !storedResult) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
            if (dist <= 60) {
                spin();
            }
        } else if (storedResult) {
            onResult(storedResult);
        }
    };

    return (
        <div className="wheel-container">
            <div className="needle" />
            <canvas
                ref={canvasRef}
                width={620}
                height={620}
                className="wheel-canvas"
                onClick={handleClick}
            />
        </div>
    );
};

export default Wheel;
