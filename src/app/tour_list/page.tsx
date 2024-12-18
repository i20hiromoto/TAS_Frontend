"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2, ArrowDownFromLine } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import { TourInfo } from "@/ui/interface";
import { useRouter } from "next/navigation";
import Header from "@/ui/header";
import { response } from "express";

// Mock data for tournaments

export default function TournamentList() {
  const [tourinfo, setTourinfo] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<any>(
          "http://localhost:3001/get-all-tour-info"
        );
        setTourinfo(response.data);
      } catch (error) {
        setError("An error occurred while fetching tournament data.");
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id: number, competition: string) => {
    // Placeholder for edit functionality
    sessionStorage.setItem("id", id.toString());
    router.push(`/admin`);
    console.log(`Editing tournament with id: ${id}`);
  };

  const handleDelete = (id: number) => {
    try {
      const response = axios.delete(
        `http://localhost:3001/delete-tour-info?id=${id}`
      );
      setTourinfo(tourinfo.filter((tournament: any) => tournament.id !== id));
    } catch (error) {
      setError("An error occurred while deleting tournament data.");
    }
  };

  const handleDownload = async (id: number) => {
    try {
      const tour_info = tourinfo.find(
        (tournament: any) => tournament.id === id
      );

      // axiosでGETリクエストを送信し、responseTypeをblobに設定
      const response: any = await axios.get(
        `http://localhost:3001/get-tourn-file?id=${tour_info.id}`,
        {
          responseType: "blob",
        }
      );

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      // ダウンロード処理
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tour_info.name}.xlsx`; // ダウンロードされるファイル名
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">大会一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>大会名</TableHead>
                  <TableHead>開催場所</TableHead>
                  <TableHead>開催日</TableHead>
                  <TableHead>エントリー締切日</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tourinfo.map((tournament: any) => (
                  <TableRow key={tournament.id}>
                    <TableCell className="font-medium">
                      {tournament.name}
                    </TableCell>
                    <TableCell>{tournament.venue}</TableCell>
                    <TableCell>{tournament.date}</TableCell>
                    <TableCell>{tournament.deadline}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleEdit(tournament.id, tournament.competition)
                        }
                        className="mr-2"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>トーナメント削除</DialogTitle>
                          </DialogHeader>
                          <DialogDescription>
                            大会名 : {tournament.name}
                            　を削除します。
                            <div style={{ color: "red" }}>
                              この操作は取り消せません。本当によろしいですか？
                            </div>
                          </DialogDescription>
                          <Button onClick={() => handleDelete(tournament.id)}>
                            削除
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(tournament.id)}
                      >
                        <ArrowDownFromLine className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
