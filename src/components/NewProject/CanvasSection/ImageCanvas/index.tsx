import React, { useLayoutEffect } from "react";
import { clearCtx, resizeImage } from "../../../../utils/functions";

interface IImageCanvasProps {
  w: number;
  h: number;
  ctx?: CanvasRenderingContext2D;
  buf8?: Uint8ClampedArray;
  buf32?: Uint32Array;
  id?: string;
  className?: string;
  opacity?: number;
  sizeMultiplier: number;
}

export interface HTMLCanvasWithImage extends HTMLCanvasElement {
  file: {
    img: HTMLImageElement;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
  };
}
const ImageCanvas = React.forwardRef<HTMLCanvasElement, IImageCanvasProps>(
  ({ w, h, id, className, opacity, sizeMultiplier }, ref) => {
    const canvas: HTMLCanvasWithImage = (ref as any).current;

    // . Handlers
    // . --------
    // * Drag & Drop functionality
    const mouseDownHandler = (e?: any, x?: number, y?: number) => {
      let mouseX: number;
      let mouseY: number;
      if (x && y) {
        mouseX = x;
        mouseY = y;
      } else {
        const { offsetX, offsetY } = e;
        mouseX = offsetX;
        mouseY = offsetY;
      }
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
    const mouseUpHandler = (e?: any, x?: number, y?: number) => {
      let mouseX: number;
      let mouseY: number;
      if (x && y) {
        mouseX = x;
        mouseY = y;
      } else {
        const { offsetX, offsetY } = e;
        mouseX = offsetX;
        mouseY = offsetY;
      }
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

      const minX = 0 - canvas.file.width;
      const minY = 0 - canvas.file.height;
      const maxX = canvas.width;
      const maxY = canvas.height;

      if (endedUpX < minX) endedUpX = minX;
      if (endedUpY < minY) endedUpY = minY;
      if (endedUpX > maxX) endedUpX = maxX;
      if (endedUpY > maxY) endedUpY = maxY;

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
    const mouseMoveHandler = (e?: any, x?: number, y?: number) => {
      if (canvas.className.includes("dragging")) {
        let mouseX: number;
        let mouseY: number;
        if (x && y) {
          mouseX = x;
          mouseY = y;
        } else {
          const { offsetX, offsetY } = e;
          mouseX = offsetX;
          mouseY = offsetY;
        }
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

        const minX = 0 - canvas.file.width;
        const minY = 0 - canvas.file.height;
        const maxX = canvas.width;
        const maxY = canvas.height;

        if (drawX < minX) drawX = minX;
        if (drawY < minY) drawY = minY;
        if (drawX > maxX) drawX = maxX;
        if (drawY > maxY) drawY = maxY;

        if (canvas.file) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            clearCtx(ctx);
            ctx.drawImage(
              canvas.file.img,
              drawX,
              drawY,
              canvas.file.width,
              canvas.file.height
            );
          }
        }
      }
    };
    const touchDownHandler = (e: any) => {
      e.preventDefault();
      const { targetTouches } = e;
      if (targetTouches.length > 1) return;
      const touch = targetTouches[0];
      const { left, top } = canvas.getBoundingClientRect();
      mouseDownHandler(undefined, touch.clientX - left, touch.clientY - top);
    };
    const touchUpHandler = (e: any) => {
      e.preventDefault();
      const { changedTouches } = e;
      if (changedTouches.length > 1) return;
      const touch = changedTouches[0];
      const { left, top } = canvas.getBoundingClientRect();
      mouseUpHandler(undefined, touch.clientX - left, touch.clientY - top);
    };
    const touchMoveHandler = (e: any) => {
      e.preventDefault();
      const { changedTouches } = e;
      if (changedTouches.length > 1) return;
      const touch = changedTouches[0];
      const { left, top } = canvas.getBoundingClientRect();
      mouseMoveHandler(undefined, touch.clientX - left, touch.clientY - top);
    };
    // . Effects
    // . -------

    useLayoutEffect(() => {
      if (!ref || !canvas) return;
      canvas.width = w;
      canvas.height = h;
      canvas.style.border = "1px solid black";
      canvas.classList.add(
        "still-clicX:0-clicY:0-finalX:0-finalY:0-lastPosX:0-lastPosY:0"
      );

      canvas.addEventListener("touchstart", touchDownHandler);
      canvas.addEventListener("touchend", touchUpHandler);
      canvas.addEventListener("touchmove", touchMoveHandler);
      canvas.addEventListener("mousedown", mouseDownHandler);
      canvas.addEventListener("mouseup", mouseUpHandler);
      canvas.addEventListener("mousemove", mouseMoveHandler);
      return () => {
        canvas.removeEventListener("touchstart", mouseDownHandler);
        canvas.removeEventListener("touchend", mouseUpHandler);
        canvas.removeEventListener("touchmove", mouseMoveHandler);
      };
    }, [canvas]);
    useLayoutEffect(() => {
      if (!ref || !canvas) return;
      const { drawX, drawY } = resizeImage(
        ref as React.ForwardedRef<HTMLCanvasWithImage>,
        sizeMultiplier
      );
      if (canvas.file) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          clearCtx(ctx);
          ctx.drawImage(
            canvas.file.img,
            drawX || 0,
            drawY || 0,
            canvas.file.width,
            canvas.file.height
          );
        }
      }
    }, [canvas, sizeMultiplier]);

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
