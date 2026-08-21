"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from "lucide-react"
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
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [duration, setDuration] = useState("0:00")

  // Auto-play on mount for hero videos
  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    const handleCanPlay = () => {
      setIsLoaded(true)
      setIsLoading(false)
    }

    const handleLoadedMetadata = () => {
      if (video.duration) {
        const mins = Math.floor(video.duration / 60)
        const secs = Math.floor(video.duration % 60)
        setDuration(`${mins}:${secs.toString().padStart(2, "0")}`)
      }
    }

    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [src])

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handlePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
    } else {
      setIsLoading(true)
      video.play()
        .then(() => {
          setIsPlaying(true)
          setIsLoading(false)
        })
        .catch((err) => {
          console.warn("Video play failed:", err)
          setIsLoading(false)
          // Don't set error - just show poster
        })
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
    setCurrentTime(formatTime(video.currentTime))
  }, [])

  const handleFullscreen = useCallback(() => {
    const video = videoRef.current
    if (video?.requestFullscreen) {
      video.requestFullscreen()
    }
  }, [])

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video || !video.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = x / rect.width
    video.currentTime = percent * video.duration
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
      }}
    >
      {/* Poster / Thumbnail */}
      {poster && (
        <div className={cn(
          "absolute inset-0 z-0 transition-opacity duration-500",
          isLoaded && isPlaying ? "opacity-0" : "opacity-100"
        )}>
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
          "w-full h-full object-cover transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        muted={isMuted}
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false)
          setProgress(0)
          setCurrentTime("0:00")
        }}
        onError={() => setHasError(true)}
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

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30">
          <Loader2 className="h-10 w-10 text-gold animate-spin" />
        </div>
      )}

      {/* Default Play Button (when paused and not hovering) */}
      {!isPlaying && !showControls && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button
            onClick={handlePlay}
            className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center hover:bg-red-500 hover:scale-110 transition-all shadow-lg shadow-red-600/30"
            aria-label="Play video"
          >
            <Play className="h-7 w-7 text-white ml-1" fill="white" />
          </button>
        </div>
      )}

      {/* Hover Controls */}
      {showControls && !isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col justify-end">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          {/* Top: Play/Pause big button */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlay}
                className="w-20 h-20 rounded-full bg-red-600/80 flex items-center justify-center hover:bg-red-500 hover:scale-110 transition-all shadow-xl"
                aria-label="Play video"
              >
                <Play className="h-9 w-9 text-white ml-1" fill="white" />
              </button>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="relative z-20 p-3 space-y-2">
            {/* Progress Bar - Clickable */}
            <div
              className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer group/progress"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-75 group-hover/progress:h-2.5"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlay}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-500 transition-colors flex-shrink-0"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5 text-white" fill="white" />
                ) : (
                  <Play className="h-3.5 w-3.5 text-white ml-0.5" fill="white" />
                )}
              </button>

              <button
                onClick={handleMute}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="h-3.5 w-3.5 text-white" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5 text-white" />
                )}
              </button>

              {/* Time */}
              <span className="text-xs text-white/70 flex-shrink-0">
                {currentTime} / {duration}
              </span>

              <div className="flex-1" />

              <button
                onClick={handleFullscreen}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
                aria-label="Fullscreen"
              >
                <Maximize className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
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
