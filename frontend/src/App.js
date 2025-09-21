import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import Progress from "./components/Progress";

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz/:mode" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;