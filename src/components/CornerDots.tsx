"use client";

interface CornerDotsProps {
  className?: string;
}

export default function CornerDots({ className = "" }: CornerDotsProps) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <div className="grid grid-cols-4 gap-[3px]">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="w-[2px] h-[2px] rounded-full bg-[#CCCCCC]"
          />
        ))}
      </div>
    </div>
  );
}
