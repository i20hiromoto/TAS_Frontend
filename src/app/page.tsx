"use client";
import { Button } from "@/components/ui/button";
import React from "react";
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

import { Checkbox } from "@/components/ui/checkbox";

import { Calendar } from "@/components/ui/calendar";

import Header from "@/ui/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { Players, TourInfo } from "../ui/interface";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

function Dashboard() {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined
  );
  const [selectedValue2, setSelectedValue2] = useState<string | undefined>(
    "none"
  );
  const [selectedValue3, setSelectedValue3] = useState<string | undefined>(
    "singles"
  );
  const [tourn_name, setTourn_name] = useState<string>("");
  const [checkboxvalue, setCheckboxValue] = useState<boolean>(false);
  const [checkboxvalue2, setCheckboxValue2] = useState<boolean>(false);
  const [checkboxvalue3, setCheckboxValue3] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [venue, setVenue] = useState<string>("");
  const [deadline, setDeadline] = React.useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tourinfo, setTourinfo] = useState<TourInfo[]>([]);
  const [upcometour_num, setUpcometour_num] = useState<number>(0);
  const [upcometour_info, setUpcometour_info] = useState<TourInfo[]>([]);
  const router = useRouter();
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "http://localhost:3001/files/template.xlsx";
    link.download = "template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   setLoading(true);
  //   if (!token) {
  //     router.push("/login&regist");
  //   }
  //   try {
  //     axios.get("http://localhost:3001/protected"),
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       };
  //   } catch (error: any) {
  //     if (error.response && error.response.status === 403) {
  //       setError("Unauthorized access, please log in again.");
  //       router.push("/login"); // リダイレクト（再ログインページへ）
  //     } else {
  //       setError("Error fetching data.");
  //     }
  //   }
  //   setLoading(false);
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<TourInfo[]>(
          "http://localhost:3001/get-all-tour-info"
        );
        setTourinfo(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updateDate = () => {
      let upcometour_num = 0;
      const now = new Date();

      const upcomingTours = tourinfo.filter((tour) => {
        const targetDate = parseISO(tour.date);
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

        return nowDateOnly < targetDateOnly;
      });

      upcometour_num = upcomingTours.length;
      setUpcometour_num(upcometour_num);
      setUpcometour_info(upcomingTours);
    };

    updateDate();
  }, [tourinfo]);

  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError(null);

    const Sports_stat = {
      singles: checkboxvalue,
      doubles: checkboxvalue2,
      team: checkboxvalue3,
    };

    const formData = new FormData();
    formData.append("name", tourn_name);
    formData.append("date", format(date as Date, "yyyy/MM/dd"));
    formData.append("venue", venue);
    formData.append("deadline", format(deadline as Date, "yyyy/MM/dd"));
    formData.append("ranking", selectedValue2 as string);
    formData.append("sport", selectedValue as string);
    formData.append("competition", JSON.stringify(Sports_stat));
    setLoading(false);
    try {
      const response = await axios.post<any>(
        "http://localhost:3001/generate-tourn",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response !== null) {
        router.push("/tour_list");
      }
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
          {/* <Card className="col-span-4">
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
                    {item.name}
                  </div>
                ))
              )}
            </CardContent>
          </Card> */}
          <Card className="col-span-8">
            <CardHeader>
              <CardTitle>大会作成</CardTitle>
              <CardDescription>
                下の項目を入力するだけで大会データを作成できます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload}>
                <div className="grid w-full items-center gap-4">
                  <Label className="font-bold">大会名を入力</Label>
                  <div className="flex flex-col space-y-1.5">
                    <Input
                      className="w-full"
                      placeholder="例 : 〇〇市民大会"
                      onChange={(e) => setTourn_name(e.target.value)}
                    />
                  </div>
                  <Label className="font-bold">開催地を入力</Label>
                  <div className="flex flex-col space-y-1.5">
                    <Input
                      className="w-full"
                      placeholder="例 : 〇〇市民公園テニスコート"
                      onChange={(e) => setVenue(e.target.value)}
                    />
                  </div>
                  <div className="flex w-full items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center gap-4">
                        <Label className="font-bold">開催日を選択</Label>
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          className="rounded-md border"
                        />
                      </div>
                      <div className="flex flex-col items-center gap-4">
                        <Label className="font-bold">
                          エントリー締切日を選択
                        </Label>
                        <Calendar
                          mode="single"
                          selected={deadline}
                          onSelect={setDeadline}
                          className="rounded-md border"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Select
                      value={selectedValue}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="競技を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>競技</SelectLabel>
                          <SelectItem value="badminton">
                            バドミントン
                          </SelectItem>
                          <SelectItem value="tennis">テニス</SelectItem>
                          <SelectItem value="softtennis">
                            ソフトテニス
                          </SelectItem>
                          <SelectItem value="tabletennis">卓球</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Label className="font-bold">順位決定戦</Label>

                    <Select
                      value={selectedValue2}
                      onValueChange={setSelectedValue2}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="順位決定戦" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>順位決定戦</SelectLabel>
                          <SelectItem value="none">なし</SelectItem>
                          <SelectItem value="4">3~4位</SelectItem>
                          <SelectItem value="8">3~8位</SelectItem>
                          <SelectItem value="16">3~16位</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <div className="grid w-full items-center gap-4">
                      <Label className="font-bold">
                        行う種目にチェックをつけてください
                      </Label>
                    </div>
                    <div className="flex-col space-y-1.5">
                      <Checkbox
                        onClick={(e) => setCheckboxValue(!checkboxvalue)}
                      />
                      <Label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        シングルス
                      </Label>
                    </div>
                    <div className="flex space-y-1.5">
                      <Checkbox
                        onClick={(e) => setCheckboxValue2(!checkboxvalue2)}
                      />
                      <Label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        ダブルス
                      </Label>
                    </div>
                    <div className="flex space-y-1.5">
                      <Checkbox
                        onClick={(e) => setCheckboxValue3(!checkboxvalue3)}
                      />
                      <Label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        団体戦
                      </Label>
                    </div>
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
