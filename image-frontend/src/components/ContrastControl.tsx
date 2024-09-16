import { ContrastControlProps } from "@/interfaces/ContrastControlProps";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Slider } from "./ui/slider";

export const ContrastControl: React.FC<ContrastControlProps> = ({
  contrast,
  onContrastChange,
}) => {
  return (
    <Card className="editing-control">
      <CardHeader>
        <CardTitle>Contrast</CardTitle>
      </CardHeader>
      <CardContent>
        <Slider
          min={0}
          max={2}
          step={0.02}
          defaultValue={[contrast]}
          onValueChange={onContrastChange}
        />
      </CardContent>
    </Card>
  );
};
