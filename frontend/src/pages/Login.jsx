import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "@/lib/firebase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Clear API error when user makes changes
    if (apiError) {
      setApiError("");
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission with better state management
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setApiError("");
    setIsSuccess(false); // Reset success state
    
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSuccess(true);
        console.log("Login successful:", data);
        
        // Store token if provided
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }
        
        // Reset form after short delay to show success message
        setTimeout(() => {
          setFormData({ email: "", password: "" });
          setIsSuccess(false); // Reset success state after redirect
          navigate("/main"); // Redirect to MainPage
        }, 2000);
        
      } else {
        setApiError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const payload = {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid,
      provider: "google",
    };

    const response = await fetch("http://localhost:8000/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OAuth login/signup failed:", data.message);
    } else {
      console.log("OAuth login/signup success:", data);
      localStorage.setItem("authUserId", data.userid);
      navigate("/main"); // Redirect to MainPage
    }
  } catch (err) {
    console.error("Google OAuth error:", err);
  }
};


const handleGithubLogin = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;

    if (!user.email) {
      alert("GitHub email not available. Make it public or try another login.");
      return;
    }

    const payload = {
      name: user.displayName || "github_user",
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid,
      provider: "github",
    };

    const response = await fetch("http://localhost:8000/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OAuth login/signup failed:", data.message);
    } else {
      console.log("OAuth login/signup success:", data);
      localStorage.setItem("authUserId", data.userid);
      navigate("/main"); // Redirect to MainPage
    }
  } catch (err) {
    console.error("GitHub OAuth error:", err);
  }
};


  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
    // Implement forgot password flow
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
      <Card className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl p-6">
        <CardHeader className="space-y-1 p-0 mb-4">
          <CardTitle className="text-2xl text-center font-semibold">
            Login to your Account
          </CardTitle>
          <p className="text-sm text-center text-muted-foreground">
            Enter your email and password to login
          </p>
        </CardHeader>
        
        <CardContent className="grid gap-4 p-0">
          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814c-1.784-1.664-4.13-2.675-6.735-2.675-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.496 10-10 0-.67-.069-1.325-.173-1.971h-9.827z" />
              </svg>
              Google
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleGithubLogin}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
              <p className="px-2 text-xs text-muted-foreground">OR</p>
              <span className="w-full border-t border-gray-200"></span>
            </div>
          </div>


          {/* Login Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                className={`h-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className={`h-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            
            <Button 
              onClick={handleSubmit}
              className="w-full h-10 my-3" 
              disabled={isLoading}
            >
              {isLoading ? "LOGGING IN..." : "LOGIN"}
            </Button>
            
            <button
              onClick={handleForgotPassword}
              className="flex justify-center w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              Forgot Password?
            </button>
            
            {/* Success Message - Dark Mode Optimized */}
            {isSuccess && (
              <Alert className="border-green-500/50 bg-green-950/50 text-green-400 dark:border-green-400/50 dark:bg-green-900/30 dark:text-green-300">
                <AlertDescription className="text-center font-medium">
                  ✓ Login successful! Redirecting...
                </AlertDescription>
              </Alert>
            )}
            
            {/* Error Message - Dark Mode Optimized */}
            {apiError && (
              <Alert className="border-red-500/50 bg-red-950/50 text-red-400 dark:border-red-400/50 dark:bg-red-900/30 dark:text-red-300">
                <AlertDescription className="text-center">
                  ⚠ {apiError}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;