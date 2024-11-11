import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { Result } from "@/ui/interface";
import { useState, useEffect } from "react";
import axios from "axios";

type results = {
  [key: string]: Result[];
};

interface MatchManagementProps {
  matches: results;
  searchMatch: string;
  setSearchMatch: (term: string) => void;
  setMatches: (matches: results) => void;
}

type GamePoints = {
  [key: string]: {
    player1: number;
    player2: number;
  };
};

const MatchManagement: React.FC<MatchManagementProps> = ({
  matches,
  searchMatch,
  setSearchMatch,
  setMatches,
}) => {
  const [filteredMatches, setFilteredMatches] = useState<results>(matches);
  const [gamePoints, setGamePoints] = useState<GamePoints>({});
  const [sets, setSets] = useState<string[]>([]);

  useEffect(() => {
    const results: results = {};

    for (const key in matches) {
      if (matches.hasOwnProperty(key)) {
        const filtered = matches[key].filter(
          (match) =>
            match.player1.toLowerCase().includes(searchMatch.toLowerCase()) ||
            match.player2.toLowerCase().includes(searchMatch.toLowerCase())
        );
        if (filtered.length > 0) {
          results[key] = filtered;
        }
      }
    }

    setFilteredMatches(results);
  }, [searchMatch, matches]);

  const handleUpload = async (match: Result) => {
    match.result.game = gamePoints;
    const id = sessionStorage.getItem("id") || "0";
    const competition = sessionStorage.getItem("competition") || "singles";
    let c1 = 0;
    let c2 = 0;
    for (let i = 0; i < Object.keys(gamePoints).length; i++) {
      const key = `${i + 1}` as keyof Result["result"]["game"];
      if (gamePoints[key].player1 !== 0 && gamePoints[key].player2 !== 0) {
        match.result.game[key]!.player1 = gamePoints[key]!.player1;
        match.result.game[key]!.player2 = gamePoints[key]!.player2;
        console.log(match.result.game[key]);
      }
      if (gamePoints[key].player1 > gamePoints[key].player2) {
        c1++;
      } else if (gamePoints[key].player1 < gamePoints[key].player2) {
        c2++;
      }
    }
    match.result.count.c1 = c1;
    match.result.count.c2 = c2;
    if (c1 > c2) {
      match.winner = match.player1;
      match.loser = match.player2;
    } else if (c1 < c2) {
      match.winner = match.player2;
      match.loser = match.player1;
    } else if (c1 === c2) {
      match.winner = "";
      match.loser = "";
    }
    const encodedMatch = encodeURIComponent(JSON.stringify(match));
    if (encodedMatch) {
      try {
        axios.put(
          `http://localhost:3001/edit-results?id=${id}&match=${encodedMatch}&competition=${competition}`
        );
      } catch (err: any) {
        if (err.response) {
          // サーバーはレスポンスを返したが、ステータスコードが2xxの範囲外
          console.log("Error:", err.response.status); // ステータスコードを出力
          console.log("Data:", err.response.data); // レスポンスデータを出力
        } else if (err.request) {
          // リクエストはサーバーに送信されたが、レスポンスが無い
          console.log("Request:", err.request);
        } else {
          // リクエストの設定時に何らかのエラーが発生
          console.log("Error:", err.message);
        }
        const errorMessage = err.response
          ? err.response.data.message
          : err.message;
        console.log("Error:", errorMessage);
      }
    }
  };

  const handleAddSet = () => {
    const newSet = `${sets.length + 1}`;
    setSets([...sets, newSet]);
    setGamePoints({
      ...gamePoints,
      [newSet]: { player1: 0, player2: 0 },
    });
  };

  const handleDeleteSet = (set: string) => {
    const newSets = sets.filter((s) => s !== set);
    const { [set]: _, ...newGamePoints } = gamePoints; // 削除するセットの得点を取り除く
    const renumberedSets = newSets.map((_, index) => `${index + 1}`);

    // 新しいセットに対応する gamePoints を更新
    const renumberedGamePoints = renumberedSets.reduce((acc, curr, index) => {
      const oldSet = ` ${index + 1}`;
      acc[curr] = newGamePoints[oldSet] || { player1: 0, player2: 0 };
      return acc;
    }, {} as typeof gamePoints);
    setSets(renumberedSets);
    setGamePoints(renumberedGamePoints);
  };

  const handleGamePointChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    set: string,
    player: "player1" | "player2"
  ) => {
    const value = parseInt(e.target.value, 10);
    setGamePoints({
      ...gamePoints,
      [set]: {
        ...gamePoints[set],
        [player]: value,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>試合管理</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="選手名で検索..."
            value={searchMatch}
            onChange={(e) => setSearchMatch(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ラウンド</TableHead>
              <TableHead>プレイヤー1</TableHead>
              <TableHead>プレイヤー2</TableHead>
              <TableHead>結果</TableHead>
              <TableHead>勝者</TableHead>
              <TableHead>編集</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(filteredMatches).map((key) =>
              filteredMatches[key].map((match) => (
                <TableRow key={match.id} style={{ fontSize: "16px" }}>
                  <TableCell>
                    <span>
                      {parseInt(key)}回戦　第{match.id}試合
                    </span>
                  </TableCell>
                  <TableCell>
                    {match.player1 !== "" ? (
                      <span>{match.player1}</span>
                    ) : (
                      <span></span>
                    )}
                  </TableCell>
                  <TableCell>
                    {match.player2 !== "" ? (
                      <span>{match.player2}</span>
                    ) : (
                      <span></span>
                    )}
                  </TableCell>
                  <TableCell>
                    {match.result.count.c1}-{match.result.count.c2}
                  </TableCell>
                  <TableCell>{match.winner}</TableCell>
                  {match.player1 !== "bye" && match.player2 !== "bye" && (
                    <TableCell>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            size="icon"
                            onClick={(e) => {
                              {
                                setGamePoints(match.result.game);
                              }
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full overflow-y-auto">
                          <SheetHeader>
                            <SheetTitle>
                              {match.player1} vs {match.player2}
                            </SheetTitle>
                            <SheetDescription style={{ fontWeight: "bolder" }}>
                              試合の結果を編集します。
                              <br />
                              ゲームのポイントやセットのカウントを入力してください。
                            </SheetDescription>
                            <SheetDescription style={{ color: "red" }}>
                              ・記入されている箇所のみ読み込まれ、未記入の箇所は無視されます。
                              set1のみ入力する場合、set1のみが更新されます。
                              <br />
                              <br />
                              ・入力に「0〇〇」となる場合がございますが、0は無視され、正常に登録されます。
                              <br />
                              例）「010」→「10」
                              <br />
                              <br />
                            </SheetDescription>
                          </SheetHeader>

                          <Button onClick={handleAddSet}>
                            Add {match.result.name}
                          </Button>
                          {sets.map((set) => (
                            <div key={set} className="flex w-full mb-4 p-4">
                              <Card className="w-full">
                                <CardHeader style={{ fontSize: "20px" }}>
                                  {match.result.name} {set}
                                  <Button onClick={() => handleDeleteSet(set)}>
                                    Delete
                                  </Button>
                                </CardHeader>
                                <div className="flex w-full">
                                  <CardContent>
                                    <Label style={{ fontSize: "15px" }}>
                                      {match.player1}
                                    </Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={gamePoints[set]?.player1}
                                      onChange={(e) =>
                                        handleGamePointChange(e, set, "player1")
                                      }
                                    />
                                  </CardContent>
                                  <CardContent>
                                    <Label style={{ fontSize: "15px" }}>
                                      {match.player2}
                                    </Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={gamePoints[set]?.player2}
                                      onChange={(e) =>
                                        handleGamePointChange(e, set, "player2")
                                      }
                                    />
                                  </CardContent>
                                </div>
                              </Card>
                            </div>
                          ))}

                          <Button
                            className="w-full"
                            onClick={(e) => {
                              e.preventDefault();
                              handleUpload(match);
                            }}
                          >
                            保存
                          </Button>
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
export default MatchManagement;
