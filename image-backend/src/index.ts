import sharp from "sharp";
import express from "express";
import path from "path";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const port = 8000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  let newFilePath: string = "";
  let newFolderPath: string = "";

  socket.on("upload-image", async (data) => {
    const { base64, type } = data;

    if (!base64) {
      socket.emit("error", "No image data received.");
      return;
    }

    const imgBuffer = base64ToBufferConverter(base64);
    const fileFormat = type.substring(6, type.length);

    try {
      const uniqueFolderName = uuidv4();
      if (newFolderPath === "") {
        newFolderPath = path.join(__dirname, "../imgData", uniqueFolderName);
      }

      await fs.mkdir(newFolderPath, { recursive: true });
    } catch (err) {
      console.error("Error creating folder", err);
    }

    const uniqueFileName = `image_${uuidv4()}.${fileFormat}`;
    newFilePath = path.resolve(newFolderPath, uniqueFileName);

    try {
      await sharp(imgBuffer).toFile(newFilePath);

      const previewBase64 = await createPreviewBase64(newFilePath); // Modify format as needed

      socket.emit("image-preview", {
        message: "Image uploaded",
        previewBase64,
      });
    } catch (err) {
      console.error("Error processing the uploaded image:", err);
      socket.emit("error", "Failed to process the uploaded image.");
    }
  });

  socket.on("change-brightness", async (data) => {
    const { base64, brightnessValue } = data;

    if (!base64 || !brightnessValue) {
      socket.emit("error", "Missing image data or brightness value.");
      return;
    }

    const imgBuffer = base64ToBufferConverter(base64);

    try {
      const modifiedImage = await sharp(imgBuffer)
        .modulate({
          brightness: brightnessValue,
        })
        .png({ quality: 70 })
        .toBuffer();

      const modifiedImageBase64 = modifiedImage.toString("base64");

      socket.emit("brightness-changed", {
        modifiedImageBase64,
      });

      socket.emit("image-preview", {
        message: "Image brightness changed",
        modifiedImageBase64,
      });
    } catch (err) {
      console.error("Error changing brightness of image:", err);
      socket.emit("error", "Failed to process the image.");
    }
  });

  socket.on("change-contrast", async (data) => {
    const { base64, contrastValue } = data;

    if (!base64 || !contrastValue) {
      socket.emit("error", "Missing image data or contrast value.");
      return;
    }

    const imgBuffer = base64ToBufferConverter(base64);

    try {
      const modifiedImage = await sharp(imgBuffer)
        .linear(contrastValue, -(0.5 * contrastValue) + 0.5) // Adjust contrast
        .png({ quality: 70 })
        .toBuffer();

      const modifiedImageBase64 = modifiedImage.toString("base64");

      socket.emit("contrast-changed", {
        modifiedImageBase64,
      });

      socket.emit("image-preview", {
        message: "Image contrast changed",
        modifiedImageBase64,
      });
    } catch (err) {
      console.error("Error changing contrast of image:", err);
      socket.emit("error", "Failed to process the image.");
    }
  });

  socket.on("change-saturation", async (data) => {
    const { base64, saturationValue } = data;

    if (!base64 || !saturationValue) {
      socket.emit("error", "Missing image data or saturation value.");
      return;
    }

    const imgBuffer = base64ToBufferConverter(base64);

    try {
      const modifiedImage = await sharp(imgBuffer)
        .modulate({
          saturation: saturationValue,
        })
        .png({ quality: 70 })
        .toBuffer();

      const modifiedImageBase64 = modifiedImage.toString("base64");

      socket.emit("saturation-changed", {
        modifiedImageBase64,
      });

      socket.emit("image-preview", {
        message: "Image saturation changed",
        modifiedImageBase64,
      });
    } catch (err) {
      console.error("Error changing saturation of image:", err);
      socket.emit("error", "Failed to process the image.");
    }
  });

  socket.on("rotate", async (data) => {
    const { base64, degree } = data;

    if (!base64 || !degree) {
      socket.emit("error", "Missing image data or degree value.");
      return;
    }

    const imgBuffer = base64ToBufferConverter(base64);

    try {
      const modifiedImage = await sharp(imgBuffer)
        .rotate(degree, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ quality: 70 })
        .toBuffer();

      const modifiedImageBase64 = modifiedImage.toString("base64");

      socket.emit("rotated", {
        modifiedImageBase64,
      });

      socket.emit("image-preview", {
        message: "Image rotated",
        modifiedImageBase64,
      });
    } catch (err) {
      console.error("Error rotating the image:", err);
      socket.emit("error", "Failed to process the image.");
    }
  });

  socket.on("download", async (data) => {
    try {
      let modifiedImageSharpInstance = await sharp(newFilePath)
        .modulate({
          brightness: data.brightness,
          saturation: data.saturation,
        })
        .linear(data.contrast, -(0.5 * data.contrast) + 0.5)
        .rotate(data.degree, { background: { r: 0, g: 0, b: 0, alpha: 0 } });

      if (data.format === "jpeg") {
        modifiedImageSharpInstance = modifiedImageSharpInstance.jpeg();
      } else if (data.format === "png") {
        modifiedImageSharpInstance = modifiedImageSharpInstance.png();
      }

      const imgBuffer = modifiedImageSharpInstance.toBuffer();

      socket.emit("final-image-data", {
        image: (await imgBuffer).toString("base64"),
        format: data.format,
      });
    } catch (err) {
      console.error("Error processing image", err);
      socket.emit("error", "Failed to process the image.");
    }
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected");
    await cleanFolder(newFolderPath);
  });
});

const cleanFolder = async (folderPath: string) => {
  console.log("folderpath", folderPath);

  if (!folderPath) return;

  try {
    const files = await fs.readdir(folderPath);

    for (const file of files) {
      const newFilePath = path.join(folderPath, file);

      await fs.rm(newFilePath, { recursive: true, force: true });
    }
  } catch (err) {
    console.error("error clearing folder", err);
  }
};

const createPreviewBase64 = async (newFilePath: string) => {
  let previewBase64 = null;

  const previewBuffer = await sharp(newFilePath)
    .png({ quality: 50 })
    .toBuffer();
  previewBase64 = previewBuffer.toString("base64");

  return previewBase64;
};

const base64ToBufferConverter = (base64Data: string) => {
  const imgBuffer = Buffer.from(base64Data, "base64");

  return imgBuffer;
};

server.listen(port, () => {
  console.log("server is up on port", port);
});
