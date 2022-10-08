import React, { useLayoutEffect } from "react";
import { clearCtx } from "../../../../utils/functions";

interface IImageCanvasProps {
  w: number;
  h: number;
  ctx?: CanvasRenderingContext2D;
  buf8?: Uint8ClampedArray;
  buf32?: Uint32Array;
  id?: string;
  className?: string;
  opacity?: number;
}
const ImageCanvas = React.forwardRef<HTMLCanvasElement, IImageCanvasProps>(
  ({ w, h, id, className, opacity }, ref) => {
    const canvas: HTMLCanvasElement = (ref as any).current;

    // * Drag & Drop functionality
    const mouseDownHandler = (e: any) => {
      const { offsetX: mouseX, offsetY: mouseY } = e;
      canvas.className = canvas.className.replace("still", "dragging");
      canvas.className = canvas.className.replace(
        /clicX:\d+/,
        `clicX:${mouseX}`
      );
      canvas.className = canvas.className.replace(
        /clicY:\d+/,
        `clicY:${mouseY}`
      );
    };
    const mouseUpHandler = (e: any) => {
      const { offsetX: mouseX, offsetY: mouseY } = e;
      canvas.className = canvas.className.replace("dragging", "still");

      const clicMatches = canvas.className.match(/clic[X-Y]:-?\d+/g);
      const finalMatches = canvas.className.match(/final[X-Y]:-?\d+/g);
      const lastPosMatches = canvas.className.match(/lastPos[X-Y]:-?\d+/g);
      if (!clicMatches || !finalMatches || !lastPosMatches) return;
      const originX = Number(clicMatches[0].split(":")[1]);
      const originY = Number(clicMatches[1].split(":")[1]);
      const lastPosX = Number(lastPosMatches[0].split(":")[1]);
      const lastPosY = Number(lastPosMatches[1].split(":")[1]);

      const offsetX = (originX - mouseX) * -1;
      const offsetY = (originY - mouseY) * -1;

      let endedUpX = lastPosX + offsetX;
      let endedUpY = lastPosY + offsetY;
      // @ts-ignore
      const minX = canvas.width - canvas.file.width;
      // @ts-ignore
      const minY = canvas.height - canvas.file.height;

      if (endedUpX < minX) endedUpX = minX;
      if (endedUpY < minY) endedUpY = minY;
      if (endedUpX > 0) endedUpX = 0;
      if (endedUpY > 0) endedUpY = 0;

      canvas.className = canvas.className.replace(
        /finalX:-?\d+/,
        `finalX:${offsetX}`
      );
      canvas.className = canvas.className.replace(
        /finalY:-?\d+/,
        `finalY:${offsetY}`
      );
      canvas.className = canvas.className.replace(
        /lastPosX:-?\d+/,
        `lastPosX:${endedUpX}`
      );
      canvas.className = canvas.className.replace(
        /lastPosY:-?\d+/,
        `lastPosY:${endedUpY}`
      );
    };
    const mouseMoveHandler = (e: any) => {
      if (canvas.className.includes("dragging")) {
        const { offsetX: mouseX, offsetY: mouseY } = e;
        const clicMatches = canvas.className.match(/clic[X-Y]:-?\d+/g);
        const finalMatches = canvas.className.match(/final[X-Y]:-?\d+/g);
        const lastPosMatches = canvas.className.match(/lastPos[X-Y]:-?\d+/g);
        if (!clicMatches || !finalMatches || !lastPosMatches) return;
        const originX = Number(clicMatches[0].split(":")[1]) || 0;
        const originY = Number(clicMatches[1].split(":")[1]) || 0;
        const lastPosX = Number(lastPosMatches[0].split(":")[1]);
        const lastPosY = Number(lastPosMatches[1].split(":")[1]);

        const offsetX = (originX - mouseX) * -1;
        const offsetY = (originY - mouseY) * -1;

        let drawX = lastPosX + offsetX;
        let drawY = lastPosY + offsetY;

        // @ts-ignore
        const minX = canvas.width - canvas.file.width;
        // @ts-ignore
        const minY = canvas.height - canvas.file.height;

        if (drawX < minX) drawX = minX;
        if (drawY < minY) drawY = minY;
        if (drawX > 0) drawX = 0;
        if (drawY > 0) drawY = 0;
        // @ts-ignore
        if (canvas.file) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            clearCtx(ctx);
            ctx.drawImage(
              // @ts-ignore
              canvas.file.img,
              drawX,
              drawY,
              // @ts-ignore
              canvas.file.width,
              // @ts-ignore
              canvas.file.height
            );
          }
        }
      }
    };
    // . Effects
    // . -------
    useLayoutEffect(() => {
      if (!ref) return;
      const canvas: HTMLCanvasElement = (ref as any).current;
      if (!canvas) return;
      canvas.width = w;
      canvas.height = h;
      canvas.style.border = "1px solid black";
      canvas.classList.add(
        "still-clicX:0-clicY:0-finalX:0-finalY:0-lastPosX:0-lastPosY:0"
      );

      canvas.addEventListener("mousedown", mouseDownHandler);
      canvas.addEventListener("mouseup", mouseUpHandler);
      canvas.addEventListener("mousemove", mouseMoveHandler);
      return () => {
        canvas.removeEventListener("mousedown", mouseDownHandler);
        canvas.removeEventListener("mouseup", mouseUpHandler);
        canvas.removeEventListener("mousemove", mouseMoveHandler);
      };
    }, [canvas]);
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

export default ImageCanvas;
