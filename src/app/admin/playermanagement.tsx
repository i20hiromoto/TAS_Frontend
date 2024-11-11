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
import { Players } from "@/ui/interface";
import { useState, useEffect } from "react";
import axios from "axios";

interface PlayerManagementProps {
  players: Players[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setPlayers: (players: Players[]) => void;
}

const PlayerManagement: React.FC<PlayerManagementProps> = ({
  players,
  searchTerm,
  setSearchTerm,
  setPlayers,
}) => {
  const [filteredPlayers, setFilteredPlayers] = useState<Players[]>([]);
  const [editedPlayer, setEditedPlayer] = useState<Players>({} as Players);
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

  const handleEdit = () => {
    const id = sessionStorage.getItem("id") || "0";
    const competition = sessionStorage.getItem("competition") || "singles";
    console.log(editedPlayer);

    const encodedPlayers = encodeURIComponent(JSON.stringify(editedPlayer));
    if (encodedPlayers) {
      try {
        axios.put(
          `http://localhost:3001/edit-players?id=${id}&players=${encodedPlayers}&competition=${competition}`
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
                        <SheetTitle>{player.name}のデータを編集</SheetTitle>
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
                            onChange={(e) => handleInputChange(e, "group")}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <SheetFooter>
                        <SheetClose asChild>
                          <Button type="submit" onClick={() => handleEdit()}>
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
  );
};
export default PlayerManagement;
