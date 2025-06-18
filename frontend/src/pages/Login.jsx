// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");
    try {
      const res = await axios.post("http://localhost:8000/api/login", form);
      setMessage(`✅ Welcome, ${res.data.user.username}`);
    } catch (err) {
      setMessage(err.response?.data?.msg || "❌ Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">Login</Button>
            {message && <p className="text-sm text-center mt-2">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
