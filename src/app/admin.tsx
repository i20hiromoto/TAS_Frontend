"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "../ui/header";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import TournamentCanvas from "../ui/tourview";
import { Players, Result } from "../ui/interface";

export default function AdminScreen() {
  const [players, setPlayers] = useState<Players[]>([]);
  const [matches, setMatches] = useState<{ [key: string]: Result[] }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState<Players[]>([]);
  const [editedPlayer, setEditedPlayer] = useState<Players>();

  useEffect(() => {
    sessionStorage.setItem("id", "1");
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

  const handleEdit = (player: Players) => {
    sessionStorage.setItem("id", "1");
    const id = sessionStorage.getItem("id") || "0";
    const updatedPlayers = players.findIndex((p) => p.seed == player.seed);
    let newdata = [...players];
    if (editedPlayer) {
      newdata[updatedPlayers].group = editedPlayer.group;
      newdata[updatedPlayers].name = editedPlayer.name;
      newdata[updatedPlayers].seed = parseInt(editedPlayer.seed.toString());
    }

    const encodedPlayers = encodeURIComponent(JSON.stringify(newdata));
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

  return (
    <div className="container mx-auto py-10">
      <Header />
      <Tabs defaultValue="players">
        <TabsList>
          <TabsTrigger value="players">選手管理</TabsTrigger>
          <TabsTrigger value="matches">試合管理</TabsTrigger>
          <TabsTrigger value="tournament">トーナメント表示</TabsTrigger>
        </TabsList>
        <TabsContent
          value="players"
          className="flex w-full h-full overflow-hidden"
        >
          <Card className="w-1/2">
            <CardHeader>
              <CardTitle>選手管理</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="シードまたは名前で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Table className=" pr-4 h-full overflow-y-auto">
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
                              <div className="grid grid-cols-4 items-center gap-4">
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
                                    <SelectValue
                                      placeholder={`${player.seed}`}
                                    />
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
                              </div>
                            </div>
                            <SheetFooter>
                              <SheetClose asChild>
                                <Button
                                  type="submit"
                                  onClick={() => handleEdit(player)}
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
          <Card className="w-1/2 pl-4 h-full overflow-auto">
            <CardHeader>
              <CardTitle>トーナメント表示</CardTitle>
            </CardHeader>
            <CardContent>
              <TournamentCanvas matches={matches} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="matches">
          <Card>
            <CardHeader>
              <CardTitle>試合管理</CardTitle>
            </CardHeader>
            <CardContent>
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
                  {Object.keys(matches).map((key) =>
                    matches[key].map((match) => (
                      <TableRow key={match.id}>
                        <TableCell>{key}</TableCell>
                        <TableCell>{match.player1}</TableCell>
                        <TableCell>{match.player2}</TableCell>
                        <TableCell>
                          {match.result.count.c1}-{match.result.count.c2}
                        </TableCell>
                        <TableCell>{match.winner}</TableCell>
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
