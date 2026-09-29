"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function ZoomHover({ imageURL }: { imageURL: string }) {
  const imageElement = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const element = imageElement.current;
    if (element == null) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      const posX = ((e.clientX - left) / width) * 100;
      const posY = ((e.clientY - top) / height) * 100;
      setPosition({ x: posX, y: posY });
    };
    const handleMouseIn = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseenter", handleMouseIn);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseenter", handleMouseIn);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [imageElement]);

  return (
    <div
      ref={imageElement}
      className="relative hover:cursor-none flex-1 aspect-square self-center"
    >
      <Image src={imageURL} fill alt="image" />
      {isHovering && (
        <div
          style={{
            left: `${position.x}%`,
            top: ` ${position.y}%`,
            backgroundImage: `url(${imageURL})`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundSize: isHovering ? "500%" : "cover",
          }}
          className="size-40 bg-black absolute pointer-events-none translate-[-50%]"
        />
      )}
    </div>
  );
}
