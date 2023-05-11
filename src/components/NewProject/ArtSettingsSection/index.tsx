import React, { ChangeEvent, useEffect, useState } from "react";
import SizeControls from "./Controls/SizeControls";
import { Mode } from "../../../utils/interfaces";
import CanvasSection from "../CanvasSection";
import { HTMLCanvasWithImage } from "../CanvasSection/ImageCanvas";
import { DEFAULT_IMAGE_SIZE } from "../../../utils/constants";
import ShapeControls from "./Controls/ShapeControls";
import NailsControls from "./Controls/NailsControls";

interface IArtSettingsSectionProps {
  modeSetter: (newMode: Mode) => void;
  setPointsAmount: (pointsAmount: number) => void;
  artWidth: number;
  artHeight: number;
  artWidthSetter: (height: number) => void;
  artHeightSetter: (width: number) => void;
  canvasesRef: React.MutableRefObject<{
    drawingRef: React.RefObject<HTMLCanvasElement>;
    pointsRef: React.RefObject<HTMLCanvasElement>;
    imageRef: React.RefObject<HTMLCanvasWithImage>;
  }>;
}

const ArtSettingsSection: React.FC<IArtSettingsSectionProps> = ({
  modeSetter,
  setPointsAmount,
  artWidth,
  artHeight,
  artWidthSetter,
  artHeightSetter,
  canvasesRef,
}) => {
  // . State
  // . -----
  const [heightHidden, setHeightHidden] = useState<boolean>(true);
  //. Handlers
  //. --------

  const handleChangePoints = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const span = document.querySelector("#pointsAmountSpan");
    if (span) span.textContent = target.value;
    setPointsAmount(Number(target.value));
  };
  return (
    <section className={`mainSection mainSection--artSettings`}>
      <div className="sectionHeader">
        <h2>Art Canvas Parameters</h2>
      </div>

      <div className="controls flex-row">
        <ShapeControls
          handleChangeMode={modeSetter}
          setHeightHidden={setHeightHidden}
        />
        <SizeControls
          artWidth={artWidth}
          artHeight={artHeight}
          heightHidden={heightHidden}
          artWidthSetter={artWidthSetter}
          artHeightSetter={artHeightSetter}
        />
        <NailsControls handleChangePoints={handleChangePoints} />
      </div>

      <CanvasSection
        ref={canvasesRef}
        imageOpacity={1}
        imageSize={DEFAULT_IMAGE_SIZE}
        drawingOpacity={1}
      />
    </section>
  );
};

export default ArtSettingsSection;
