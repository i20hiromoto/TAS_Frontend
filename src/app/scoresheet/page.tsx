"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Points {
  player1: number[][];
  player2: number[][];
}

export default function BadmintonScoreSheet() {
  const [leftSide, setLeftSide] = useState(true);
  const [player1, setPlayer1] = useState("Player 1");
  const [player2, setPlayer2] = useState("Player 2");
  const [team1, setTeam1] = useState("Team 1");
  const [team2, setTeam2] = useState("Team 2");
  const [point1, setPoint1] = useState<string[][]>([[], [], []]);
  const [point2, setPoint2] = useState<string[][]>([[], [], []]);
  const [score1, setScore1] = useState([0, 0, 0]);
  const [score2, setScore2] = useState([0, 0, 0]);
  const [game1, setGame1] = useState(0);
  const [game2, setGame2] = useState(0);
  const [server, setServer] = useState(true);
  const [nextPoint, setNextPoint] = useState({ player1: 0, player2: 0 });
  const [prevGet, setPrevGet] = useState(true);
  const [currentTotal, setCurrentTotal] = useState(0);
  const [currentGame, setCurrentGame] = useState(0);

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
      setPoint1((prevPoint) => {
        const newPoints = [...prevPoint];
        newPoints[currentGame].push((nextPoint.player1 + 1).toString());
        return newPoints;
      });

      setPrevGet(true);
      setServer(true);
      //右側チームがポイント
    } else {
      setNextPoint((prevPoint) => ({
        ...prevPoint,
        player2: prevPoint.player2 + 1,
      }));
      setPoint2((prevPoint) => {
        const newPoints = [...prevPoint];
        newPoints[currentGame].push((nextPoint.player2 + 1).toString());
        return newPoints;
      });

      setPrevGet(false);
      setServer(false);
    }

    if (score1[currentGame] >= 21) {
      if (
        score1[currentGame] - score2[currentGame] >= 2 ||
        score1[currentGame] === 30
      ) {
        setGame1(game1 + 1);
      } else if (score2[currentGame] >= 21) {
        if (
          score2[currentGame] - score1[currentGame] >= 2 ||
          score2[currentGame] === 30
        ) {
          setGame2(game2 + 1);
        }
      }
    }
  };

  //サイドチェンジ
  const switchSides = () => {
    setLeftSide(!leftSide);
  };

  //ポイントを一つ戻す
  const resetScores = () => {
    if (point1[currentGame] === null && point2[currentGame].length === null) {
      if (prevGet) {
        setScore1((prevScore) => {
          const newScore = [...prevScore];
          newScore[currentGame] -= 1;
          return newScore;
        });
        setPoint1((prevPoint) => {
          const newPoints = [...prevPoint];
          newPoints[currentGame] = newPoints[currentGame].slice(0, -1);
          return newPoints;
        });
        setNextPoint((prevPoint) => ({
          ...prevPoint,
          player1: prevPoint.player1 - 1,
        }));
      } else {
        setScore2((prevScore) => {
          const newScore = [...prevScore];
          newScore[currentGame] -= 1;
          return newScore;
        });
        setPoint2((prevPoint) => {
          const newPoints = [...prevPoint];
          newPoints[currentGame] = newPoints[currentGame].slice(0, -1);
          return newPoints;
        });
        setNextPoint((prevPoint) => ({
          ...prevPoint,
          player2: prevPoint.player2 - 1,
        }));
      }

      if (point1[currentGame][nextPoint.player1] !== "") {
        setPrevGet(true);
      } else if (point2[currentGame][nextPoint.player2] !== "") {
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
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              {leftSide ? team1 : team2}
            </h2>
            <div className="text-4xl font-bold">
              {leftSide ? player1 : player2}
            </div>
            <div className="text-4xl font-bold">
              {leftSide ? score1[currentGame] : score2[currentGame]}
            </div>
            <Button onClick={() => incrementScore(leftSide)} className="mt-2">
              +1
            </Button>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              {leftSide ? team2 : team1}
            </h2>
            <div className="text-4xl font-bold">
              {leftSide ? player2 : player1}
            </div>
            <div className="text-4xl font-bold">
              {leftSide ? score2[currentGame] : score1[currentGame]}
            </div>
            <Button onClick={() => incrementScore(!leftSide)} className="mt-2">
              +1
            </Button>
          </div>
        </div>
        <div className="flex justify-center items-center space-x-4 mb-6">
          <span>Server:</span>
          <span>{server ? team1 : team2}</span>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                {point1.map((point: any, index: number) => (
                  <TableCell key={index}>{point}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                {point2.map((point: any, index: number) => (
                  <TableCell key={index}>{point}</TableCell>
                ))}
              </TableRow>
            </TableHeader>
          </Table>
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
    </Card>
  );
}
