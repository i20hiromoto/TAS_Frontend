"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "../../ui/header";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TournamentCanvas from "../../ui/tourview";
import { Players, Result } from "../../ui/interface";
import { parse } from "path";

type results = {
  [key: string]: Result[];
};

type GamePoints = {
  [key: string]: {
    player1: number;
    player2: number;
  };
};

interface InputField {
  id: number;
  value: string;
}

export default function AdminScreen() {
  const [players, setPlayers] = useState<Players[]>([]);
  const [matches, setMatches] = useState<results>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState<Players[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<results>({});
  const [editedPlayer, setEditedPlayer] = useState<Players>(
    "" as unknown as Players
  );
  const [editedMatch, setEditedMatch] = useState<results>(
    "" as unknown as results
  );
  const [searchMatch, setSearchMatch] = useState("");
  const [gamePoints, setGamePoints] = useState<GamePoints>({});
  const [sets, setSets] = useState<string[]>([]);
  // const [gamePoints, setGamePoints] = useState<GamePoints>({
  //   set1: { player1: 0, player2: 0 },
  //   set2: { player1: 0, player2: 0 },
  //   set3: { player1: 0, player2: 0 },
  //   set4: { player1: 0, player2: 0 },
  //   set5: { player1: 0, player2: 0 },
  // });

  useEffect(() => {
    const id = sessionStorage.getItem("id") || "0";
    const fetchData = async () => {
      try {
        const response: any = await axios.get(
          `http://localhost:3001/get-admin-data?id=${id}`
        );
        if (Array.isArray(response.data.players)) {
          setPlayers(response.data.players);
          setFilteredPlayers(response.data.players);
          setMatches(response.data.matches);
          setFilteredMatches(response.data.matches);
        }
      } catch (err: any) {
        const errorMessage = err.response
          ? err.response.data.message
          : err.message;
        console.log("Error:", errorMessage);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (Array.isArray(players)) {
      const results = players.filter(
        (player) =>
          player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.seed.toString().includes(searchTerm)
      );
      setFilteredPlayers(results);
    }
  }, [searchTerm, players]);

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

  // const handleAddField = () => {
  //   setInputFields([...inputFields, { id: nextId, value: "" }]);
  //   setNextId(nextId + 1);
  // };

  // const handleRemoveField = (id: number) => {
  //   setInputFields(inputFields.filter((field) => field.id !== id));
  // };

  // const handleGamePointChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   set: string,
  //   player: "player1" | "player2"
  // ) => {
  //   setGamePoints((prev) => ({
  //     ...prev,
  //     [set]: {
  //       ...prev[set],
  //       [player]: parseInt(e.target.value) || 0,
  //     },
  //   }));
  // };

  // プレイヤーが変更されたときにフィルタリング
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Players
  ) => {
    if (editedPlayer) {
      setEditedPlayer({
        ...editedPlayer,
        [field]: e.target.value,
      });
    }
  };

  const handleEdit = () => {
    const id = sessionStorage.getItem("id") || "0";
    console.log(editedPlayer);

    const encodedPlayers = encodeURIComponent(JSON.stringify(editedPlayer));
    if (encodedPlayers) {
      try {
        axios.put(
          `http://localhost:3001/edit-players?id=${id}&players=${encodedPlayers}`
        );
      } catch (err: any) {
        const errorMessage = err.response
          ? err.response.data.message
          : err.message;
        console.log("Error:", errorMessage);
      }
    }
  };

  const handleUpload = async (match: Result) => {
    match.result.game = gamePoints;
    const id = sessionStorage.getItem("id") || "0";
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
    } else if (c1 < c2) {
      match.winner = match.player2;
    } else if (c1 === c2) {
      match.winner = "";
    }
    const encodedMatch = encodeURIComponent(JSON.stringify(match));
    if (encodedMatch) {
      try {
        axios.put(
          `http://localhost:3001/edit-results?id=${id}&match=${encodedMatch}`
        );
      } catch (err: any) {
        const errorMessage = err.response
          ? err.response.data.message
          : err.message;
        console.log("Error:", errorMessage);
      }
    }
  };
  const isNumericString = (str: string) => {
    return !isNaN(Number(str));
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
    <div className="container mx-auto py-10">
      <Header />
      <Tabs defaultValue="players">
        <TabsList>
          <TabsTrigger value="players">選手管理</TabsTrigger>
          <TabsTrigger value="matches">試合管理</TabsTrigger>
          <TabsTrigger value="tournament">トーナメント表示</TabsTrigger>
        </TabsList>
        <TabsContent value="players">
          <Card>
            <CardHeader>
              <CardTitle>選手管理</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="シードまたは名前で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名前</TableHead>
                    <TableHead>チーム</TableHead>
                    <TableHead>シード</TableHead>
                    <TableHead>編集</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayers.map((player: Players) => (
                    <TableRow key={player.id}>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.group}</TableCell>
                      <TableCell>{player.seed}</TableCell>
                      <TableCell>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button
                              size="icon"
                              onClick={(e) => {
                                setEditedPlayer(player);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>
                                {player.name}のデータを編集
                              </SheetTitle>
                              <SheetDescription>
                                選手のデータを編集します
                              </SheetDescription>
                            </SheetHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">名前</Label>
                                <Input
                                  id="name"
                                  value={editedPlayer?.name}
                                  onChange={(e) => handleInputChange(e, "name")}
                                  className="col-span-3"
                                  placeholder={player.name}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">チーム</Label>
                                <Input
                                  id="group"
                                  value={editedPlayer?.group}
                                  placeholder={player.group}
                                  onChange={(e) =>
                                    handleInputChange(e, "group")
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              {/* <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">シード</Label>
                                <Select
                                  onValueChange={(value) =>
                                    setEditedPlayer({
                                      ...editedPlayer!,
                                      seed: value as unknown as number,
                                    })
                                  }
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={player.seed} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>シード</SelectLabel>
                                      {players.map((player) => (
                                        <SelectItem
                                          key={player.seed}
                                          value={player.seed.toString()}
                                        >
                                          {player.seed}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div> */}
                            </div>
                            <SheetFooter>
                              <SheetClose asChild>
                                <Button
                                  type="submit"
                                  onClick={() => handleEdit()}
                                >
                                  保存
                                </Button>
                              </SheetClose>
                            </SheetFooter>
                          </SheetContent>
                        </Sheet>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="matches">
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
                      <TableRow key={match.id}>
                        <TableCell>
                          {parseInt(key) ===
                          Object.keys(filteredMatches).length ? (
                            <span>決勝戦</span>
                          ) : parseInt(key) ===
                            Object.keys(filteredMatches).length - 1 ? (
                            <span>準決勝　第{match.id}試合</span>
                          ) : parseInt(key) ===
                            Object.keys(filteredMatches).length - 2 ? (
                            <span>準々決勝　第{match.id}試合</span>
                          ) : (
                            <span>
                              {parseInt(key)}回戦　第{match.id}試合
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {isNumericString(match.player1) ? (
                            parseInt(key) ===
                            Object.keys(filteredMatches).length ? (
                              <span>準決勝　第{match.player1}試合勝者</span>
                            ) : parseInt(key) ===
                              Object.keys(filteredMatches).length - 1 ? (
                              <span>準々決勝　第{match.player1}試合勝者</span>
                            ) : (
                              <span>
                                {parseInt(key)}回戦　第{match.player1}試合勝者
                              </span>
                            )
                          ) : (
                            <span>{match.player1}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {isNumericString(match.player2) ? (
                            parseInt(key) ===
                            Object.keys(filteredMatches).length ? (
                              <span>準決勝　第{match.player2}試合勝者</span>
                            ) : parseInt(key) ===
                              Object.keys(filteredMatches).length - 1 ? (
                              <span>準々決勝　第{match.player2}試合勝者</span>
                            ) : (
                              <span>
                                {parseInt(key)}回戦　第{match.player2}試合勝者
                              </span>
                            )
                          ) : (
                            <span>{match.player2}</span>
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
                                    // {
                                    //   setEditedMatch(
                                    //     match as unknown as results
                                    //   );
                                    // }
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
                                  <SheetDescription
                                    style={{ fontWeight: "bolder" }}
                                  >
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
                                  <div
                                    key={set}
                                    className="flex w-full mb-4 p-4"
                                  >
                                    <Card className="w-full">
                                      <CardHeader style={{ fontSize: "20px" }}>
                                        {match.result.name} {set}
                                        <Button
                                          onClick={() => handleDeleteSet(set)}
                                        >
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
                                              handleGamePointChange(
                                                e,
                                                set,
                                                "player1"
                                              )
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
                                              handleGamePointChange(
                                                e,
                                                set,
                                                "player2"
                                              )
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
        </TabsContent>
        <TabsContent value="tournament">
          <Card>
            <CardHeader>
              <CardTitle>トーナメント表示</CardTitle>
            </CardHeader>
            <CardContent>
              <TournamentCanvas matches={matches} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
