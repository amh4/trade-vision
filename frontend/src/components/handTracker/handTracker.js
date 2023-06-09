import React, { useState, useRef, useEffect } from "react";
import * as handTrack from "handtrackjs";

const modelParams = {
  flipHorizontal: true,
  outputStride: 16,
  imageScaleFactor: 1,
  maxNumBoxes: 20,
  iouThreshold: 0.2,
  scoreThreshold: 0.8,
  modelType: "ssd320fpnlite",
  modelSize: "small",
  bboxLineWidth: "2",
  fontSize: 17,
};

const HandTracker = (props) => {
  const [model, setModel] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const tradeActive = useRef(false);

  useEffect(() => {
    handTrack.load(modelParams).then((lmodel) => {
      setModel(lmodel);
      handTrack.startVideo(videoRef.current).then(function (status) {
        if (status) {
          const runDetection = () => {
            lmodel.detect(videoRef.current).then((predictions) => {
              if (predictions.length > 1) {
                if (
                  predictions[1].label === "open" &&
                  tradeActive.current === false
                ) {
                  tradeActive.current = true;
                  console.log("trade open");
                  props.onTradeActive &&
                    props.onTradeActive(tradeActive.current);
                } else if (
                  predictions[1].label === "closed" &&
                  tradeActive.current === true
                ) {
                  tradeActive.current = false;
                  console.log("trade closed");
                  props.onTradeActive &&
                    props.onTradeActive(tradeActive.current);
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
};

export default HandTracker;
