"use client";

import React, { useEffect, useRef, useState } from "react";
import { Result } from "../ui/interface";

interface TournamentCanvasProps {
  matches: { [key: string]: Result[] };
}

const TournamentCanvas: React.FC<TournamentCanvasProps> = ({ matches }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    // Canvasのサイズ計算
    const round = Object.keys(matches).length;
    let n = Math.pow(2, round);
    let start_width = 200;
    let start_height = 50;
    let height = 50;
    let width = 100;
    let space = 0;
    let s = 50;
    // Canvasのサイズを設定
    canvas.width = start_width * 2 + width * round;
    canvas.height = start_height * 2 + height * n;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // クリアしてから描画

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    for (let i = 0; i < round; i++) {
      const roundKey = `${i + 1}`;
      const previousroundKey = `${i}`;
      for (let j = 0; j < n; j++) {
        let idx = Math.floor(j / 2);
        if (!matches[roundKey] || !matches[roundKey][idx]) {
          continue;
        }

        const match = matches[roundKey][idx];

        ctx.font = "20px Arial";
        if (i == 0) {
          if (j % 2 === 0) {
            ctx.fillText(
              match.player1,
              start_width + width * (i - 1) - 50,
              start_height + height * j + space
            );
          } else if (j % 2 === 1) {
            ctx.fillText(
              match.player2,
              start_width + width * (i - 1) - 50,
              start_height + height * j + space
            );
          }
        }

        //縦線の描画
        ctx.strokeStyle = "black";
        if (i == 0) {
          if (match.player1 === match.winner && j % 2 == 0 && match.winner) {
            ctx.strokeStyle = "red";
          } else if (
            match.player2 === match.winner &&
            j % 2 == 1 &&
            match.winner
          ) {
            ctx.strokeStyle = "red";
          }
        } else if (i > 0) {
          if (
            (match.player1 === matches[previousroundKey][j].winner ||
              match.player2 === matches[previousroundKey][j].winner) &&
            (match.player1 !== "" || match.player2 !== "")
          ) {
            ctx.strokeStyle = "red";
          }
        }
        ctx.beginPath();
        ctx.moveTo(start_width + width * i, start_height + height * j + space);
        ctx.lineTo(
          start_width + width * (i + 1),
          start_height + height * j + space
        );
        ctx.stroke();
        ctx.closePath();
        ctx.strokeStyle = "black";
        //上側の横線の描画
        if (match.player1 == match.winner && match.player1 && match.winner) {
          ctx.strokeStyle = "red";
        }
        if (j % 2 === 0) {
          ctx.beginPath();
          ctx.moveTo(
            start_width + width * (i + 1),
            start_height + height * j + space
          );
          ctx.lineTo(
            start_width + width * (i + 1),
            start_height + height * (j + 1) - height / 2 + space
          );
          ctx.stroke();
          ctx.closePath();
          ctx.strokeStyle = "black";
          //下側の横線の描画
          if (match.player2 == match.winner && match.player2 && match.winner) {
            ctx.strokeStyle = "red";
          }
          ctx.beginPath();
          ctx.moveTo(
            start_width + width * (i + 1),
            start_height + height * (j + 1) - height / 2 + space
          );
          ctx.lineTo(
            start_width + width * (i + 1),
            start_height + height * (j + 1) + space
          );
          ctx.stroke();
          ctx.closePath();
        }
      }
      if (i === 0) {
        space = 25;
      } else {
        space = space + s;
        s = s * 2;
      }
      height *= 2;
      n /= 2;
    }
  }, [matches]);

  return (
    <div
      style={{
        width: "w-half",
        height: "h-half",
        overflow: "auto",
      }}
    >
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default TournamentCanvas;
