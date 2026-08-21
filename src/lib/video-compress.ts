// Browser-side video compression using MediaRecorder API
// Reduces file size by lowering resolution and bitrate

interface CompressOptions {
  maxWidth?: number
  maxHeight?: number
  videoBitrate?: number
  audioBitrate?: number
  frameRate?: number
}

const DEFAULT_OPTIONS: CompressOptions = {
  maxWidth: 1280,
  maxHeight: 720,
  videoBitrate: 2_000_000, // 2 Mbps
  audioBitrate: 128_000, // 128 kbps
  frameRate: 30,
}

export function getVideoInfo(file: File): Promise<{
  width: number
  height: number
  duration: number
  size: number
}> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.preload = "metadata"
    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
        size: file.size,
      })
      URL.revokeObjectURL(video.src)
    }
    video.onerror = reject
    video.src = URL.createObjectURL(file)
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

// Check if video needs compression
export function needsCompression(file: File, maxSizeMB: number = 50): boolean {
  return file.size > maxSizeMB * 1024 * 1024
}

// Calculate optimal settings based on file size
function getOptimalSettings(fileSize: number): CompressOptions {
  const sizeMB = fileSize / (1024 * 1024)

  if (sizeMB > 200) {
    return { maxWidth: 854, maxHeight: 480, videoBitrate: 1_000_000, frameRate: 24 }
  } else if (sizeMB > 100) {
    return { maxWidth: 1280, maxHeight: 720, videoBitrate: 1_500_000, frameRate: 24 }
  } else if (sizeMB > 50) {
    return { maxWidth: 1280, maxHeight: 720, videoBitrate: 2_000_000, frameRate: 30 }
  }
  return { maxWidth: 1920, maxHeight: 1080, videoBitrate: 3_000_000, frameRate: 30 }
}

// Compress video using MediaRecorder API
export async function compressVideo(
  file: File,
  options?: CompressOptions,
  onProgress?: (progress: number) => void
): Promise<{ blob: Blob; width: number; height: number }> {
  const optimal = getOptimalSettings(file.size)
  const opts = { ...optimal, ...options }

  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.preload = "auto"
    video.muted = true

    video.onloadedmetadata = () => {
      const { videoWidth, videoHeight, duration } = video

      // Calculate new dimensions
      let newWidth = videoWidth
      let newHeight = videoHeight

      if (videoWidth > opts.maxWidth!) {
        const ratio = opts.maxWidth! / videoWidth
        newWidth = opts.maxWidth!
        newHeight = Math.round(videoHeight * ratio)
      }

      if (newHeight > opts.maxHeight!) {
        const ratio = opts.maxHeight! / newHeight
        newHeight = opts.maxHeight!
        newWidth = Math.round(newWidth * ratio)
      }

      // Ensure even dimensions (required by most codecs)
      newWidth = newWidth % 2 === 0 ? newWidth : newWidth + 1
      newHeight = newHeight % 2 === 0 ? newHeight : newHeight + 1

      // Create canvas for frame capture
      const canvas = document.createElement("canvas")
      canvas.width = newWidth
      canvas.height = newHeight
      const ctx = canvas.getContext("2d")!

      // Setup MediaRecorder
      const stream = canvas.captureStream(opts.frameRate)

      // Try to capture audio
      let combinedStream = stream
      try {
        const audioCtx = new AudioContext()
        const source = audioCtx.createMediaElementSource(video)
        const dest = audioCtx.createMediaStreamDestination()
        source.connect(dest)
        source.connect(audioCtx.destination)
        combinedStream = new MediaStream([
          ...stream.getVideoTracks(),
          ...dest.stream.getAudioTracks(),
        ])
      } catch {
        // Audio capture might fail, continue without audio
      }

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
          ? "video/webm;codecs=vp8"
          : "video/webm"

      const recorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: opts.videoBitrate,
      })

      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" })
        resolve({ blob, width: newWidth, height: newHeight })
        URL.revokeObjectURL(video.src)
      }

      recorder.onerror = reject

      // Start recording
      recorder.start()

      // Play video and capture frames
      video.play()

      const drawFrame = () => {
        if (video.ended || video.paused) {
          recorder.stop()
          return
        }

        ctx.drawImage(video, 0, 0, newWidth, newHeight)

        // Report progress
        if (onProgress && duration > 0) {
          onProgress(Math.round((video.currentTime / duration) * 100))
        }

        requestAnimationFrame(drawFrame)
      }

      video.onplay = () => {
        drawFrame()
      }

      // Limit recording to prevent infinite loops
      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop()
          video.pause()
        }
      }, (duration + 5) * 1000)
    }

    video.onerror = reject
    video.src = URL.createObjectURL(file)
  })
}

// Generate thumbnail from video
export async function generateThumbnail(
  file: File,
  timeInSeconds: number = 1
): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.preload = "metadata"
    video.currentTime = timeInSeconds

    video.onloadeddata = () => {
      const canvas = document.createElement("canvas")
      canvas.width = 640
      canvas.height = 360
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(video, 0, 0, 640, 360)
      const thumbnail = canvas.toDataURL("image/jpeg", 0.8)
      URL.revokeObjectURL(video.src)
      resolve(thumbnail)
    }

    video.onerror = reject
    video.src = URL.createObjectURL(file)
  })
}
