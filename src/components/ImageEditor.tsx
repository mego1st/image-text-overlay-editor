
import { useState, useRef, useEffect } from "react";
import { Canvas as FabricCanvas, IText } from "fabric";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Download, FileImage } from "lucide-react";

export const ImageEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(40);
  const [activeText, setActiveText] = useState<IText | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#f0f0f0",
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        canvas.set('backgroundImage', img.src);
        canvas.renderAll();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const addText = () => {
    if (!canvas || !text) return;

    const fabricText = new IText(text, {
      left: 100,
      top: 100,
      fill: textColor,
      fontSize: fontSize,
      selectable: true,
    });

    canvas.add(fabricText);
    setActiveText(fabricText);
    canvas.setActiveObject(fabricText);
    canvas.renderAll();
  };

  const updateTextProperties = () => {
    if (!activeText) return;

    activeText.set({
      text: text,
      fill: textColor,
      fontSize: fontSize,
    });
    canvas?.renderAll();
  };

  useEffect(() => {
    updateTextProperties();
  }, [text, textColor, fontSize]);

  const downloadImage = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
      enableRetinaScaling: true
    });
    
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = dataURL;
    link.click();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-8">
        <div className="flex gap-4 items-center">
          <Button variant="outline" className="w-40">
            <Label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2">
              <FileImage className="w-4 h-4" />
              Upload Image
            </Label>
          </Button>
          <Input
            id="image-upload"
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.bmp,.tiff"
            onChange={handleImageUpload}
          />
        </div>

        <div className="grid grid-cols-[1fr,300px] gap-8">
          <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
            <canvas ref={canvasRef} />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Text Content</Label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text..."
              />
              <Button onClick={addText} className="w-full">
                Add Text
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Text Color</Label>
              <Input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-10"
              />
            </div>

            <div className="space-y-2">
              <Label>Font Size: {fontSize}px</Label>
              <Slider
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
                min={12}
                max={100}
                step={1}
              />
            </div>

            <Button onClick={downloadImage} className="w-full flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
