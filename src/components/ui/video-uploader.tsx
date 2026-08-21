"use client"

import { useState, useRef, useCallback } from "react"
import {
  Video,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Play,
  Link as LinkIcon,
  HardDrive,
} from "lucide-react"
import { UploadZone } from "./upload-zone"
import { cn } from "@/lib/utils"

interface UploadedVideo {
  id: string
  url: string
  key: string
  filename: string
  thumbnail?: string
  duration?: number
}

interface VideoUploaderProps {
  carId?: string
  onVideosChange?: (videos: UploadedVideo[]) => void
  maxVideos?: number
  className?: string
}

export function VideoUploader({
  carId,
  onVideosChange,
  maxVideos = 5,
  className,
}: VideoUploaderProps) {
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([])
  const [externalUrl, setExternalUrl] = useState("")
  const [urlError, setUrlError] = useState("")
  const [mode, setMode] = useState<"upload" | "url">("upload")

  const validateVideoUrl = (url: string): boolean => {
    const patterns = [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^https?:\/\/youtu\.be\/[\w-]+/,
      /^https?:\/\/(www\.)?vimeo\.com\/\d+/,
      /^https?:\/\/player\.vimeo\.com\/video\/\d+/,
    ]
    return patterns.some((p) => p.test(url))
  }

  const extractVideoId = (url: string): { platform: string; id: string } | null => {
    // YouTube
    const ytMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
    )
    if (ytMatch) return { platform: "youtube", id: ytMatch[1] }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) return { platform: "vimeo", id: vimeoMatch[1] }

    return null
  }

  const getYouTubeThumbnail = (videoId: string) =>
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  const handleAddExternalUrl = () => {
    setUrlError("")

    if (!externalUrl.trim()) {
      setUrlError("Please enter a URL")
      return
    }

    if (!validateVideoUrl(externalUrl)) {
      setUrlError("Please enter a valid YouTube or Vimeo URL")
      return
    }

    const videoInfo = extractVideoId(externalUrl)
    if (!videoInfo) {
      setUrlError("Could not extract video ID from URL")
      return
    }

    const thumbnail =
      videoInfo.platform === "youtube"
        ? getYouTubeThumbnail(videoInfo.id)
        : undefined

    const newVideo: UploadedVideo = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      url: externalUrl,
      key: `external/${videoInfo.platform}/${videoInfo.id}`,
      filename: `${videoInfo.platform}-${videoInfo.id}`,
      thumbnail,
    }

    const updated = [...uploadedVideos, newVideo]
    setUploadedVideos(updated)
    onVideosChange?.(updated)
    setExternalUrl("")
  }

  const handleUploadComplete = (
    results: { url: string; key: string; filename: string }[]
  ) => {
    const newVideos: UploadedVideo[] = results.map((r) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      url: r.url,
      key: r.key,
      filename: r.filename,
    }))

    const updated = [...uploadedVideos, ...newVideos]
    setUploadedVideos(updated)
    onVideosChange?.(updated)
  }

  const removeVideo = (id: string) => {
    const updated = uploadedVideos.filter((v) => v.id !== id)
    setUploadedVideos(updated)
    onVideosChange?.(updated)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 p-1 bg-slate-800 rounded-xl">
        <button
          onClick={() => setMode("upload")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-sm font-medium transition-colors",
            mode === "upload"
              ? "bg-blue-600 text-white"
              : "text-slate-400 hover:text-white"
          )}
        >
          <Upload className="h-4 w-4" /> Upload File
        </button>
        <button
          onClick={() => setMode("url")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-sm font-medium transition-colors",
            mode === "url"
              ? "bg-blue-600 text-white"
              : "text-slate-400 hover:text-white"
          )}
        >
          <LinkIcon className="h-4 w-4" /> Paste URL
        </button>
      </div>

      {/* Upload Mode */}
      {mode === "upload" && (
        <UploadZone
          type="video"
          multiple={uploadedVideos.length < maxVideos}
          maxFiles={maxVideos - uploadedVideos.length}
          carId={carId}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {/* URL Mode */}
      {mode === "url" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={externalUrl}
              onChange={(e) => {
                setExternalUrl(e.target.value)
                setUrlError("")
              }}
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              className="flex-1 h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddExternalUrl()
              }}
              aria-label="Video URL"
            />
            <button
              onClick={handleAddExternalUrl}
              className="h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
            >
              Add
            </button>
          </div>
          {urlError && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {urlError}
            </p>
          )}
          <p className="text-xs text-slate-500">
            Supports YouTube and Vimeo URLs
          </p>
        </div>
      )}

      {/* Uploaded Videos List */}
      {uploadedVideos.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-slate-400">
            {uploadedVideos.length} video{uploadedVideos.length !== 1 ? "s" : ""} added
          </p>
          {uploadedVideos.map((video) => (
            <div
              key={video.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700"
            >
              {/* Thumbnail */}
              <div className="w-20 h-12 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0 relative">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-5 w-5 text-slate-500" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-4 w-4 text-white" fill="white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{video.filename}</p>
                <p className="text-xs text-slate-400 truncate">{video.url}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <button
                  onClick={() => removeVideo(video.id)}
                  className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  aria-label={`Remove ${video.filename}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
