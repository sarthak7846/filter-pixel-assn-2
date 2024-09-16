import { createContext, useEffect, useState } from "react";
import "./App.css";
import { ImagePreviewer } from "./components/ImagePreviewer";
import { ImageUpload } from "./components/ImageUpload";
import { io } from "socket.io-client";
import { EditingTools } from "./components/EditingTools";
import { DownloadControl } from "./components/DownloadControl";
import { ImageEditingValues } from "./interfaces/ImageEditingValues";
import { Loader2 } from "lucide-react";

const BASE_URL = "http://localhost:8000";
const socket = io(BASE_URL);

export const SocketInstanceCtx = createContext(socket);
export const ImagePreviewCtx = createContext<string | null>(null);

function App() {
  const [parentImagePreviewBase64, setParentImagePreviewBase64] = useState<
    string | null
  >(null);
  const [imageEditingValues, setImageEditingValues] =
    useState<ImageEditingValues>({
      brightness: 1,
      contrast: 1,
      saturation: 1,
      degree: 0,
    });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    socket.on("image-preview", (data) => {
      setIsUploading(false);
      if (data.previewBase64) {
        setParentImagePreviewBase64(data.previewBase64);
      } else if (data.modifiedImageBase64) {
        setParentImagePreviewBase64(data.modifiedImageBase64);
      }
    });

    return () => {
      socket.off("image-preview");
    };
  }, []);

  return (
    <SocketInstanceCtx.Provider value={socket}>
      <ImageUpload isUploading={isUploading} setIsUploading={setIsUploading} />
      {parentImagePreviewBase64 && (
        <>
          {isUploading ? (
            <Loader2 className="animate-spin spinner" />
          ) : (
            <>
              <div className="preview-and-controls">
                <ImagePreviewCtx.Provider value={parentImagePreviewBase64}>
                  <ImagePreviewer />
                  <EditingTools setImageEditingValues={setImageEditingValues} />
                </ImagePreviewCtx.Provider>
              </div>
              <div className="download-btn">
                <DownloadControl imageEditingValues={imageEditingValues} />
              </div>
            </>
          )}
        </>
      )}
    </SocketInstanceCtx.Provider>
  );
}

export default App;
