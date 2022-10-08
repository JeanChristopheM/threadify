import React, { useLayoutEffect } from "react";
import { clearCtx, getImageDataFromFile } from "../../../utils/functions";

type ICanvasProps = {
  w: number;
  h: number;
  ctx?: CanvasRenderingContext2D;
  buf8?: Uint8ClampedArray;
  buf32?: Uint32Array;
  id?: string;
  className?: string;
  opacity?: number;
};

const Canvas = React.forwardRef<HTMLCanvasElement, ICanvasProps>(
  ({ w, h, id, className, opacity }, ref) => {
    // . Effects
    // . -------
    useLayoutEffect(() => {
      if (!ref) return;
      const canvas: HTMLCanvasElement = (ref as any).current;
      if (!canvas) return;
      canvas.width = w;
      canvas.height = h;
      canvas.style.border = "1px solid black";
    }, [ref]);
    // . Return
    // . ------
    return (
      <canvas
        ref={ref}
        id={id || ""}
        className={className || ""}
        style={{ opacity: `${opacity ?? 1}` }}
      />
    );
  }
);

export default Canvas;
