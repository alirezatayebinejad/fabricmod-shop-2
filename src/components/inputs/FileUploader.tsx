"use client";

import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import { getAuth } from "@/services/auth";
import { RotateCcw, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useDisclosure } from "@heroui/modal";
import ConfirmModal from "@/components/datadisplay/ConfirmModal";

type FileUploaderProps = {
  fileType: "image" | "video" | "file";
  trigger?: React.ReactElement;
  onUploadProgress?: (
    percentage: number,
    loaded: number,
    total?: number,
  ) => void;
  showUploadedSizes?: boolean;
  onSuccess?: (url: string | undefined) => void;
  onError?: (error: string) => void;
  onFilePreview?: (preview: string | null) => void;
  sizeLimit?: number; // Size limit in MB
  formatLimit?: string[]; // Allowed file formats, optional (e.g., ['image/jpeg', 'image/png'])
  apiEndpoint?: string; // API endpoint to upload the file
  errorMessage?: string;
  isDisabled?: boolean;
  titleDropZone?: string;
};

const FileUploader: React.FC<FileUploaderProps> = ({
  trigger,
  fileType,
  onUploadProgress,
  showUploadedSizes,
  onSuccess,
  onError,
  onFilePreview,
  sizeLimit = 10,
  formatLimit = fileType === "video"
    ? ["video/mp4", "video/mkv", "video/x-matroska", "video/avi", "video/webm"]
    : fileType === "image"
      ? ["image/jpeg", "image/png", "image/webp", "image/jpg"]
      : fileType === "file"
        ? ["application/pdf", "text/x-subrip", "application/x-subrip"]
        : [],
  apiEndpoint = fileType === "video"
    ? "admin-panel/upload-temp"
    : "admin-panel/upload-temp",
  errorMessage,
  isDisabled = false,
  titleDropZone = "آپلود",
}) => {
  const [uploadProgress, setUploadProgress] = useState<{
    percentage: number;
    loaded: number;
    total?: number;
  }>({ percentage: 0, loaded: 0, total: 0 });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { onOpen, isOpen, onClose, onOpenChange } = useDisclosure();
  const uploadCancelToken = useRef(axios.CancelToken.source());

  const handleErrorMessages = useCallback(
    (message: string) => {
      onError?.(message);
      setUploadError(message);
    },
    [onError],
  );

  const uploadFile = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append(fileType === "video" ? "video_file" : "file", file);

      try {
        const response = await axios.post(
          process.env.NEXT_PUBLIC_BACKEND_API + "/" + apiEndpoint,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${getAuth.session().token}`,
            },
            cancelToken: uploadCancelToken.current.token,
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1), //1 to avoid division by 0
              );
              setUploadProgress({
                percentage: progress,
                loaded: Math.floor(progressEvent.loaded / (1024 * 1024)), // Convert to MB and round down
                total: progressEvent.total
                  ? Math.floor(progressEvent.total / (1024 * 1024))
                  : undefined,
              });
              onUploadProgress?.(
                progress,
                progressEvent.loaded,
                progressEvent.total || 1,
              );
            },
          },
        );

        const fileUrl = response.data?.data || undefined; // Adjusted to handle the response correctly
        onSuccess?.(fileUrl);
        handleErrorMessages("");
      } catch (error: any) {
        if (axios.isCancel(error)) {
          handleErrorMessages("آپلود کنسل شد");
        } else {
          handleErrorMessages(
            error?.response?.data?.message[
              fileType === "video" ? "video_file" : "file"
            ] || "آپلود ناموفق.",
          );
        }
        setUploadProgress({ percentage: 0, loaded: 0, total: 0 });
      }
    },
    [fileType, onUploadProgress, onSuccess, apiEndpoint, handleErrorMessages],
  );

  const handleFileSelection = useCallback(
    async (selectedFile: File) => {
      if (isDisabled) return;

      handleErrorMessages("");

      if (!selectedFile) return;

      // Cancel the previous upload if a new file is selected
      if (uploadCancelToken.current) {
        uploadCancelToken.current.cancel("New file selected");
        uploadCancelToken.current = axios.CancelToken.source();
      }

      setFile(selectedFile);

      // File preview (only if the file is an image)
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onFilePreview?.(event.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        onFilePreview?.(null);
      }

      // Check file size
      if (sizeLimit && selectedFile.size > sizeLimit * 1024 * 1024) {
        handleErrorMessages(`محدودیت حجم فایل ${sizeLimit}MB.`);
        setUploadProgress({ percentage: 0, loaded: 0, total: 0 });
        return;
      }

      // Check file format
      if (formatLimit.length && !formatLimit.includes(selectedFile.type)) {
        handleErrorMessages(`فرمت های مجاز: ${formatLimit.join(", ")}.`);
        setUploadProgress({ percentage: 0, loaded: 0, total: 0 });
        return;
      }

      await uploadFile(selectedFile);
    },
    [
      isDisabled,
      formatLimit,
      handleErrorMessages,
      onFilePreview,
      sizeLimit,
      uploadFile,
    ],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      handleFileSelection(selectedFile);
    },
    [handleFileSelection],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    disabled: isDisabled,
  });

  const handleClear = () => {
    uploadCancelToken.current.cancel();
    onSuccess?.(undefined);
    setUploadProgress({ percentage: 0, loaded: 0, total: 0 });
    onFilePreview?.(null);
    handleErrorMessages("");
    setFile(null);
  };

  const handleRetry = () => {
    if (file) {
      uploadCancelToken.current = axios.CancelToken.source();
      uploadFile(file);
    }
  };

  return (
    <div>
      {trigger ? (
        <div
          {...getRootProps()}
          className={`cursor-pointer ${isDisabled || uploadProgress.percentage > 0 ? "pointer-events-none opacity-50" : ""}`}
        >
          {trigger}
          <input {...getInputProps()} />
        </div>
      ) : (
        <section className="relative mt-2 flex min-h-[226px] w-full flex-col rounded-[8px] border-1 border-border p-3">
          <h2 className="absolute -top-3 right-2 bg-boxBg100 px-1 text-TextSize300">
            {titleDropZone}
          </h2>
          <div
            {...getRootProps({
              className: `h-full flex-1 grid place-content-center gap-2 text-center cursor-pointer ${isDisabled || uploadProgress.percentage > 0 ? "pointer-events-none opacity-50" : ""}`,
            })}
          >
            <input {...getInputProps()} />
            <Image
              src={"/icons/uploadCloud.svg"}
              alt="upload"
              width={56}
              height={39}
              className="m-[0_auto]"
            />
            <p className="text-muted-foreground/50">
              برای آپلود روی فایل کلیک کنید یا به این قسمت بکشید
            </p>
            <p className="text-muted-foreground/50">
              پسوندهای مجاز:{" "}
              {formatLimit?.map((f) => f.split("/")?.[1]).join(", ")}
            </p>
            {sizeLimit && (
              <p className="text-muted-foreground/50">
                حداکثر اندازه: {sizeLimit}Mb
              </p>
            )}
          </div>
        </section>
      )}
      {(errorMessage || uploadError) && (
        <p className="text-destructive-foreground">
          {errorMessage || uploadError}
        </p>
      )}
      {/* Progress Bar */}
      {file && (
        <div className="mt-2 flex w-full flex-col items-center gap-1">
          <div className="w-full rounded bg-boxBg300">
            <div
              className="h-2 rounded bg-primary"
              style={{
                width: `${uploadProgress.percentage}%`,
                transition: "1s",
              }}
            />
          </div>
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <p className="text-TextSize300" dir="ltr">
              {showUploadedSizes
                ? uploadProgress.loaded +
                  "/" +
                  (uploadProgress.total
                    ? uploadProgress.total + " mb"
                    : "? mb") +
                  " - "
                : ""}
              {uploadProgress.percentage}%
            </p>
            <div className="flex gap-1">
              {uploadError && uploadProgress.percentage === 0 && (
                <button type="button" onClick={handleRetry}>
                  <RotateCcw className="w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onOpen();
                }}
              >
                <X className="w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        onClose={onClose}
        size="lg"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        confirmText="آیا مطمئن هستید که می‌خواهید آپلود را لغو کنید؟"
        confirmAction={handleClear}
      />
    </div>
  );
};

export default FileUploader;
