import Image from "next/image";
import { useCallback, useEffect, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import axios from "axios";
import { getAuth } from "@/services/auth";
import { CloudUpload, X, RefreshCw } from "lucide-react";
import ConfirmModal from "@/components/datadisplay/ConfirmModal";

export type DropZoneProps = {
  maxSize?: number;
  isDisable?: boolean;
  isMulti?: boolean;
  type: "image" | "video" | "docs";
  title?: string;
  maxUploads?: number;
  onUrlChange?: (fileIds: string[]) => void;
  urls: string[] | null; //useful to reset the files from parent if urls removed
  errorMessage?: string | string[];
};

type FileWithProgress = {
  file: File;
  preview: string;
  progress: number;
  id?: string;
  error?: boolean;
  cancelTokenSource?: any;
};

function DropZone({
  maxSize,
  isDisable = false,
  isMulti = false,
  type = "image",
  title = "آپلود",
  maxUploads = 5,
  urls,
  onUrlChange,
  errorMessage,
}: DropZoneProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [fileToRemove, setFileToRemove] = useState<string | null>(null);
  const uploadingFilesRef = useRef<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (urls === null || urls?.length === 0) {
      setFiles([]);
    }
  }, [urls]);

  const uploadFile = async (file: FileWithProgress) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file.file);

    const cancelTokenSource = axios.CancelToken.source();
    file.cancelTokenSource = cancelTokenSource;

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_API + "/admin-panel/upload-temp",
        formData,
        {
          headers: {
            Authorization: `Bearer ${getAuth.session().token}`,
          },
          cancelToken: cancelTokenSource.token,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              setFiles((prevFiles) =>
                prevFiles.map((f) =>
                  f.file.name === file.file.name ? { ...f, progress } : f,
                ),
              );
            }
          },
        },
      );

      const fileId = response?.data?.data;
      setFiles((prevFiles) => {
        const updatedFiles = prevFiles.map((f) =>
          f.file.name === file.file.name
            ? { ...f, id: fileId, error: false }
            : f,
        );
        onUrlChange?.(
          updatedFiles.map((f) => f.id).filter(Boolean) as string[],
        );
        return updatedFiles;
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.error("Upload canceled", error.message);
      } else {
        toast.error("خطا در آپلود فایل");
        console.error(error);
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.file.name === file.file.name ? { ...f, error: true } : f,
          ),
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const retryUpload = (file: FileWithProgress) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) =>
        f.file.name === file.file.name
          ? { ...f, error: false, progress: 0 }
          : f,
      ),
    );
    uploadFile(file);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (isUploading) {
        toast.error("لطفاً تا پایان آپلود فایل قبلی صبر کنید.");
        return;
      }

      if (acceptedFiles?.length) {
        if (files.length >= maxUploads) {
          toast.error(`شما فقط می توانید ${maxUploads} فایل آپلود کنید.`);
          return;
        }

        const duplicateFiles = acceptedFiles.filter((file) =>
          files.some((f) => f.file.name === file.name),
        );

        if (duplicateFiles.length > 0) {
          toast.error("شما نمی توانید فایل تکراری آپلود کنید.");
          return;
        }

        if (!isMulti && files.length > 0) {
          toast.error(
            "لطفاً فایل قبلی را حذف کنید قبل از اینکه فایل جدیدی اضافه کنید.",
          );
        } else {
          const newFiles = acceptedFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            error: false,
          }));

          setFiles((previousFiles) => {
            const updatedFiles = [...previousFiles, ...newFiles];

            newFiles.forEach((file) => {
              if (!uploadingFilesRef.current.has(file.file.name)) {
                uploadingFilesRef.current.add(file.file.name);
                uploadFile(file).finally(() => {
                  uploadingFilesRef.current.delete(file.file.name);
                });
              }
            });

            return updatedFiles;
          });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMulti, files, onUrlChange, maxUploads, isUploading],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    disabled: isDisable,
    multiple: isMulti,
    accept:
      type === "image"
        ? {
            "image/png": [".png"],
            "image/jpg": [".jpg"],
            "image/jpeg": [".jpeg"],
          }
        : type === "video"
          ? {
              "image/mp4": [".mp4"],
              "image/mkv": [".mkv"],
            }
          : type === "docs"
            ? {
                "image/png": [".png"],
                "image/jpg": [".jpg"],
                "image/jpeg": [".jpeg"],
                "image/pdf": [".pdf"],
              }
            : undefined,
    onDrop,
  });

  const handleRemoveFile = (name: string) => {
    setFiles((files) => {
      const updatedFiles = files.filter((file) => file.file.name !== name);
      if (onUrlChange)
        onUrlChange(
          updatedFiles.filter((file) => file.id).map((file) => file.id!),
        );
      return updatedFiles;
    });
  };

  const acceptedFilesCard = () => (
    <ul className="mt-4 flex flex-col gap-3">
      {files?.map((file, i) => (
        <div key={file.file.name}>
          <li
            className={`relative h-[80px] rounded-[8px] border-1.5 border-dashed bg-boxBg200 ${file.error ? "border-red-500" : "border-border2"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full items-center justify-between px-[22px]">
              <div className="flex items-center gap-[14px]">
                {type === "image" ||
                (type === "docs" && !file.file.name.endsWith(".pdf")) ? (
                  <>
                    <Image
                      src={file.preview}
                      alt={file.file.name}
                      width={50}
                      height={80}
                      onLoad={() => {
                        URL.revokeObjectURL(file.preview);
                      }}
                    />
                    <p className="text-textColorLow font-[500]">
                      {file.file.name}
                    </p>
                  </>
                ) : type === "video" ? (
                  <>
                    <div>
                      <Image
                        src="/images/videoFile.png"
                        alt="video"
                        width={50}
                        height={50}
                      />
                    </div>
                    <p className="text-textColorLow font-[500]">
                      {file.file.name}
                    </p>
                  </>
                ) : file.file.name.endsWith(".pdf") ? (
                  <>
                    <Image
                      src="/images/pdf.png"
                      alt="PDF"
                      width={50}
                      height={50}
                    />
                    <p className="text-textColorLow font-[500]">
                      {file.file.name}
                    </p>
                  </>
                ) : null}
              </div>
              <div className="flex items-center gap-[14px]">
                <p className="text-textColorLow font-[500]">{file.progress}%</p>
                {file.error && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      retryUpload(file);
                    }}
                  >
                    <RefreshCw className="h-[18px] w-[14px] text-TextColor" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileToRemove(file.file.name);
                    setIsConfirmModalOpen(true);
                  }}
                >
                  <X className="h-[18px] w-[14px] text-TextColor" />
                </button>
              </div>
            </div>
          </li>
          {typeof errorMessage === "object" && errorMessage?.[i] && (
            <p className="text-destructive-foreground">{errorMessage[i]}</p>
          )}
        </div>
      ))}
    </ul>
  );

  return (
    <section>
      {title && (
        <h2 className="mt-4 text-TextSize400 text-TextColor">{title}</h2>
      )}
      <div
        className={`border-offset-2 relative mt-2 min-h-[180px] w-full place-content-center rounded-[8px] border-2 border-dashed bg-boxBg300 p-3 ${isDragActive ? "border-primary" : "border-border"}`}
      >
        <div
          {...getRootProps({
            className:
              "dropzone disabled grid place-content-center gap-2 text-center",
          })}
        >
          <input {...getInputProps()} />
          <div className="flex justify-center">
            <CloudUpload className="text-TextColor" />
          </div>
          <p className="text-TextSize400 text-TextLow">
            برای آپلود کلیک کنید یا بکشید و رها کنید
          </p>
          <p className="text-TextSize300 text-TextLow">
            پسوندهای مجاز:{" "}
            {type === "video"
              ? "mp4, mkv"
              : type === "image"
                ? "jpeg, jpg, png"
                : type === "docs"
                  ? "jpeg, jpg, png, pdf"
                  : null}
          </p>
          {maxSize && (
            <p className="text-TextSize300 text-TextLow">
              حداکثر اندازه: {maxSize}Mb - حداکثر تعداد: {maxUploads}
            </p>
          )}
        </div>
      </div>
      {acceptedFilesCard()}
      {errorMessage && typeof errorMessage === "string" && (
        <p className="text-destructive-foreground">{errorMessage}</p>
      )}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onOpenChange={() => setIsConfirmModalOpen(false)}
        confirmText="آیا مطمئن هستید که می‌خواهید این فایل را حذف کنید؟"
        confirmAction={() => {
          if (fileToRemove) {
            const file = files.find((f) => f.file.name === fileToRemove);
            if (file?.cancelTokenSource) {
              file.cancelTokenSource.cancel("Upload canceled by user.");
            }
            handleRemoveFile(fileToRemove);
            setFileToRemove(null);
          }
        }}
        size="sm"
        onClose={() => setIsConfirmModalOpen(false)}
      />
    </section>
  );
}

export default DropZone;
