"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  CalendarDays,
  Plus,
  Trophy,
  Users,
  ArrowDownToLine,
  PlayCircle,
} from "lucide-react";

import Header from "@/ui/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { Players, TourInfo } from "../ui/interface";

function Dashboard() {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined
  );
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tourinfo, setTourinfo] = useState<TourInfo[]>([]);
  const [upcometour_num, setUpcometour_num] = useState<number>();
  const [upcometour_info, setUpcometour_info] = useState<TourInfo[]>([]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "http://localhost:3001/files/template.xlsx";
    link.download = "template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<TourInfo[]>(
          "http://localhost:3001/get-tour-info"
        );
        setTourinfo(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  });

  useEffect(() => {
    const updateDate = () => {
      let upcometour_num = 0;
      const now = new Date();
      const formattedDate = format(now, "yyyy/MM/dd");

      for (let i = 0; i < tourinfo.length; i++) {
        const targetDate = parseISO(tourinfo[i].date);

        // 現在の日付と任意の日付を比較
        const nowDateOnly = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const targetDateOnly = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          targetDate.getDate()
        );

        if (nowDateOnly < targetDateOnly) {
          // 任意の日付が未来の場合
          upcometour_num++;
          setUpcometour_info((prev) => [...prev, tourinfo[i]]);
        }
      }
      setUpcometour_num(upcometour_num);
    };

    updateDate();
    const intervalId = setInterval(updateDate, 86400000); // 毎日1回更新

    return () => clearInterval(intervalId);
  }, []);

  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleUpload = async () => {
    if (!file || !selectedValue) {
      setError("ファイルとトーナメントの規模を選択してください");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("selectValue", selectedValue);

    try {
      const response = await axios.post<Players[]>(
        "http://localhost:3001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
    } catch (error: any) {
      console.error("Error uploading file:", error);
      setError("ファイルのアップロードに失敗しました");
    } finally {
      setLoading(false);
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-6 px-4 lg:px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">大会数</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tourinfo.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                テンプレートをダウンロード
              </CardTitle>
              <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button onClick={handleDownload}>ダウンロード</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                開催待ちトーナメント
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcometour_num}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                トーナメント生成
              </CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button className="w-full">新規生成</Button>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>開催待ちトーナメント数</CardTitle>
            </CardHeader>
            <CardContent>
              {upcometour_info.length === 0 ? (
                <div className="flex items-center justify-center text-2xl w-50 font-bolder ">
                  開催待ちのトーナメントはありません
                </div>
              ) : (
                upcometour_info.map((item: any, index) => (
                  <div key={index} className="py-2 border-b last:border-none">
                    {item}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>クイックセットアップ</CardTitle>
              <CardDescription>
                ファイルと規模を選択することで、トーナメントをすぐに作成できます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      style={{ width: "300px" }}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Select
                      value={selectedValue}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="規模を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>規模</SelectLabel>
                          <SelectItem value="16">ベスト16</SelectItem>
                          <SelectItem value="32">ベスト32</SelectItem>
                          <SelectItem value="64">ベスト64</SelectItem>
                          <SelectItem value="128">ベスト128</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5"></div>
                  <Button
                    type="submit"
                    onClick={handleUpload}
                    disabled={loading}
                  >
                    {loading ? "アップロード中" : "作成"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;