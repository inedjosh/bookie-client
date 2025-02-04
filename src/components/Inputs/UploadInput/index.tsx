import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { IoIosCloudUpload } from "react-icons/io";
import { ClipLoader } from "react-spinners";
import { Typography } from "../../Typography";
import { GrCloudUpload } from "react-icons/gr";

const uploadStyles = cva(
  "border-dashed border bg-[#EBEDF5] rounded-[32px] border-[#8A95C3]  cursor-pointer",
  {
    variants: {
      type: {
        image:
          "w-[150px] h-[150px] rounded-[32px] flex items-center justify-center",
        document:
          "w-full h-[250px] rounded-[32px] flex items-center justify-center",
      },
    },
    defaultVariants: {
      type: "image",
    },
  }
);

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
          <div className={uploadStyles({ type })}>
            <div className="w-full justify-center flex-col flex items-center ">
              <ClipLoader color="#5b32e5" size="20px" />
              <Typography variant="body" className="mr-2 pl-3">
                Uploading document{" "}
              </Typography>
            </div>
          </div>
        ) : documentName ? (
          <div className={uploadStyles({ type })}>
            <label className="w-full justify-center flex-col flex items-center ">
              <div className="bg-white rounded-full w-[60px] h-[60px] flex justify-center items-center">
                <GrCloudUpload size={20} className="text-blackText" />
              </div>{" "}
              <Typography variant="body" className="mr-2 mt-2 pl-3">
                <strong> {documentName}</strong>
              </Typography>
              <input
                type="file"
                accept=".zip,.pdf,.csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        ) : (
          <div className={uploadStyles({ type })}>
            <label className="w-full justify-center flex-col flex items-center ">
              <div className="bg-white rounded-full w-[60px] h-[60px] flex justify-center items-center">
                <GrCloudUpload size={20} className="text-blackText" />
              </div>{" "}
              <Typography
                variant="subheading"
                as="h3"
                className="mr-2 mt-5 pl-3"
              >
                Upload Document (PDF, CSV or ZIP)
              </Typography>
              <Typography
                variant="caption"
                className="mr-2 pl-3 text-muted-alt"
              >
                Click to select file from drive{" "}
              </Typography>
              <input
                type="file"
                accept=".zip,.pdf,.csv"
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
