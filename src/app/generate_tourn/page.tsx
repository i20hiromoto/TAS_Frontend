"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function TournamentCreator() {
  const [sport, setSport] = useState("");
  const [finalMatch, setFinalMatch] = useState("");
  const [isSingles, setIsSingles] = useState(false);
  const [isDoubles, setIsDoubles] = useState(false);
  const [isTeam, setIsTeam] = useState(false);

  const sports = ["テニス", "バドミントン", "卓球", "ソフトテニス"];
  const finalMatches = ["3~4位", "5~8位", "9~16位"];

  const createTournamentData = () => {
    const tournamentData = {
      sport,
      finalMatch,
      type: isDoubles ? "Doubles" : "Singles",
      createdAt: new Date().toISOString(),
    };

    console.log("Tournament data created:", tournamentData);

    // Reset form after successful submission
    setSport("");
    setFinalMatch("");
    setIsSingles(false);
    setIsDoubles(false);
    setIsTeam(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Tournament</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="sport-select" className="text-sm font-medium">
            競技を選択
          </label>
          <Select value={sport} onValueChange={setSport}>
            <SelectTrigger id="sport-select">
              <SelectValue placeholder="Choose a sport" />
            </SelectTrigger>
            <SelectContent>
              {sports.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label htmlFor="final-match-select" className="text-sm font-medium">
            順位決定戦
          </label>
          <Select value={finalMatch} onValueChange={setFinalMatch}>
            <SelectTrigger id="final-match-select">
              <SelectValue placeholder="Choose final match" />
            </SelectTrigger>
            <SelectContent>
              {finalMatches.map((fm) => (
                <SelectItem key={fm} value={fm}>
                  {fm}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="singles"
            checked={isSingles}
            onCheckedChange={(checked) => setIsSingles(checked as boolean)}
          />
          <label
            htmlFor="singles"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            シングルス競技
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="doubles"
            checked={isDoubles}
            onCheckedChange={(checked) => setIsDoubles(checked as boolean)}
          />
          <label
            htmlFor="doubles"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            ダブルス競技
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="team"
            checked={isTeam}
            onCheckedChange={(checked) => setIsTeam(checked as boolean)}
          />
          <label
            htmlFor="team"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            団体競技
          </label>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={createTournamentData} className="w-full">
          Confirm
        </Button>
      </CardFooter>
    </Card>
  );
}
