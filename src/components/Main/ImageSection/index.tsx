import React, { useEffect, useState } from "react";
import {
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
} from "../../../utils/constants";
import { clearCtx, getImageDataFromFile } from "../../../utils/functions";
import Canvas from "../CanvasSection/Canvas";
import { HTMLCanvasWithImage } from "../CanvasSection/ImageCanvas";
import InputFile from "./InputFile";

interface IImageSectionProps {
  imageRef: React.RefObject<HTMLCanvasWithImage>;
  previewRef: React.RefObject<HTMLCanvasElement>;
  className?: string;
  setFormStep: React.Dispatch<React.SetStateAction<number>>;
}

const ImageSection: React.FC<IImageSectionProps> = ({
  className,
  imageRef,
  previewRef,
  setFormStep,
}) => {
  // . State
  // . -----

  const [canConfirm, setCanConfirm] = useState<boolean>(false);

  //. Handlers
  //. --------

  const handleFileChange = async (e: Event) => {
    if (!previewRef.current) throw new Error("no preview ref");
    const previewCanvas = previewRef.current;
    const ctx = previewCanvas.getContext("2d");
    if (!ctx) throw new Error("no ctx when uploading image via inputfile");

    const target = e.target as HTMLInputElement;
    if (!target) throw new Error("no target on input file change event");
    const inputFiles = target.files;
    if (!inputFiles) throw new Error("no files in inputfile");
    const file = inputFiles[0];
    if (!file) throw new Error("no file index 0 in inputfile");

    if (!imageRef.current) throw new Error("no image ref");
    const imageCanvas = imageRef.current;
    const imageCtx = imageCanvas.getContext("2d");
    if (!imageCtx) throw new Error("no ctx when uploading image via inputfile");

    const { image } = await getImageDataFromFile(
      file,
      previewCanvas.width,
      0,
      0
    );

    imageRef.current.file = image;

    previewCanvas.width = image.width;
    previewCanvas.height = image.height;

    ctx.drawImage(image.img, 0, 0, image.width, image.height);
    imageCtx.drawImage(
      image.img,
      0,
      0,
      image.originalWidth,
      image.originalHeight
    );
    imageRef.current.file.width = imageRef.current.file.originalWidth;
    imageRef.current.file.height = imageRef.current.file.originalHeight;
    setCanConfirm(true);
  };

  const handleConfirm = () => {
    setFormStep((old: number) => old + 1);
  };

  // . Return
  // . ------

  return (
    <section className={`mainSection mainSection--image ${className}`}>
      <div className="sectionHeader">
        <h2>Choose your image</h2>
      </div>
      <InputFile fileChangeHandler={handleFileChange} />
      <div className="subSection">
        <div className="subSection__content">
          <Canvas
            ref={previewRef}
            id="previewCanvas"
            w={300}
            h={300}
            opacity={1}
          />
        </div>
      </div>
      <div className="subSection">
        <div className="subSection__content">
          <button type="button" onClick={handleConfirm} disabled={!canConfirm}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default ImageSection;
