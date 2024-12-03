"use client";

import { use, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icon";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function Component() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  interface UserPayload {
    id: string;
    name: string;
    email: string;
    projects: ProjectRole[];
    iat?: number; // トークン発行時刻 (issued at)
    exp?: number; // トークン有効期限 (expiration)
  }

  interface ProjectRole {
    projectId: string; // プロジェクトID
    role: "admin" | "editor" | "viewer"; // 権限（管理者、編集者、閲覧者）
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:3001/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, []);

  const handleLogin = async () => {
    const data = {
      email: email,
      password: password,
    };
    console.log(data);
    try {
      const response: any = await axios.post(
        `http://localhost:3001/login?data`,
        {
          data,
        }
      );
      if (response.data) {
        response.data.token;
        const decoded = jwtDecode<UserPayload>(response.data.token);
        console.log("decoded : ", decoded);
        localStorage.setItem("token", response.data.token);
        router.push("/");
      }
    } catch (error) {
      console.error("An error occurred while logging in.");
    }
  };

  const handleRegist = async () => {
    const data = {
      name: name,
      email: email,
      password: password,
    };
    console.log(data);
    try {
      const response = await axios.post(`http://localhost:3001/register`, {
        data,
      });
      if (response.data === 200) {
        console.log("Registration successful");
      }
    } catch (error) {
      console.error("An error occurred while registering.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? "Login" : "Create an account"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin
              ? "Enter your email and password to login to your account"
              : "Enter your details to create your account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={onSubmit}>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" required type="password" />
              </div>
            )}
            <Button
              className="w-full mt-4"
              type="submit"
              disabled={isLoading}
              onClick={isLogin ? handleLogin : handleRegist}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLogin ? "Log In" : "Sign Up"}
            </Button>
          </form>
          {isLogin && (
            <div className="text-center text-sm">
              <Link className="underline" href="/forgot-password">
                Forgot password?
              </Link>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 w-full">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Log in"}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
