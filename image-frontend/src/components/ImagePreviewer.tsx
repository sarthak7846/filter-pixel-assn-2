import { ImagePreviewCtx } from "@/App";
import React, { useContext } from "react";

export const ImagePreviewer: React.FC = () => {
  const previewBase64 = useContext(ImagePreviewCtx);

  return (
    <div className="imagePrv">
      <h3 className="image-prev-heading">Image Preview</h3>
      <img
        className="responsive-img"
        src={`data:image/png;base64,${previewBase64}`}
        alt="Preview"
      />
    </div>
  );
};
