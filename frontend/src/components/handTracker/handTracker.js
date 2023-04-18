import React, { useState, useRef, useEffect } from "react";
import * as handTrack from "handtrackjs";

const modelParams = {
  flipHorizontal: true,
  outputStride: 16,
  imageScaleFactor: 1,
  maxNumBoxes: 20,
  iouThreshold: 0.2,
  scoreThreshold: 0.6,
  modelType: "ssd320fpnlite",
  modelSize: "small",
  bboxLineWidth: "2",
  fontSize: 17,
};

function HandTracker() {
  const [model, setModel] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const openTradeRef = useRef(false);
  const closeTradeRef = useRef(false);
  const tradeActiveRef = useRef(false);

  useEffect(() => {
    handTrack.load(modelParams).then((lmodel) => {
      setModel(lmodel);
      handTrack.startVideo(videoRef.current).then(function (status) {
        console.log("video started", status);
        if (status) {
          const runDetection = () => {
            lmodel.detect(videoRef.current).then((predictions) => {
              console.log("Predictions: ", predictions);
              if (predictions.length > 1) {
                if (
                  predictions[1].label === "open" &&
                  tradeActiveRef.current === false
                ) {
                  openTradeRef.current = true;
                  tradeActiveRef.current = true;
                  console.log("trade open " + openTradeRef.current);
                } else if (
                  predictions[1].label === "closed" &&
                  tradeActiveRef.current === true
                ) {
                  closeTradeRef.current = true;
                  tradeActiveRef.current = false;
                  console.log("trade closed " + closeTradeRef.current);
                }
              }

              lmodel.renderPredictions(
                predictions,
                canvasRef.current,
                canvasRef.current.getContext("2d"),
                videoRef.current
              );
              requestAnimationFrame(runDetection);
            });
          };
          runDetection();
        } else {
          console.log("Please enable video");
        }
      });
    });
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        width="500"
        height="400"
        style={{ display: "none" }}
        autoPlay
        muted
      />
      <canvas ref={canvasRef} width="500" height="400" />
    </div>
  );
}

export default HandTracker;
