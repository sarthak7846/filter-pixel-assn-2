import { useContext, useState } from "react";
import { BrightnessControl } from "./BrightnessControl";
import { ContrastControl } from "./ContrastControl";
import { RotationControl } from "./RotationControl";
import { SaturationControl } from "./SaturationControl";
import { EditingToolsProps } from "@/interfaces/EditingToolsProps";
import { ImagePreviewCtx, SocketInstanceCtx } from "@/App";

export const EditingTools: React.FC<EditingToolsProps> = ({
  setImageEditingValues,
}) => {
  const [brightness, setBrightness] = useState(1);
  const [saturation, setSaturation] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [rotationDegree, setRotationDegree] = useState(0);

  const socket = useContext(SocketInstanceCtx);
  const parentImagePreviewBase64 = useContext(ImagePreviewCtx);

  const [brightnessImagePreviewBase64, setBrightnessImagePreviewBase64] =
    useState(parentImagePreviewBase64);
  const [saturationImagePreviewBase64, setSaturationImagePreviewBase64] =
    useState(parentImagePreviewBase64);
  const [rotationImagePreviewBase64, setRotationImagePreviewBase64] = useState(
    parentImagePreviewBase64
  );
  const [contrastImagePreviewBase64, setContrastImagePreviewBase64] = useState(
    parentImagePreviewBase64
  );

  const brightnessChangeHandler = async (value: Array<number>) => {
    setBrightness(value[0]);

    setImageEditingValues((prevState) => ({
      ...(prevState || {}), // Handle the case where prevState is null
      brightness: value[0],
    }));

    socket.emit("change-brightness", {
      base64: brightnessImagePreviewBase64,
      brightnessValue: value[0],
    });

    socket.on("brightness-changed", (data) => {
      if (data.modifiedImageBase64) {
        setSaturationImagePreviewBase64(data.modifiedImageBase64);
        setRotationImagePreviewBase64(data.modifiedImageBase64);
        setContrastImagePreviewBase64(data.modifiedImageBase64);
      }
    });
  };

  const contrastChangeHandler = async (value: Array<number>) => {
    setContrast(value[0]);

    setImageEditingValues((prevState) => ({
      ...(prevState || {}), // Handle the case where prevState is null
      contrast: value[0],
    }));

    socket.emit("change-contrast", {
      base64: contrastImagePreviewBase64,
      contrastValue: value[0],
    });

    socket.on("contrast-changed", (data) => {
      if (data.modifiedImageBase64) {
        setBrightnessImagePreviewBase64(data.modifiedImageBase64);
        setSaturationImagePreviewBase64(data.modifiedImageBase64);
        setRotationImagePreviewBase64(data.modifiedImageBase64);
      }
    });
  };

  const saturationChangeHandler = async (value: Array<number>) => {
    setSaturation(value[0]);

    setImageEditingValues((prevState) => ({
      ...(prevState || {}), // Handle the case where prevState is null
      saturation: value[0],
    }));

    socket.emit("change-saturation", {
      base64: saturationImagePreviewBase64,
      saturationValue: value[0],
    });

    socket.on("saturation-changed", (data) => {
      if (data.modifiedImageBase64) {
        setBrightnessImagePreviewBase64(data.modifiedImageBase64);
        setContrastImagePreviewBase64(data.modifiedImageBase64);
        setRotationImagePreviewBase64(data.modifiedImageBase64);
      }
    });
  };

  const degreeChangeHandler = async (value: Array<number>) => {
    setRotationDegree(value[0]);

    setImageEditingValues((prevState) => ({
      ...(prevState || {}), // Handle the case where prevState is null
      degree: value[0],
    }));

    socket.emit("rotate", {
      base64: rotationImagePreviewBase64,
      degree: value[0],
    });
  };

  return (
    <div className="editing-controls">
      <BrightnessControl
        brightness={brightness}
        onBrightnessChange={brightnessChangeHandler}
      />
      <ContrastControl
        contrast={contrast}
        onContrastChange={contrastChangeHandler}
      />
      <SaturationControl
        saturation={saturation}
        onSaturationChange={saturationChangeHandler}
      />
      <RotationControl
        rotationDegree={rotationDegree}
        onDegreeChange={degreeChangeHandler}
      />
    </div>
  );
};
