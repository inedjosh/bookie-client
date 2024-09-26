import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { IoIosCloudUpload } from "react-icons/io";
import { ClipLoader } from "react-spinners";
import { Typography } from "../../Typography";

const uploadStyles = cva("border border-input  cursor-pointer", {
  variants: {
    type: {
      image: "w-[150px] h-[150px] flex items-center justify-center",
      document: "w-full h-[58px] flex items-center justify-center",
    },
  },
  defaultVariants: {
    type: "image",
  },
});

type UploadComponentProps = VariantProps<typeof uploadStyles> & {
  onUpload: (file: File) => void;
  currentFile?: string;
  loadingImage?: boolean;
  loadingDocument?: boolean;
  documentName?: string;
};

const UploadFile: React.FC<UploadComponentProps> = ({
  type,
  onUpload,
  currentFile,
  loadingImage,
  loadingDocument,
  documentName,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="upload-container">
      {type === "image" ? (
        loadingImage ? (
          <div className="flex items-center justify-center w-[150px] h-[150px] border">
            <ClipLoader color="#5b32e5" size="20px" />
          </div>
        ) : (
          <div className={uploadStyles({ type })}>
            <label className="w-[150px] h-[150px] flex items-center justify-center">
              {currentFile ? (
                <img
                  src={currentFile}
                  alt="Uploaded"
                  className="h-full w-full object-cover"
                />
              ) : (
                <IoIosCloudUpload size={40} />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        )
      ) : type === "document" ? (
        loadingDocument ? (
          <div className="flex items-center justify-center w-full h-[58px] border">
            <ClipLoader color="#5b32e5" size="20px" />
          </div>
        ) : documentName ? (
          <div className={uploadStyles({ type })}>
            <label className="w-full">
              <Typography variant="caption" className="mr-2 pl-3">
                {documentName}
              </Typography>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        ) : (
          <div className={uploadStyles({ type })}>
            <label className="w-full flex items-center ">
              <Typography variant="caption" className="mr-2 pl-3">
                Upload Document
              </Typography>
              <IoIosCloudUpload size={24} />
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        )
      ) : null}
    </div>
  );
};

export default UploadFile;
