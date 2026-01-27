"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ImageModal({ images, isOpen, onClose, initialIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Always call hooks before any conditional returns
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentIndex((prev) => {
          if (!images || images.length === 0) return prev;
          return prev === 0 ? images.length - 1 : prev - 1;
        });
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentIndex((prev) => {
          if (!images || images.length === 0) return prev;
          return prev === (images.length - 1) ? 0 : prev + 1;
        });
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, images, onClose]);

  // Early return after all hooks
  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  const handlePrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 gap-0 bg-black/95">
        <DialogHeader className="sr-only">
          <DialogTitle>Event Image Viewer</DialogTitle>
        </DialogHeader>
        
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white border border-white/20"
          >
            <Icon icon="lucide:x" className="h-5 w-5" />
          </Button>

          {/* Previous Button */}
          {hasMultiple && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="absolute left-4 z-50 bg-black/50 hover:bg-black/70 text-white border border-white/20"
            >
              <Icon icon="lucide:chevron-left" className="h-6 w-6" />
            </Button>
          )}

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Image
              src={currentImage}
              alt={`Event image ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={(e) => {
                e.target.src = "/assets/images/home/event1.png";
              }}
            />
          </div>

          {/* Next Button */}
          {hasMultiple && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="absolute right-4 z-50 bg-black/50 hover:bg-black/70 text-white border border-white/20"
            >
              <Icon icon="lucide:chevron-right" className="h-6 w-6" />
            </Button>
          )}

          {/* Image Counter */}
          {hasMultiple && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium z-50">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Thumbnail Strip */}
          {hasMultiple && images.length > 1 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-50 max-w-[90%] overflow-x-auto px-4 py-2 bg-black/30 backdrop-blur-sm rounded-lg">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    index === currentIndex
                      ? "border-white scale-110"
                      : "border-white/30 hover:border-white/60 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.target.src = "/assets/images/home/event1.png";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
