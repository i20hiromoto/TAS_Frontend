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
  const router = useRouter();

  useEffect(() => {
    const id = parseInt(sessionStorage.getItem("id") || "0");
    const fetchData = async () => {
      try {
        const response: any = await axios.get(
          "http://localhost:3001/get-tour-info"
        );
        setTourinfo(response.data.find((tourinfo: any) => tourinfo.id === id));
      } catch (error) {
        console.error("An error occurred while fetching tournament data.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const id = sessionStorage.getItem("id") || "0";
    const competition = sessionStorage.getItem("competition") || "singles";
    const strcomp = competition.toString();
    const fetchData = async () => {
      try {
        const response: any = await axios.get(
          `http://localhost:3001/get-admin-data?id=${id}`
        );
        console.log(response.data);
        if (response.data) {
          if (response.data.players[strcomp] === null) {
            router.push("/");
          }
          setPlayers(response.data.players[strcomp]);
          setFilteredPlayers(response.data.players[strcomp]);
          setMatches(response.data.matches[strcomp]["base_tournament"]);
          setFilteredMatches(response.data.matches[strcomp]["base_tournament"]);
          console.log(response.data.matches[strcomp]["base_tournament"]);
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
  // プレイヤーが変更されたときにフィルタリング
  return (
    <div>
      <Header />
      <Card>
        <CardHeader>
          <CardTitle style={{ fontSize: "32px" }}>管理画面</CardTitle>
        </CardHeader>
        <CardContent>
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
