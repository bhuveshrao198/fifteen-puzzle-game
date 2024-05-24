"use client";

import React, { useState, useEffect } from "react";
const SIZE = 4; // Size of the puzzle grid
const MAX_ATTEMPTS = 1000; // Maximum attempts to generate a solvable configuration

export default function Home() {
  const [tiles, setTiles] = useState(
    Array.from({ length: SIZE * SIZE }, (_, i) => i + 1)
  );
  const [time, setTime] = useState(0);
  const [movesCount, setmovesCount] = useState(0);
  const [emptyIndex, setEmptyIndex] = useState(SIZE * SIZE - 1); // Index of the empty space

  useEffect(() => {
    shuffleTiles();
  }, []);

  const shuffleTiles = () => {
    console.log(startTimer()());
    setTime(0);
    setmovesCount(0);
    let solvable = false;
    let attempts = 0;

    while (!solvable && attempts < MAX_ATTEMPTS) {
      // Generate a random configuration
      for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
      }
      setEmptyIndex(tiles.indexOf(SIZE * SIZE));

      // Check if the configuration is solvable
      solvable = isSolvable();
      attempts++;
    }

    if (!solvable) {
      alert("Not solvable");
    }
  };

  const moveTile = (index) => {
    console.log(index, "index");
    if (isValidMove(index)) {
      if (movesCount === 0) startTimer();
      setmovesCount((prev) => prev + 1);
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [
        newTiles[index],
        newTiles[emptyIndex],
      ];
      setTiles(newTiles);
      setEmptyIndex(index);
    }
  };

  const isValidMove = (index) => {
    // Check if the clicked tile is adjacent to the empty space
    const emptyRow = Math.floor(emptyIndex / SIZE);
    const emptyCol = emptyIndex % SIZE;
    const clickedRow = Math.floor(index / SIZE);
    const clickedCol = index % SIZE;

    return (
      (Math.abs(emptyRow - clickedRow) === 1 && emptyCol === clickedCol) ||
      (Math.abs(emptyCol - clickedCol) === 1 && emptyRow === clickedRow)
    );
  };

  const isSolvable = () => {
    let inversions = 0;
    for (let i = 0; i < tiles.length - 1; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        if (
          tiles[i] !== SIZE * SIZE &&
          tiles[j] !== SIZE * SIZE &&
          tiles[i] > tiles[j]
        ) {
          inversions++;
        }
      }
    }
    // For an odd grid, add the row number of the empty tile from bottom to the inversions count
    if (SIZE % 2 === 1) {
      inversions += Math.floor(emptyIndex / SIZE) + 1;
    }
    return inversions % 2 === 0;
  };

  const solveStep = () => {
    if (!isSolvable()) {
      alert("Puzzle not solvable");
      return;
    }

    // Find the first misplaced tile
    const misplacedIndex = tiles.findIndex((tile, index) => tile !== index + 1);

    if (misplacedIndex !== -1) {
      // Move the misplaced tile to its correct position
      const correctIndex = tiles[misplacedIndex] - 1;
      console.log(correctIndex, "correct indx");
      moveTile(correctIndex);
    }
  };
  const solvePuzzle = () => {
    if (!isSolvable()) {
      alert("Puzzle not solvable");
      return;
    }

    let solved = false;
    let iterations = 0;

    while (!solved && iterations < SIZE * SIZE) {
      let misplacedIndex = tiles.findIndex((tile, index) => tile !== index + 1);

      if (misplacedIndex !== -1) {
        let correctIndex = tiles[misplacedIndex] - 1;
        if (isValidMove(correctIndex)) {
          moveTile(correctIndex);
        } else {
          misplacedIndex = tiles.findIndex((tile, index) => tile !== index + 1);
          correctIndex = tiles[misplacedIndex] - 1;
        }
      } else {
        solved = true;
      }

      iterations++;
    }
  };

  const startTimer = () => {
    let timerInterval;

    // Start the timer when setmovecount changes from 0 to any positive number
    if (movesCount === 1) {
      timerInterval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    // Clean up the timer interval when component unmounts or when setmovecount goes back to 0
    return () => clearInterval(timerInterval);
  };

  useEffect(() => {
    startTimer();
  }, [movesCount]);

  // Function to format time as minutes and seconds
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="game_main_container">
      <div className="center gap-40 d-flex wrap">
        <div className="d-flex direction row-gap-20">
          <div className="d-flex gap-10">
            <div className="moves_left d-flex center direction">
              <span className="text">Moves</span>
              <span className="text">{movesCount}</span>
            </div>
            <div className="moves_left d-flex center direction">
              <span className="text">Time</span>
              <span className="text">{formatTime(time)}</span>
            </div>
          </div>
          <div className="d-flex gap-10">
            <div className="primary_btn" onClick={solvePuzzle}>
              HELP
            </div>
            <div className="primary_btn" onClick={shuffleTiles}>
              RESET
            </div>
          </div>
        </div>
        <h1 className="heading">
          FIFTEEN PUZZLE <br /> GAME
        </h1>
      </div>
      <div className="center d-flex mt-40">
        <div className="game-board">
          {tiles.map((tile, index) => (
            <div
              key={index}
              className={`tile ${tile === SIZE * SIZE ? "tile_content" : ""}`}
              onClick={() => moveTile(index)}
            >
              <div
                className={` ${
                  tile === SIZE * SIZE ? "empty tile_content" : ""
                }`}
              >
                {tile}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
