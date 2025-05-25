// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { useLanguage } from "@/components/language-provider"
// import { LanguageSwitcher } from "@/components/language-switcher"
// import { CheckCircle, Copy } from "lucide-react"
// import Link from "next/link"


// // Function to generate a random password
// const generatePassword = () => {
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
//   let password = ""
//   for (let i = 0; i < 8; i++) {
//     password += chars.charAt(Math.floor(Math.random() * chars.length))
//   }
//   return password
// }

// export default function Register() {
//   const { t } = useLanguage()
//   const router = useRouter()
//   const [fullName, setFullName] = useState("")
//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState(false)
//   const [generatedPassword, setGeneratedPassword] = useState("")
//   const [copied, setCopied] = useState(false)

//   const handleRegister = (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")
//     setSuccess(false)
//     setCopied(false)

//     if (!fullName.trim()) {
//       setError(t("Full name is required"))
//       return
//     }

//     try {
//       // Generate a random password
//       const password = generatePassword()
//       setGeneratedPassword(password)

//       // Get existing users or initialize empty array
//       const existingUsersJSON = localStorage.getItem("registeredUsers") || "[]"
//       const existingUsers = JSON.parse(existingUsersJSON)

//       // Add new user
//       const newUser = {
//         fullName: fullName.trim(),
//         password,
//         registeredAt: new Date().toISOString(),
//         used: false,
//       }

//       existingUsers.push(newUser)
//       localStorage.setItem("registeredUsers", JSON.stringify(existingUsers))

//       // Show success message with password
//       setSuccess(true)

//       // Log to console for testing
//       console.log("Registered user:", newUser)

//       // Also try to send to Telegram if in production
//       if (process.env.NODE_ENV === "production") {
//         try {
//           const message = `
// 📝 *New Registration*

// 👤 *Student*: ${fullName.trim()}
// 🔑 *Password*: ${password}
// ⏰ *Registered*: ${new Date().toLocaleString()}
//           `

//           fetch("/api/send-telegram", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ message }),
//           }).catch((err) => console.error("Failed to send registration to Telegram:", err))
//         } catch (err) {
//           console.error("Error sending registration to Telegram:", err)
//         }
//       }
//     } catch (err) {
//       console.error("Registration error:", err)
//       setError(t("registration_error"))
//     }
//   }

//   const copyToClipboard = () => {
//     navigator.clipboard
//       .writeText(generatedPassword)
//       .then(() => {
//         setCopied(true)
//         setTimeout(() => setCopied(false), 3000)
//       })
//       .catch((err) => {
//         console.error("Failed to copy:", err)
//       })
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="absolute top-4 right-4">
//         <LanguageSwitcher />
//       </div>

//       <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
//         <h1 className="text-2xl font-bold text-center mb-4">{t("Register")}</h1>
//         <p className="text-gray-600 text-center mb-6">{t("Register to get a one-time password for the IELTS test")}</p>

//         {success ? (
//           <div className="space-y-4">
//             <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-700">
//               {t("Registration successful! Please save your password.")}
//             </div>

//             <div className="mt-4 space-y-2">
//               <p className="font-medium text-gray-700">{t("Your one-time password:")}:</p>
//               <div className="flex items-center gap-2">
//                 <div className="bg-gray-100 p-2 rounded-md flex-1 font-mono text-gray-900">{generatedPassword}</div>
//                 <button
//                   onClick={copyToClipboard}
//                   className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
//                   title={t("Copy Password")}
//                 >
//                   {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
//                 </button>
//               </div>
//               <p className="text-sm text-amber-600 mt-2">{t("Important: This password can only be used once. Please save it.")}</p>
//             </div>

//             <div className="flex justify-between mt-6">
//               <button
//                 onClick={() => router.push("/")}
//                 className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
//               >
//                 {t("Go to Login")}
//               </button>
//               <button
//                 onClick={() => {
//                   setSuccess(false)
//                   setFullName("")
//                   setGeneratedPassword("")
//                 }}
//                 className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
//               >
//                 {t("Register Another")}
//               </button>
//             </div>
//           </div>
//         ) : (
//           <form onSubmit={handleRegister}>
//             <div className="mb-6">
//               <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
//                 {t("Full Name")}
//               </label>
//               <input
//                 id="fullName"
//                 type="text"
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 placeholder={t("Enter Your full name")}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>

//             {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

//             <button
//               type="submit"
//               className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
//             >
//               {t("Register")}
//             </button>

//             <div className="mt-6 text-center">
//               <p className="text-gray-600">
//                 {t("Already registered?")}{" "}
//                 <Link href="/" className="text-blue-600 hover:underline">
//                   {t("Login Instead")}
//                 </Link>
//               </p>
//             </div>
//           </form>
//         )}

//         <div className="mt-8 text-center text-gray-500 text-sm">&copy; 2025 Dream Zone</div>
//       </div>
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
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

      // Show success message without password
      setSuccess(true)

      // Log to console for testing
      console.log("Registered user:", newUser)

      // Also try to send to Telegram if in production
      if (process.env.NODE_ENV === "production") {
        try {
          const message = `
📝 *New Registration Request*

👤 *Student*: ${fullName.trim()}
🔑 *Password*: ${password}
⏰ *Registered*: ${new Date().toLocaleString()}

*Note*: Student has been instructed to contact admin for password.
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
        <p className="text-gray-600 text-center mb-6">{t("Register to get a your password for the IELTS test")}</p>

        {success ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-700">
              Registration successful! Your account has been created.
            </div>

            <div className="mt-4 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="font-medium text-blue-900 mb-2">Next Steps:</h3>
                <p className="text-blue-800 mb-3">
                  To obtain your login password and candidate number, please contact the administrator via Telegram:
                </p>
                <a
                  href="https://t.me/T0pSpeed524kmh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.377 2.618-1.415 3.051-2.896 1.899l-2.837-2.135-1.415 1.36c-.896.896-1.415 1.415-2.896.896l.896-2.837L18.314 7.264c.377-.338-.169-.507-.896-.169L8.426 11.46l-2.837-.896c-.896-.169-.896-.896.169-1.415L18.314 6.368c.896-.338 1.733.169 1.415 1.792z" />
                  </svg>
                  Contact the Admin
                </a>
                <p className="text-sm text-blue-600 mt-2">
                  Please mention your full name: <strong>{fullName}</strong>
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <p className="text-sm text-amber-700">
                  <strong>Important:</strong> Your password will be provided by the administrator and is for single use
                  only.
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Go to Login
              </button>
              <button
                onClick={() => {
                  setSuccess(false)
                  setFullName("")
                  setGeneratedPassword("")
                }}
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
              >
                Register Another
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="mb-6">
              <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
                {t("full_name")}
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t("enter_full_name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              {t("register")}
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {t("already_registered")}{" "}
                <Link href="/" className="text-blue-600 hover:underline">
                  {t("login_instead")}
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
