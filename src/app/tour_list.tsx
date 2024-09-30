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
import { CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import { TourInfo } from "../ui/interface";

// Mock data for tournaments

export default function TournamentList() {
  const [tourinfo, setTourinfo] = useState<TourInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

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
                  <TableCell>{format(tournament.date, "yyyy/MM/dd")}</TableCell>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(tournament.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
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
