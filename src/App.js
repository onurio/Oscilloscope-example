import React, { useRef, useEffect } from 'react';
import './App.css';
import Tone from 'tone';



var waveform = new Tone.Analyser('waveform',1024);
let synth = new Tone.Synth().chain(waveform).toMaster();

// synth.oscillator.type = 'sine';
let canvasCtx;


function App() {
  const canvas = useRef(null);

  useEffect(()=>{
    canvasCtx = canvas.current.getContext("2d");
    draw();
  });

  function draw() {
    requestAnimationFrame(draw);
    var waveArray = waveform.getValue();
    canvasCtx.fillStyle = "#000000";
    canvasCtx.lineWidth = 2;
    canvasCtx.clearRect(0, 0, window.innerWidth*2, window.innerHeight*2);
    canvasCtx.beginPath();
    for (var i = 0; i < waveArray.length; i+=4) {
      let x= (i/waveArray.length)*(window.innerWidth*2);
      if (i === 0) {
        canvasCtx.moveTo(0,(window.innerHeight)+ waveArray[i]);
      } else {
        canvasCtx.lineTo(x, (window.innerHeight)+waveArray[i]*400);
      }
    }
    canvasCtx.stroke();
  }

  const handleMove=e=>{
    synth.frequency.value = 100+(e.clientY/window.innerHeight)*3000;
  }

  return (
    <div className="App" onMouseMove={e=>handleMove(e)} onMouseDown={e=>{synth.triggerAttack('C5');}} onMouseUp={e=>{synth.triggerRelease()}}>
      <canvas ref={canvas}  style={{width:window.innerWidth,height:window.innerHeight}} width={window.innerWidth*2} height={window.innerHeight*2} id='oscilloscope'/>
    </div>
  );
}

export default App;
