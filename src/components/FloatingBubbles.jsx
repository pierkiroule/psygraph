// src/components/FloatingBubbles.jsx
export default function FloatingBubbles() {
  const bubbles = Array.from({ length: 10 });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {bubbles.map((_, i) => {
        const size = 40 + Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = 20 + Math.random() * 30;
        const x = Math.random() * 100;

        return (
          <span
            key={i}
            style={{
              position: "absolute",
              bottom: `-${size}px`,
              left: `${x}%`,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: "50%",
              background: "rgba(165,200,255,0.25)",
              filter: "blur(8px)",
              animation: `bubbleMove ${duration}s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
      <style>
        {`
          @keyframes bubbleMove {
            0% {
              transform: translateY(0) translateX(0) scale(1);
              opacity: 0.3;
            }
            50% {
              transform: translateY(-50vh) translateX(20px) scale(1.1);
              opacity: 0.5;
            }
            100% {
              transform: translateY(-100vh) translateX(-20px) scale(1);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
}