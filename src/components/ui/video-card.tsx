"use client"

import { useState, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoCardProps {
  src: string
  poster?: string
  alt?: string
  className?: string
  aspectRatio?: "video" | "square" | "portrait"
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  showControls?: boolean
  overlay?: React.ReactNode
  onClick?: () => void
}

export function VideoCard({
  src,
  poster,
  alt,
  className,
  aspectRatio = "video",
  autoPlay = false,
  muted = true,
  loop = true,
  showControls = true,
  overlay,
  onClick,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [isHovered, setIsHovered] = useState(false)
  const [hasError, setHasError] = useState(false)

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
  }

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch(() => {})
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <div
      className={cn(
        "relative group overflow-hidden rounded-xl bg-black video-card cursor-pointer",
        aspectClasses[aspectRatio],
        className
      )}
      onMouseEnter={() => {
        setIsHovered(true)
        if (videoRef.current) {
          videoRef.current.play().catch(() => {})
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        if (videoRef.current) {
          videoRef.current.pause()
          videoRef.current.currentTime = 0
          setIsPlaying(false)
        }
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick?.()
        }
      }}
      aria-label={alt || "Video card"}
    >
      {/* Poster Image (always visible behind video) */}
      {poster && (
        <img
          src={poster}
          alt={alt || ""}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            isPlaying ? "opacity-0" : "opacity-100"
          )}
        />
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        muted={isMuted}
        loop={loop}
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
      />

      {/* Loading / Error State */}
      {hasError && poster && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <img src={poster} alt={alt || ""} className="w-full h-full object-cover opacity-50" />
        </div>
      )}

      {/* Play Button (when paused) */}
      {!isPlaying && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg transition-transform hover:scale-110">
            <Play className="h-7 w-7 text-white ml-1" fill="white" />
          </div>
        </div>
      )}

      {/* Hover Border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-gold/50 transition-colors duration-300 pointer-events-none" />

      {/* Overlay Content */}
      {overlay && (
        <div className="absolute inset-0 flex items-end p-4">
          {overlay}
        </div>
      )}

      {/* Video Controls */}
      {showControls && isHovered && !hasError && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                togglePlay()
              }}
              className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center hover:bg-black transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-white" />
              ) : (
                <Play className="h-4 w-4 text-white ml-0.5" fill="white" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleMute()
              }}
              className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center hover:bg-black transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-white" />
              ) : (
                <Volume2 className="h-4 w-4 text-white" />
              )}
            </button>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              videoRef.current?.requestFullscreen()
            }}
            className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center hover:bg-black transition-colors"
            aria-label="Fullscreen"
          >
            <Maximize2 className="h-4 w-4 text-white" />
          </button>
        </div>
      )}
    </div>
  )
}
