"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Briefcase } from "lucide-react"

const employerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  companyName: z.string().min(2, "Company name is required"),
  employerType: z.enum(["COMPANY", "AGENCY", "CLIENT"], {
    errorMap: () => ({ message: "Please select an employer type" }),
  }),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type EmployerFormData = z.infer<typeof employerSchema>

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function EmployerAuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  } = useForm<EmployerFormData>({
    resolver: zodResolver(employerSchema),
  })

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSignup = async (data: EmployerFormData) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: "EMPLOYER" }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Registration failed")
      }

      toast.success("Account created! Logging you in...")
      
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.error) {
        toast.error("Login failed. Please try again.")
      } else {
        router.push("/employer/dashboard")
        router.refresh()
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Invalid email or password")
      } else {
        router.push("/employer/dashboard")
        router.refresh()
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-[#0A66C2] rounded-full flex items-center justify-center mb-4">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? "Employer Login" : "Employer Sign Up"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Welcome back! Post jobs for free."
              : "Post jobs for free in 2 minutes"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLogin ? (
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...registerLogin("email")}
                  disabled={isLoading}
                />
                {loginErrors.email && (
                  <p className="text-sm text-red-500 mt-1">{loginErrors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...registerLogin("password")}
                  disabled={isLoading}
                />
                {loginErrors.password && (
                  <p className="text-sm text-red-500 mt-1">{loginErrors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0A66C2] hover:bg-[#0A66C2]/90"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  {...registerSignup("name")}
                  disabled={isLoading}
                />
                {signupErrors.name && (
                  <p className="text-sm text-red-500 mt-1">{signupErrors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  {...registerSignup("companyName")}
                  disabled={isLoading}
                />
                {signupErrors.companyName && (
                  <p className="text-sm text-red-500 mt-1">{signupErrors.companyName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="employerType">Employer Type *</Label>
                <select
                  id="employerType"
                  {...registerSignup("employerType")}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Select type...</option>
                  <option value="COMPANY">Company (Requires verification)</option>
                  <option value="AGENCY">Recruitment Agency (Optional verification)</option>
                  <option value="CLIENT">Client/Direct Hire (Optional verification)</option>
                </select>
                {signupErrors.employerType && (
                  <p className="text-sm text-red-500 mt-1">{signupErrors.employerType.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  {...registerSignup("email")}
                  disabled={isLoading}
                />
                {signupErrors.email && (
                  <p className="text-sm text-red-500 mt-1">{signupErrors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="contactEmail">Public Contact Email (Optional)</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="your-company@example.com"
                  {...registerSignup("contactEmail")}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">Public Contact Phone (Optional)</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...registerSignup("contactPhone")}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  {...registerSignup("password")}
                  disabled={isLoading}
                />
                {signupErrors.password && (
                  <p className="text-sm text-red-500 mt-1">{signupErrors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0A66C2] hover:bg-[#0A66C2]/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm">
            {isLogin ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-[#0A66C2] hover:underline font-semibold"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-[#0A66C2] hover:underline font-semibold"
                >
                  Login
                </button>
              </>
            )}
          </div>

          <div className="text-center text-sm text-gray-500">
            <Link href="/auth/applicant" className="text-[#0A66C2] hover:underline">
              Looking for jobs? Applicant login →
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
