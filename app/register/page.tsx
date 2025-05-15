"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { CheckCircle, Copy } from "lucide-react"
import Link from "next/link"


// Function to generate a random password
const generatePassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export default function Register() {
  const { t } = useLanguage()
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [copied, setCopied] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setCopied(false)

    if (!fullName.trim()) {
      setError(t("Full name is required"))
      return
    }

    try {
      // Generate a random password
      const password = generatePassword()
      setGeneratedPassword(password)

      // Get existing users or initialize empty array
      const existingUsersJSON = localStorage.getItem("registeredUsers") || "[]"
      const existingUsers = JSON.parse(existingUsersJSON)

      // Add new user
      const newUser = {
        fullName: fullName.trim(),
        password,
        registeredAt: new Date().toISOString(),
        used: false,
      }

      existingUsers.push(newUser)
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers))

      // Show success message with password
      setSuccess(true)

      // Log to console for testing
      console.log("Registered user:", newUser)

      // Also try to send to Telegram if in production
      if (process.env.NODE_ENV === "production") {
        try {
          const message = `
📝 *New Registration*

👤 *Student*: ${fullName.trim()}
🔑 *Password*: ${password}
⏰ *Registered*: ${new Date().toLocaleString()}
          `

          fetch("/api/send-telegram", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
          }).catch((err) => console.error("Failed to send registration to Telegram:", err))
        } catch (err) {
          console.error("Error sending registration to Telegram:", err)
        }
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError(t("registration_error"))
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(generatedPassword)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)
      })
      .catch((err) => {
        console.error("Failed to copy:", err)
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-bold text-center mb-4">{t("Register")}</h1>
        <p className="text-gray-600 text-center mb-6">{t("Register to get a one-time password for the IELTS test")}</p>

        {success ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-700">
              {t("Registration successful! Please save your password.")}
            </div>

            <div className="mt-4 space-y-2">
              <p className="font-medium text-gray-700">{t("Your one-time password:")}:</p>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 p-2 rounded-md flex-1 font-mono text-gray-900">{generatedPassword}</div>
                <button
                  onClick={copyToClipboard}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  title={t("Copy Password")}
                >
                  {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-sm text-amber-600 mt-2">{t("Important: This password can only be used once. Please save it.")}</p>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                {t("Go to Login")}
              </button>
              <button
                onClick={() => {
                  setSuccess(false)
                  setFullName("")
                  setGeneratedPassword("")
                }}
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
              >
                {t("Register Another")}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="mb-6">
              <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
                {t("Full Name")}
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t("Enter Your full name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              {t("Register")}
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {t("Already registered?")}{" "}
                <Link href="/" className="text-blue-600 hover:underline">
                  {t("Login Instead")}
                </Link>
              </p>
            </div>
          </form>
        )}

        <div className="mt-8 text-center text-gray-500 text-sm">&copy; 2025 Dream Zone</div>
      </div>
    </div>
  )
}
