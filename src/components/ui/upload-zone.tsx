"use client"

import { useState, useRef, useCallback } from "react"
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  FileImage,
  FileVideo,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadFile {
  id: string
  file: File
  preview?: string
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  error?: string
  url?: string
  key?: string
}

interface UploadZoneProps {
  type: "image" | "video"
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // bytes
  onFilesChange?: (files: UploadFile[]) => void
  onUploadComplete?: (file: { url: string; key: string; filename: string }[]) => void
  className?: string
  carId?: string
}

export function UploadZone({
  type,
  accept,
  multiple = false,
  maxFiles = 10,
  maxSize,
  onFilesChange,
  onUploadComplete,
  className,
  carId,
}: UploadZoneProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const defaultAccept = type === "image"
    ? "image/jpeg,image/png,image/webp,image/avif"
    : "video/mp4,video/quicktime,video/webm"
  const defaultMaxSize = type === "image" ? 10 * 1024 * 1024 : 500 * 1024 * 1024

  const handleFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles)
      const validFiles: UploadFile[] = []

      for (const file of fileArray) {
        if (files.length + validFiles.length >= maxFiles) {
          break
        }

        const size = maxSize || defaultMaxSize
        if (file.size > size) {
          validFiles.push({
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            file,
            progress: 0,
            status: "error",
            error: `File too large. Max size: ${Math.round(size / 1024 / 1024)}MB`,
          })
          continue
        }

        const uploadFile: UploadFile = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          preview: type === "image" ? URL.createObjectURL(file) : undefined,
          progress: 0,
          status: "pending",
        }
        validFiles.push(uploadFile)
      }

      const updatedFiles = [...files, ...validFiles]
      setFiles(updatedFiles)
      onFilesChange?.(updatedFiles)

      // Start uploading pending files
      for (const uploadFile of validFiles) {
        if (uploadFile.status === "pending") {
          uploadFileToS3(uploadFile, updatedFiles)
        }
      }
    },
    [files, maxFiles, type, maxSize, defaultMaxSize, onFilesChange]
  )

  const uploadFileToS3 = async (uploadFile: UploadFile, currentFiles: UploadFile[]) => {
    // Update status to uploading
    const updateFile = (updates: Partial<UploadFile>) => {
      setFiles((prev) => {
        const updated = prev.map((f) =>
          f.id === uploadFile.id ? { ...f, ...updates } : f
        )
        onFilesChange?.(updated)
        return updated
      })
    }

    updateFile({ status: "uploading", progress: 0 })

    try {
      // Step 1: Get presigned URL
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: uploadFile.file.name,
          contentType: uploadFile.file.type,
          type,
          carId,
        }),
      })

      if (!presignRes.ok) {
        const err = await presignRes.json()
        throw new Error(err.error || "Failed to get upload URL")
      }

      const { data } = await presignRes.json()

      // Step 2: Upload directly to S3 with progress tracking
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          updateFile({ progress })
        }
      })

      const uploadPromise = new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`))
          }
        }
        xhr.onerror = () => reject(new Error("Upload failed"))
        xhr.open("PUT", data.uploadUrl)
        xhr.setRequestHeader("Content-Type", uploadFile.file.type)
        xhr.send(uploadFile.file)
      })

      await uploadPromise

      // Step 3: Confirm upload
      await fetch("/api/upload/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: data.key,
          carId,
          type,
          alt: uploadFile.file.name,
          isPrimary: currentFiles.length === 0,
        }),
      })

      updateFile({
        status: "success",
        progress: 100,
        url: data.publicUrl,
        key: data.key,
      })

      onUploadComplete?.([
        { url: data.publicUrl, key: data.key, filename: uploadFile.file.name },
      ])
    } catch (error) {
      updateFile({
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      })
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id)
      onFilesChange?.(updated)
      return updated
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/50"
        )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        aria-label={`Upload ${type} files`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept || defaultAccept}
          multiple={multiple}
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files)
            e.target.value = ""
          }}
          className="hidden"
          aria-hidden="true"
        />

        <div className="flex flex-col items-center gap-3">
          {type === "video" ? (
            <FileVideo className="h-10 w-10 text-slate-500" />
          ) : (
            <FileImage className="h-10 w-10 text-slate-500" />
          )}
          <div>
            <p className="text-sm text-slate-300">
              {isDragging ? (
                "Drop files here"
              ) : (
                <>
                  <span className="text-blue-400 font-medium">Click to upload</span>{" "}
                  or drag and drop
                </>
              )}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {type === "image"
                ? "JPG, PNG, WebP up to 10MB"
                : "MP4, MOV, WebM up to 500MB"}
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((uploadFile) => (
            <div
              key={uploadFile.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                uploadFile.status === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : uploadFile.status === "error"
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-slate-800/50 border-slate-700"
              )}
            >
              {/* Preview */}
              {uploadFile.preview ? (
                <img
                  src={uploadFile.preview}
                  alt={uploadFile.file.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                  <FileVideo className="h-5 w-5 text-slate-400" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{uploadFile.file.name}</p>
                <p className="text-xs text-slate-400">
                  {(uploadFile.file.size / 1024 / 1024).toFixed(1)} MB
                </p>

                {/* Progress Bar */}
                {uploadFile.status === "uploading" && (
                  <div className="mt-1.5 w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${uploadFile.progress}%` }}
                    />
                  </div>
                )}

                {/* Error */}
                {uploadFile.status === "error" && uploadFile.error && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {uploadFile.error}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                {uploadFile.status === "uploading" && (
                  <span className="text-xs text-blue-400">{uploadFile.progress}%</span>
                )}
                {uploadFile.status === "success" && (
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                )}
                {uploadFile.status === "uploading" && (
                  <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
                )}
                <button
                  onClick={() => removeFile(uploadFile.id)}
                  className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  aria-label={`Remove ${uploadFile.file.name}`}
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
