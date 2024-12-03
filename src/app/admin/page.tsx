"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "../../ui/header";
import PlayerManagement from "./playermanagement";
import MatchManagement from "./matchmanagement";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TournamentCanvas from "../../ui/tourview";
import { Players, Result } from "../../ui/interface";
import { useRouter } from "next/navigation";

type results = {
  [key: string]: Result[];
};

export default function AdminScreen() {
  const [players, setPlayers] = useState<Players[]>([]);
  const [matches, setMatches] = useState<results>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState<Players[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<results>({});
  const [searchMatch, setSearchMatch] = useState("");
  const [tourinfo, setTourinfo] = useState<any>([]);
  const [cmp_stat, setCmp_stat] = useState<boolean[]>([]);
  const [mode, setMode] = useState<string>("");
  const router = useRouter();
  const gameModes = [
    {
      title: "シングルス",
      description: "シングルス競技の管理画面",
      value: "singles",
      idx: 0,
    },
    {
      title: "ダブルス",
      description: "ダブルス競技の管理画面",
      value: "doubles",
      idx: 1,
    },
    {
      title: "団体戦",
      description: "団体競技の管理画面",
      value: "team",
      idx: 2,
    },
  ];

  useEffect(() => {
    const id = sessionStorage.getItem("id") || "0";
    const fetchData = async () => {
      try {
        const response: any = await axios.get(
          `http://localhost:3001/get-tour-info?id=${id}`
        );
        if (response.data) {
          const info = response.data;
          setTourinfo(info);
          for (let i = 0; i < info.competition.length; i++) {
            if (info.competition[i] === true) {
              setMode(gameModes[i].value);
              break;
            }
          }
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
    console.log("mode", mode);
  }, [mode]);

  useEffect(() => {
    if (tourinfo && tourinfo.competition) {
      const defaultVal =
        tourinfo.competition[0] === true
          ? gameModes[0].value
          : tourinfo.competition[1] === true
          ? gameModes[1].value
          : gameModes[2].value;
      setMode(defaultVal);
    }
  }, [tourinfo]);

  useEffect(() => {
    const id = sessionStorage.getItem("id") || "0";
    const fetchData = async () => {
      try {
        const response: any = await axios.get(
          `http://localhost:3001/get-admin-data?id=${id}`
        );
        if (response.data) {
          console.log(response.data.players[mode]);
          setPlayers(response.data.players[mode]);
          setFilteredPlayers(response.data.players[mode]);
          setMatches(response.data.matches[mode]["base_tournament"]);
          setFilteredMatches(response.data.matches[mode]["base_tournament"]);
          setCmp_stat(tourinfo.competition);
        }
      } catch (err: any) {
        const errorMessage = err.response
          ? err.response.data.message
          : err.message;
        console.log("Error:", errorMessage);
      }
    };

    fetchData();
  });

  const handleCompetitionChange = (mode: string, idx: number) => {
    setMode(mode);
    console.log("mode", mode);
  };
  // プレイヤーが変更されたときにフィルタリング
  return (
    <div>
      <Header />
      <Card>
        <CardHeader>
          <CardTitle style={{ fontSize: "32px" }}>管理画面</CardTitle>
        </CardHeader>
        <CardContent>
          {mode !== "" && (
            <Tabs defaultValue={mode}>
              <TabsList>
                {tourinfo && tourinfo.competition && mode !== "" && (
                  <div>
                    {gameModes.map(
                      (mode, index) =>
                        tourinfo.competition[index] === true && (
                          <TabsTrigger
                            key={mode.idx}
                            value={mode.value}
                            onClick={() =>
                              handleCompetitionChange(mode.value, mode.idx)
                            }
                          >
                            {mode.title}
                          </TabsTrigger>
                        )
                    )}
                  </div>
                )}
              </TabsList>
            </Tabs>
          )}
          <Tabs defaultValue="players">
            <TabsList>
              <TabsTrigger value="players">選手管理</TabsTrigger>
              <TabsTrigger value="matches">試合管理</TabsTrigger>
              <TabsTrigger value="tournament">トーナメント表示</TabsTrigger>
            </TabsList>
            <TabsContent value="players">
              <PlayerManagement
                players={players}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setPlayers={setPlayers}
              />
            </TabsContent>
            <TabsContent value="matches">
              <MatchManagement
                matches={matches}
                searchMatch={searchMatch}
                setSearchMatch={setSearchMatch}
                setMatches={setMatches}
              />
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
        </CardContent>
      </Card>
    </div>
  );
}
