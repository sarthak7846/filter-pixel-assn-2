import { BrightnessControlProps } from "@/interfaces/BrightnessControlProps";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Slider } from "./ui/slider";

export const BrightnessControl: React.FC<BrightnessControlProps> = ({
  brightness,
  onBrightnessChange,
}) => {
  return (
    <Card className="editing-control">
      <CardHeader>
        <CardTitle>Brightness</CardTitle>
      </CardHeader>
      <CardContent>
        <Slider
          min={0.5}
          max={2}
          step={0.015}
          defaultValue={[brightness]}
          className="bg-gray-200 rounded-lg cursor-pointer"
          onValueChange={onBrightnessChange}
        />
      </CardContent>
    </Card>
  );
};
