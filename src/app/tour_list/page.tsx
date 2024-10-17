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
import { CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import { TourInfo } from "@/ui/interface";
import { useRouter } from "next/navigation";
import Header from "@/ui/header";

// Mock data for tournaments

export default function TournamentList() {
  const [tourinfo, setTourinfo] = useState<TourInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<TourInfo[]>(
          "http://localhost:3001/get-tour-info"
        );
        setTourinfo(response.data);
      } catch (error) {
        setError("An error occurred while fetching tournament data.");
      }
    };

    fetchData();
  });

  const handleEdit = (id: number) => {
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
      setTourinfo(tourinfo.filter((tournament) => tournament.id !== id));
    } catch (error) {
      setError("An error occurred while deleting tournament data.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Header />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tournament List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Created date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tourinfo.map((tournament) => (
                <TableRow key={tournament.id}>
                  <TableCell>{tournament.id}</TableCell>
                  <TableCell className="font-medium">
                    {tournament.name}
                  </TableCell>
                  <TableCell>{tournament.date}</TableCell>
                  <TableCell>{tournament.gendate}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(tournament.id)}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
