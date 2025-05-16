// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { useLanguage } from "@/components/language-provider"
// import { LanguageSwitcher } from "@/components/language-switcher"
// import Link from "next/link"

// export default function LoginPage() {
//   const { t } = useLanguage()
//   const router = useRouter()
//   const [username, setUsername] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState("")
//   const [isLoading, setIsLoading] = useState(false)

//   useEffect(() => {
//     // Check if user is already logged in
//     const isLoggedIn = sessionStorage.getItem("isLoggedIn")
//     if (isLoggedIn) {
//       router.push("/listening") // Redirect to listening test first
//     }
//   }, [router])

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError("")

//     // Simple validation
//     if (!username || !password) {
//       setError(t("Invalid credentials. Please try again.  "))
//       setIsLoading(false)
//       return
//     }

//     // Check if user exists in localStorage
//     try {
//       const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
//       const user = users.find(
//         (u: any) => u.fullName.toLowerCase() === username.toLowerCase() && u.password === password,
//       )

//       if (user || (username === "superadmin8071" && password === "08268071")) {
//         // Set login status in sessionStorage
//         sessionStorage.setItem("isLoggedIn", "true")
//         sessionStorage.setItem("currentUser", username)

//         // Redirect to test page
//         setTimeout(() => {
//           router.push("/listening") // Redirect to listening test first
//         }, 500)
//       } else {
//         setError(t("Invalid credentials. Please try again."))
//         setIsLoading(false)
//       }
//     } catch (err) {
//       console.error("Error checking credentials:", err)
//       setError(t("an_error_occurred_please_try_again"))
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="absolute top-4 right-4">
//         <LanguageSwitcher />
//       </div>

//       <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
//         <h1 className="text-2xl font-bold text-center mb-4">{t("Login")}</h1>
//         <p className="text-gray-600 text-center mb-6">{t("Please enter your credentials to access the IELTS test")}</p>

//         <form onSubmit={handleLogin}>
//           <div className="mb-4">
//             <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
//               {t("Full Name")}
//             </label>
//             <input
//               id="username"
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder={t("Enter your full name")}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//           </div>

//           <div className="mb-6">
//             <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
//               {t("Password")}
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder={t("Enter your password")}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//           </div>

//           {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
//           >
//             {t("Login")}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <p className="text-gray-600">
//             {t("Don't have an account?")}{" "}
//             <Link href="/register" className="text-blue-600 hover:underline">
//               {t("Register Now")}
//             </Link>
//           </p>
//         </div>

//         <div className="mt-8 text-center text-gray-500 text-sm">&copy; 2025 Dream Zone</div>
//       </div>
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import Link from "next/link"

export default function LoginPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = sessionStorage.getItem("isLoggedIn")
    if (isLoggedIn) {
      const currentUser = sessionStorage.getItem("currentUser")
      if (currentUser === "superadmin8071") {
        router.push("/admin")
      } else {
        router.push("/listening") // Redirect to listening test first
      }
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simple validation
    if (!username || !password) {
      setError(t("Invalid credentials. Please try again."))
      setIsLoading(false)
      return
    }

    // Check for admin login
    if (username === "superadmin8071" && password === "08268071") {
      // Set admin session
      sessionStorage.setItem("isLoggedIn", "true")
      sessionStorage.setItem("currentUser", username)

      // Redirect to admin dashboard
      setTimeout(() => {
        router.push("/admin")
      }, 500)
      return
    }

    // Check if user exists in localStorage
    try {
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const user = users.find(
        (u: any) => u.fullName.toLowerCase() === username.toLowerCase() && u.password === password,
      )

      if (user) {
        // Set login status in sessionStorage
        sessionStorage.setItem("isLoggedIn", "true")
        sessionStorage.setItem("currentUser", username)

        // Redirect to test page
        setTimeout(() => {
          router.push("/listening") // Redirect to listening test first
        }, 500)
      } else {
        setError(t("Invalid credentials. Please try again."))
        setIsLoading(false)
      }
    } catch (err) {
      console.error("Error checking credentials:", err)
      setError(t("an_error_occurred_please_try_again"))
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-bold text-center mb-4">{t("Login")}</h1>
        <p className="text-gray-600 text-center mb-6">{t("Please enter your credentials to access the IELTS test")}</p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              {t("Full Name")}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("Enter your full name")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              {t("Password")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("Enter your password")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            {isLoading ? t("Logging In") : t("Login")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t("Don't have an account?")}{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              {t("Register Now")}
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">&copy; 2025 Dream Zone</div>
      </div>
    </div>
  )
}
