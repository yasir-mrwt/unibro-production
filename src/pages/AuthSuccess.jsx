import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader, CheckCircle, XCircle } from "lucide-react";
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

        // Store token immediately
        localStorage.setItem("token", token);

        // Fetch user data with token
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

          // Call parent success handler
          if (onLoginSuccess) {
            onLoginSuccess(userWithToken);
          }

          // Update UI with events
          window.dispatchEvent(
            new CustomEvent("userLoggedIn", {
              detail: userWithToken,
            })
          );
          window.dispatchEvent(new Event("storage"));

          setStatus("success");

          // Redirect to home after success
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

        // Clear stored data on error
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to home after error
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 3000);
      }
    };

    handleGoogleAuth();
  }, [searchParams, navigate, onLoginSuccess]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center pt-20 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-blue-50 to-purple-50"
      }`}
    >
      <div
        className={`text-center p-8 rounded-2xl shadow-xl max-w-md w-full mx-4 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {status === "loading" && (
          <>
            <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h2
              className={`text-2xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Completing Sign In...
            </h2>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Please wait while we log you in with Google
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2
              className={`text-2xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Welcome to Unibro! 🎉
            </h2>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Successfully signed in with Google
            </p>
            <p
              className={`text-sm mt-2 ${
                darkMode ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Redirecting you to home page...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h2
              className={`text-2xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Authentication Failed
            </h2>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              {errorMessage || "Something went wrong during sign in"}
            </p>
            <p
              className={`text-sm mt-2 ${
                darkMode ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Redirecting to home...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthSuccess;
