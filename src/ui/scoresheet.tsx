"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeftRight } from "lucide-react";

interface Points {
  player1: [[], [], []];
  player2: [[], [], []];
}

export default function BadmintonScoreSheet() {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [serverA, setServerA] = useState(true);
  const [leftSideA, setLeftSideA] = useState(true);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [points, setPoints] = useState<Points>({
    player1: [[], [], []],
    player2: [[], [], []],
  });
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [allscore, setAllScore] = useState({ player1: [], player2: [] });
  const [game, setGame] = useState({ player1: 0, player2: 0 });
  const [server, setServer] = useState(true);
  const [nextpoint, setNextPoint] = useState({ player1: 0, player2: 0 });
  const [prevget, setPrevGet] = useState(true);
  const [currentTotal, setCurrentTotal] = useState(0);
  const [curenntGame, setCurrentGame] = useState(0);

  useEffect(() => {
    // sessionStorage.getItem("player1");
    // sessionStorage.getItem("player2");
    // sessionStorage.getItem("team1");
    // sessionStorage.getItem("team2");
    setPlayer1(player1);
    setPlayer2(player2);
    setTeam1(team1);
    setTeam2(team2);
  }, []);

  //ポイントを追加
  const incrementScore = (isTeamA: boolean) => {
    //左側チームがポイント
    if (isTeamA) {
      setNextPoint((prevPoint) => ({
        ...prevPoint,
        player1: prevPoint.player1 + 1,
      }));
      setScore((prevScore) => ({
        ...prevScore,
        player1: prevScore.player1 + 1,
      }));
      setPoints((prevPoints: any) => ({
        ...prevPoints,
        player1: [...prevPoints.player1, nextpoint.player1.toString()],
        player2: [...prevPoints.player2, ""],
      }));
      setPrevGet(true);
      setServer(true);
      //右側チームがポイント
    } else {
      setNextPoint((prevPoint) => ({
        ...prevPoint,
        player2: prevPoint.player2 + 1,
      }));
      setScore((prevScore) => ({
        ...prevScore,
        player2: prevScore.player2 + 1,
      }));
      setPoints((prevPoints: any) => ({
        ...prevPoints,
        player1: [...prevPoints.player1, ""],
        player2: [...prevPoints.player2, nextpoint.player2.toString()],
      }));
      setPrevGet(false);
      setServer(false);
    }
    if (score.player1 >= 21) {
      setCurrentGame(curenntGame + 1);
      if (score.player1 - score.player2 >= 2 || score.player1 == 30) {
        game.player1 = game.player1 + 1;
        setGame((prevGame) => ({
          ...prevGame,
          player1: game.player1,
        }));
      }
      setAllScore((prevAllScore: any) => ({
        ...prevAllScore,
        player1: [...prevAllScore.player1, score.player1],
        player2: [...prevAllScore.player2, score.player2],
      }));
    } else if (score.player2 >= 21) {
      if (score.player2 - score.player1 >= 2 || score.player2 == 30) {
        game.player2 = game.player2 + 1;
        setGame((prevGame) => ({
          ...prevGame,
          player2: game.player2,
        }));
      }
    }
  };

  //サイドチェンジ
  const switchSides = () => {
    setLeftSideA(!leftSideA);
  };

  //ポイントを一つもどす
  const resetScores = () => {
    if (
      points.player1[curenntGame][points.player1.length - 1] !== "" &&
      points.player2[curenntGame][points.player2.length - 1] !== ""
    ) {
      if (prevget) {
        setScore((prevScore) => ({
          ...prevScore,
          player1: prevScore.player1 - 1,
        }));
        setPoints((prevPoints: any) => ({
          ...prevPoints,
          player1: prevPoints.player1.slice(0, -1),
          player2: prevPoints.player2.slice(0, -1),
        }));
      } else {
        setScore((prevScore) => ({
          ...prevScore,
          player2: prevScore.player2 - 1,
        }));
        setPoints((prevPoints: any) => ({
          ...prevPoints,
          player1: prevPoints.player1.slice(0, -1),
          player2: prevPoints.player2.slice(0, -1),
        }));
      }

      if (points.player1[curenntGame][points.player1.length - 1] !== "") {
        setPrevGet(true);
      } else {
        setPrevGet(false);
      }
    } else {
      alert("前のゲームの修正はできません");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          バドミントン用スコアシート
        </CardTitle>
      </CardHeader>
      {player1 && player2 && team1 && team2 && (
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                {leftSideA ? team1 : team2}
              </h2>
              <div className="text-4xl font-bold">
                {leftSideA ? player1 : player2}
              </div>
              <div className="text-4xl font-bold">
                {leftSideA ? score.player1 : score.player2}
              </div>
              <Button
                onClick={() => incrementScore(leftSideA)}
                className="mt-2"
              >
                +1
              </Button>
            </div>
            <div className="text-center">
              <Button
                onClick={() => incrementScore(!leftSideA)}
                className="mt-2"
              >
                +1
              </Button>
            </div>
          </div>
          <div className="flex justify-center items-center space-x-4 mb-6">
            <span>Server:</span>
            <Switch checked={serverA} onCheckedChange={setServerA} />
            <span>{serverA ? "Team A" : "Team B"}</span>
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={switchSides} variant="outline">
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              サイドチェンジ
            </Button>
            <Button onClick={resetScores} variant="destructive">
              一つ戻る
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
