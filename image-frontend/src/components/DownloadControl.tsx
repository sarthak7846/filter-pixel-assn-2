import { useContext } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DownloadControlProps } from "@/interfaces/DownloadControlProps";
import { SocketInstanceCtx } from "@/App";

export const DownloadControl: React.FC<DownloadControlProps> = ({
  imageEditingValues,
}) => {
  const socket = useContext(SocketInstanceCtx);

  const downloadHandler = (format: string) => {
    socket.emit("download", {
      ...imageEditingValues,
      format,
    });

    socket.on("final-image-data", (data) => {
      const imageBlob = new Blob(
        [Uint8Array.from(atob(data.image), (c) => c.charCodeAt(0))],
        { type: `image/${data.format}` }
      );
      const imageUrl = URL.createObjectURL(imageBlob);

      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `image.${data.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Download</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Download as</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => downloadHandler("jpg")}>
          JPEG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => downloadHandler("png")}>
          PNG
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
