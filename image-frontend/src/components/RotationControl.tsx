import { RotationControlProps } from "@/interfaces/RotationControlProps";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Slider } from "./ui/slider";

export const RotationControl: React.FC<RotationControlProps> = ({
  rotationDegree,
  onDegreeChange,
}) => {
  return (
    <Card className="editing-control">
      <CardHeader>
        <CardTitle>Rotate</CardTitle>
      </CardHeader>
      <CardContent>
        <Slider
          min={0}
          max={360}
          step={3.6}
          defaultValue={[rotationDegree]}
          onValueChange={onDegreeChange}
        />
      </CardContent>
    </Card>
  );
};
