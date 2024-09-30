"use client";

import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
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

import { Players } from "../ui/interface";

const Home: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "http://localhost:3001/files/template.xlsx";
    link.download = "template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  return (
    <div>
      <h1>入力ページ</h1>
      <br />
      <h2>トーナメントの規模を選択してください</h2>
      <br />
      <Select value={selectedValue} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="サイズを選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>トーナメントの規模</SelectLabel>
            <SelectItem value="16">ベスト16</SelectItem>
            <SelectItem value="32">ベスト32</SelectItem>
            <SelectItem value="64">ベスト64</SelectItem>
            <SelectItem value="128">ベスト128</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <br />
      <h3>ページ下にあるボタンよりテンプレートをダウンロードし入力した</h3>
      <h3>Excelファイルをアップロードしてください</h3>
      <br />
      <Input
        type="file"
        onChange={handleFileChange}
        style={{ width: "300px" }}
      />
      <br />
      <h4>データが入力できたら下のボタンをクリックしてください</h4>
      <br />
      <Button onClick={handleUpload} disabled={loading}>
        {loading ? "アップロード中..." : "決定"}
      </Button>
      <br />
      <br />
      <Button onClick={handleDownload}>テンプレートをダウンロード</Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Home;
