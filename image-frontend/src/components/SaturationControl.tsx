import { SaturationControlProps } from "@/interfaces/SaturationControlProps";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Slider } from "./ui/slider";

export const SaturationControl: React.FC<SaturationControlProps> = ({
  saturation,
  onSaturationChange,
}) => {
  return (
    <Card className="editing-control">
      <CardHeader>
        <CardTitle>Saturation</CardTitle>
      </CardHeader>
      <CardContent>
        <Slider
          min={0}
          max={3}
          step={0.03}
          defaultValue={[saturation]}
          onValueChange={onSaturationChange}
        />
      </CardContent>
    </Card>
  );
};
