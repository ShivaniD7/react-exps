import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";
import "./App.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const Counter = () => {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [min, setMin] = useState(-50);
  const [max, setMax] = useState(50);
  const [animate, setAnimate] = useState(false);
  const [theme, setTheme] = useState("light");
  const [font, setFont] = useState("sans-serif");
  const [counterStyle, setCounterStyle] = useState("rounded");
  const [error, setError] = useState("");
  const [colorPair, setColorPair] = useState({ bg: "#e0e0e0", text: "#000000" });
  const [autoMode, setAutoMode] = useState(false);
  const [autoDirection, setAutoDirection] = useState("increment");
  const [history, setHistory] = useState([]);

  const clickSound = new Audio("/sounds/pop-39222.mp3");
  const resetSound = new Audio("/sounds/typewriter-bell-100087.mp3");

  const validateInputs = () => {
    if (step === "" || isNaN(step)) {
      setError("Step must be a number.");
      return false;
    }
    if (Number(step) === 0) {
      setError("Step cannot be 0.");
      return false;
    }
    if (min === "" || max === "" || isNaN(min) || isNaN(max)) {
      setError("Min and Max must be valid numbers.");
      return false;
    }
    if (Number(min) >= Number(max)) {
      setError("Min must be less than Max.");
      return false;
    }
    setError("");
    return true;
  };

  const getRandomHexColor = () => {
    const hex = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
    return `#${hex}`;
  };

  const getTextColorBasedOnBg = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? "#000000" : "#ffffff";
  };

  const updateRandomColor = () => {
    const bg = getRandomHexColor();
    const text = getTextColorBasedOnBg(bg);
    setColorPair({ bg, text });
  };

  const handleIncrement = () => {
    if (!validateInputs()) return;
    if (count + Number(step) <= max) {
      setHistory(prev => [...prev, count]);
      setCount(prev => prev + Number(step));
      setAnimate(true);
      clickSound.play();
      updateRandomColor();
    }
  };

  const handleDecrement = () => {
    if (!validateInputs()) return;
    if (count - Number(step) >= min) {
      setHistory(prev => [...prev, count]);
      setCount(prev => prev - Number(step));
      setAnimate(true);
      clickSound.play();
      updateRandomColor();
    }
  };

  const handleReset = () => {
    setHistory(prev => [...prev, count]);
    setCount(0);
    setAnimate(true);
    resetSound.play();
    setError("");
    updateRandomColor();
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prevHistory = [...history];
      const last = prevHistory.pop();
      setCount(last);
      setHistory(prevHistory);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const toggleAutoMode = () => {
    setAutoMode(prev => !prev);
  };

  const toggleDirection = () => {
    setAutoDirection(prev => (prev === "increment" ? "decrement" : "increment"));
  };

  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => setAnimate(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [animate]);

  useEffect(() => {
    if (!autoMode) return;
    const interval = setInterval(() => {
      autoDirection === "increment" ? handleIncrement() : handleDecrement();
    }, 1000);
    return () => clearInterval(interval);
  }, [autoMode, autoDirection, count, step, min, max]);

  useEffect(() => {
    if (count === 100) {
      confetti({ particleCount: 150, spread: 100 });
    }
  }, [count]);

  const getCountClass = () => {
    if (count > 0) return "count-display positive";
    if (count < 0) return "count-display negative";
    return "count-display zero";
  };

  return (
    <div className="counter-chart-wrapper">
      <div className={`counter-card ${theme}`} style={{ fontFamily: font }}>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        <h1>Smart Counter</h1>
        <div
          className={`${getCountClass()} ${animate ? "bounce" : ""} ${counterStyle}`}
          style={{ backgroundColor: colorPair.bg, color: colorPair.text }}
        >
          {count}
        </div>

        <div className="style-controls">
          <label>Font:</label>
          <select onChange={(e) => setFont(e.target.value)} value={font}>
            <option value="sans-serif">Sans-serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
            <option value="'Courier New', monospace">Courier</option>
            <option value="'Comic Sans MS', cursive">Comic Sans</option>
          </select>
        </div>

        <div className="step-group">
          <label>Step Size:</label>
          <input type="number" value={step} onChange={e => setStep(e.target.value)} />

          <label>Min:</label>
          <input type="number" value={min} onChange={e => setMin(Number(e.target.value))} />

          <label>Max:</label>
          <input type="number" value={max} onChange={e => setMax(Number(e.target.value))} />
        </div>

        {error && <div className="error-box">{error}</div>}

        <div className="buttons">
          <button onClick={handleDecrement} disabled={count - step < min} className="decrement">−</button>
          <button onClick={handleIncrement} disabled={count + Number(step) > max} className="increment">+</button>
          <div className="auto-controls">
            <button onClick={toggleAutoMode}>{autoMode ? "⏹️ Stop Auto" : "▶️ Start Auto"}</button>
            <button onClick={toggleDirection}>Direction: {autoDirection === "increment" ? "➕ Increment" : "➖ Decrement"}</button>
          </div>
        </div>

        <button onClick={handleUndo} className="undo">Undo</button>
        <button onClick={handleReset} className="reset">Reset</button>
      </div>

      <div className="chart-container">
        <Line
          data={{
            labels: history.map((_, i) => `Step ${i + 1}`),
            datasets: [
              {
                label: "Count History",
                data: [...history, count],
                fill: false,
                borderColor: "blue",
                tension: 0.2
              }
            ]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Counter;
