import { SocketInstanceCtx } from "@/App";
import { useContext, useState } from "react";
import { ImageUploadProps } from "@/interfaces/ImageUploadProps";

export const ImageUpload: React.FC<ImageUploadProps> = ({
  isUploading,
  setIsUploading,
}) => {
  const [selectedFile, setSelectedFile] = useState<Blob | null>(null);

  const socket = useContext(SocketInstanceCtx);

  const imageUploadHandler = () => {
    if (!selectedFile) return;
    setIsUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile); // Convert file to base64
    reader.onloadend = () => {
      const base64data = reader.result;
      if (typeof base64data === "string") {
        const base64Content = base64data.split(",")[1];

        socket.emit("upload-image", {
          base64: base64Content,
          type: selectedFile.type,
        });
      }
    };
  };

  const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const submitHandler = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    imageUploadHandler();
  };

  return (
    <div className="image-upload">
      <form onSubmit={submitHandler}>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={fileChangeHandler}
        />
        <button disabled={isUploading} className="upload-btn" type="submit">
          {isUploading ? "Uploading" : "Upload"}
        </button>
      </form>
    </div>
  );
};
