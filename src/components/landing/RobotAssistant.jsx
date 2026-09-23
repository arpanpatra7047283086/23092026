import React from 'react'

export function RobotAssistant() {
  return (
    <div className="robot-stage" aria-label="Friendly উপলব্ধি assistant waving">
      <div className="robot-aura"></div>
      <div className="robot-spark spark-a">✦</div>
      <div className="robot-spark spark-b">·</div>
      <div className="robot-spark spark-c">✦</div>
      <div className="hello-bubble">
        <span>Hello,</span>
        <strong>you!</strong>
        <i></i>
      </div>
      <div className="robot">
        <div className="antenna"><span></span></div>
        <div className="robot-head">
          <div className="head-shine"></div>
          <div className="robot-face">
            <div className="robot-eye"><span></span></div>
            <div className="robot-eye"><span></span></div>
            <div className="robot-smile"></div>
          </div>
        </div>
        <div className="robot-body">
          <div className="robot-belly-light"></div>
        </div>
        <div className="robot-arm robot-arm-left"></div>
        <div className="robot-arm robot-arm-right">
          <div className="robot-hand">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div className="robot-shadow"></div>
      <div className="wave-lines">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}
