import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useTheme } from "../components/ThemeContext";
import { storeAuthData } from "../services/authService";

const AuthSuccess = ({ onLoginSuccess }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleGoogleAuth = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          setStatus("error");
          setErrorMessage("No authentication token received");
          setTimeout(() => navigate("/"), 3000);
          return;
        }

        localStorage.setItem("token", token);

        const response = await fetch(
          import.meta.env.VITE_API_URL + "/api/auth/me",
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch user data");
        }

        if (data.success && data.user) {
          const userWithToken = {
            ...data.user,
            token: token,
          };

          storeAuthData(userWithToken);

          if (onLoginSuccess) {
            onLoginSuccess(userWithToken);
          }

          window.dispatchEvent(
            new CustomEvent("userLoggedIn", {
              detail: userWithToken,
            })
          );
          window.dispatchEvent(new Event("storage"));

          setStatus("success");

          setTimeout(() => {
            navigate("/", { replace: true });
          }, 1500);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Google auth error:", error);
        setStatus("error");
        setErrorMessage(error.message || "Authentication failed");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 3000);
      }
    };

    handleGoogleAuth();
  }, [searchParams, navigate, onLoginSuccess]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-950" : "bg-gray-50"
      }`}
    >
      <div className="w-full max-w-md px-6 text-center">
        {/* Loading State */}
        {status === "loading" && (
          <div className="space-y-8">
            {/* Simple Clean Spinner */}
            <div className="flex justify-center">
              <Loader2
                className={`w-12 h-12 animate-spin ${
                  darkMode ? "text-blue-500" : "text-blue-600"
                }`}
              />
            </div>

            <div className="space-y-3">
              <h1
                className={`text-2xl font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Authenticating
              </h1>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Please wait while we verify your credentials
              </p>
            </div>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="space-y-8">
            {/* Clean Success Icon */}
            <div className="flex justify-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  darkMode ? "bg-green-500/10" : "bg-green-50"
                }`}
              >
                <CheckCircle
                  className={`w-10 h-10 ${
                    darkMode ? "text-green-500" : "text-green-600"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h1
                className={`text-2xl font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Sign in successful
              </h1>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Welcome back! Redirecting you now...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="space-y-8">
            {/* Clean Error Icon */}
            <div className="flex justify-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  darkMode ? "bg-red-500/10" : "bg-red-50"
                }`}
              >
                <XCircle
                  className={`w-10 h-10 ${
                    darkMode ? "text-red-500" : "text-red-600"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h1
                className={`text-2xl font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Authentication failed
              </h1>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {errorMessage || "Unable to complete sign in"}
              </p>
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Returning to home page...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthSuccess;
