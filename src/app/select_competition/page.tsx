"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Header from "@/ui/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { TourInfo } from "@/ui/interface";

export default function Component() {
  const router = useRouter();
  const [tourinfo, setTourinfo] = useState<any>([]);
  const gameModes = [
    {
      title: "シングルス",
      description: "シングルス競技の管理ページ",
      value: "singles",
      idx: 0,
    },
    {
      title: "ダブルス",
      description: "ダブルス競技の管理ページ",
      value: "doubles",
      idx: 1,
    },
    {
      title: "団体戦",
      description: "団体競技の管理ページ",
      value: "team",
      idx: 2,
    },
  ];

  useEffect(() => {
    const id = parseInt(sessionStorage.getItem("id") || "0");
    const fetchData = async () => {
      try {
        const response = await axios.get<TourInfo[]>(
          "http://localhost:3001/get-tour-info"
        );
        setTourinfo(response.data.find((tourinfo: any) => tourinfo.id === id));
      } catch (error) {
        console.error("An error occurred while fetching tournament data.");
      }
    };

    fetchData();
  }, []);

  const handleSelect = (mode: string, idx: number) => {
    sessionStorage.setItem("competition", mode);
    console.log(tourinfo.competition);
    if (tourinfo.competition[idx] === true) {
      router.push("/admin");
    } else {
      router.push("/tour_list");
    }
  };
  return (
    <div>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        {tourinfo && tourinfo.competition && (
          <div className="grid grid-cols-1 gap-4 justify-items-center">
            {gameModes.map(
              (mode, index) =>
                tourinfo.competition[index] === true && (
                  <Card
                    key={index}
                    className="flex flex-col transition-shadow hover:shadow-lg justify-center w-full max-w-xs h-48" // カードの最大幅を設定
                  >
                    <CardHeader>
                      <CardTitle className="text-center">
                        {mode.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-center text-muted-foreground">
                        {mode.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={() => handleSelect(mode.value, mode.idx)}
                      >
                        ページへ
                      </Button>
                    </CardFooter>
                  </Card>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
