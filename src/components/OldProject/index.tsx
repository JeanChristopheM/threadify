import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLocalStorage } from "../../utils/useLocalStorage";

const OldProject = () => {
  // . Local Storage
  // . -------------
  const [data, setData] = useLocalStorage("threadifySavedSteps", "");
  const [isValid, setIsValid] = useState<boolean>(false);

  const [steps, setSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);

  // . Handlers
  // . --------

  const stepFileHandler = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target) throw new Error("no target on input file change event");
    const inputFiles = target.files;
    if (!inputFiles) throw new Error("no files in inputfile");
    const file = inputFiles[0];
    if (!file) throw new Error("no file index 0 in inputfile");
    if (file.type !== "text/plain") throw new Error("file is not text");
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const steps: string[] = (fr.result as string).split(",");
        const currentStep = Number(steps[steps.length - 1].split("||")[1]);
        if (steps && currentStep !== undefined && currentStep !== null) {
          setData(fr.result);
        } else {
          console.warn({ steps, currentStep });
          throw new Error("Uploaded data is not valid.");
        }
      } catch (e) {
        alert(e);
      }
    };
    fr.readAsText(file);
  };

  const handleUploadSteps = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt";
    input.click();
    input.onchange = stepFileHandler;
  };

  const handleChangeCraftStep = (e: React.MouseEvent) => {
    const target = e.target as HTMLButtonElement;
    if (target.id == "prev") {
      setData(
        data
          .split("||")[0]
          .concat(`||${currentStep <= 0 ? 0 : currentStep - 1}`)
      );
    } else
      setData(
        data
          .split("||")[0]
          .concat(
            `||${
              currentStep >= steps.length - 2
                ? steps.length - 2
                : currentStep + 1
            }`
          )
      );
  };

  const handleSave = (e?: React.MouseEvent) => {
    const link = document.createElement("a");
    if (data.length && isValid) {
      const fileContent = data;
      link.setAttribute("href", `data:text/plain;charset=utf-8,${fileContent}`);
      link.setAttribute("download", "steps.txt");
      link.click();
      link.remove();
    }
  };

  // . Effects
  // . -------
  useEffect(() => {
    // * Checking validity of data
    if (data.length) {
      try {
        const steps: string[] = data.split(",");
        const currentStep = Number(steps[steps.length - 1].split("||")[1]);
        if (steps && currentStep !== undefined && currentStep !== null) {
          setSteps(steps);
          setCurrentStep(currentStep);
          setIsValid(true);
        } else {
          console.warn({ steps, currentStep });
          throw new Error("data is not valid");
        }
      } catch (e) {
        console.warn("data updated and is not valid");
        setIsValid(false);
      }
    }

    // * Saving on page quit
    window.onbeforeunload = () => setData(data);
  }, [data]);

  const location = useLocation();
  useEffect(() => () => {
    // * Saving on navigate unmount
    if (location.key !== window.history.state.key) {
      setData(data);
    }
  });

  // . Return
  // . ------
  return (
    <>
      <div className="flex-row flex-row-centered">
        <button type="button" onClick={handleUploadSteps}>
          Upload saved file
        </button>
        <button type="button" onClick={handleSave}>
          Save locally
        </button>
      </div>
      {data.length &&
      isValid &&
      steps.length &&
      currentStep !== undefined &&
      currentStep !== null ? (
        <>
          <div className="subSection stepsDisplay">
            <span>{steps[currentStep].split(" -> ")[0]}</span>
            <span>→</span>
            <span>{steps[currentStep].split(" -> ")[1]}</span>
          </div>
          <div className="subSection flex-row flex-row-centered">
            <button type="button" onClick={handleChangeCraftStep} id="prev">
              {"<"}
            </button>
            <div className="craftStepDisplay" id="middle">
              {currentStep}
            </div>
            <button type="button" onClick={handleChangeCraftStep} id="next">
              {">"}
            </button>
          </div>
        </>
      ) : null}
    </>
  );
};

export default OldProject;
