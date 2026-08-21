"use client"

import { useState, useRef, useCallback } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoCardProps {
  src: string
  poster?: string
  alt?: string
  className?: string
  aspectRatio?: "video" | "square"
  overlay?: React.ReactNode
}

export function VideoCard({
  src,
  poster,
  alt,
  className,
  aspectRatio = "video",
  overlay,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [showControls, setShowControls] = useState(false)

  const handlePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
    } else {
      video.play().then(() => setIsPlaying(true)).catch(() => setHasError(true))
    }
  }, [isPlaying])

  const handleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(!isMuted)
  }, [isMuted])

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video || !video.duration) return
    setProgress((video.currentTime / video.duration) * 100)
  }, [])

  const handleFullscreen = useCallback(() => {
    const video = videoRef.current
    if (video?.requestFullscreen) {
      video.requestFullscreen()
    }
  }, [])

  return (
    <div
      className={cn(
        "relative group overflow-hidden rounded-xl bg-black border border-neutral-800",
        aspectRatio === "video" ? "aspect-video" : "aspect-square",
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        setShowControls(false)
        if (videoRef.current && isPlaying) {
          videoRef.current.pause()
          setIsPlaying(false)
          videoRef.current.currentTime = 0
        }
      }}
    >
      {/* Poster / Thumbnail */}
      {poster && !isLoaded && (
        <div className="absolute inset-0 z-0">
          <img
            src={poster}
            alt={alt || "Video thumbnail"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        poster={poster}
        muted={isMuted}
        playsInline
        preload="metadata"
        onLoadedData={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false)
          setProgress(0)
        }}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Error Fallback */}
      {hasError && poster && (
        <div className="absolute inset-0 z-0">
          <img
            src={poster}
            alt={alt || "Video unavailable"}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Default Play Button (when paused) */}
      {!isPlaying && !showControls && isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button
            onClick={handlePlay}
            className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center hover:bg-red-500 transition-colors"
            aria-label="Play video"
          >
            <Play className="h-7 w-7 text-white ml-1" fill="white" />
          </button>
        </div>
      )}

      {/* Hover Controls */}
      {showControls && isLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col justify-end">
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Control Buttons */}
          <div className="relative z-20 p-3 flex items-center gap-2">
            <button
              onClick={handlePlay}
              className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-500 transition-colors flex-shrink-0"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-white" fill="white" />
              ) : (
                <Play className="h-4 w-4 text-white ml-0.5" fill="white" />
              )}
            </button>

            <button
              onClick={handleMute}
              className="w-9 h-9 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors flex-shrink-0"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-white" />
              ) : (
                <Volume2 className="h-4 w-4 text-white" />
              )}
            </button>

            {/* Progress Bar */}
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden mx-2">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            <button
              onClick={handleFullscreen}
              className="w-9 h-9 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors flex-shrink-0"
              aria-label="Fullscreen"
            >
              <Maximize className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Overlay Content */}
      {overlay && (
        <div className="absolute top-3 left-3 right-3 z-20">
          {overlay}
        </div>
      )}
    </div>
  )
}
