import React, { useState } from "react";
import Confetti from "../images/confetti.gif";
import "./profitAnimation.css";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ProfitAnimation = () => {
  const [show, setShow] = useState(true);
  return (
    <Modal
      show={show}
      backdrop="static"
      keyboard={false}
      id="profit-animation-modal"
    >
      <Modal.Header>
        <Modal.Title>Winning Trade!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div id="profit-animation">
          <img id="confetti-img" src={Confetti} />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ProfitAnimation;
