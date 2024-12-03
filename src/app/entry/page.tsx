"use client";

import { useState } from "react";
import React from "react";
import Header from "@/ui/header";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function EntryPage() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("id", "76b163f9-3b02-4350-8bf0-bf7d251a70fc");
      formData.append("file", file);
      try {
        axios.post("http://localhost:3001/entry", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">File Upload</h1>

          <div className="mb-6">
            <a
              href="http://localhost:3001/files/template.xlsx"
              download
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Download Template
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload File
              </label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              />
            </div>
            <Button type="submit" className="w-full" disabled={!file}>
              Submit
            </Button>
          </form>

          {file && (
            <p className="mt-4 text-sm text-gray-600">
              Selected file: {file.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
