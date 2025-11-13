"use client"

import * as React from "react"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Key, Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import QRCode from "qrcode"

export default function AdminSettings() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showSetup2FA, setShowSetup2FA] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [secret, setSecret] = useState("")
  const [verificationCode, setVerificationCode] = useState("")

  // Password change
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const setup2FA = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/auth/2fa/setup", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Failed to setup 2FA")
        return
      }

      const qrDataUrl = await QRCode.toDataURL(data.qrCode)
      setQrCodeUrl(qrDataUrl)
      setSecret(data.secret)
      setShowSetup2FA(true)
      toast.success("Scan QR code with Google Authenticator")
    } catch (error) {
      toast.error("Failed to setup 2FA")
    } finally {
      setLoading(false)
    }
  }

  const verify2FA = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          token: verificationCode,
          confirm: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Verification failed")
        return
      }

      toast.success("2FA enabled successfully!")
      setTwoFactorEnabled(true)
      setShowSetup2FA(false)
      setVerificationCode("")
    } catch (error) {
      toast.error("Verification failed")
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Failed to change password")
        return
      }

      toast.success("Password changed successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      toast.error("Failed to change password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/admin/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  ApplyNHire Admin
                </h1>
              </a>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {session?.user?.email}
              </span>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Security Settings
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your admin account security
          </p>
        </div>

        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Add an extra layer of security to your admin account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showSetup2FA ? (
              <>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    {twoFactorEnabled ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    )}
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {twoFactorEnabled ? "Enabled" : "Disabled"}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {twoFactorEnabled
                          ? "Your account is protected with 2FA"
                          : "Enable 2FA for enhanced security"}
                      </p>
                    </div>
                  </div>
                  {!twoFactorEnabled && (
                    <Button
                      onClick={setup2FA}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Enable 2FA"
                      )}
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4 p-6 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="bg-white p-4 rounded-lg">
                    <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                  </div>

                  <div className="text-center space-y-2 max-w-md">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Scan this QR code with Google Authenticator or enter the code manually:
                    </p>
                    <code className="block bg-slate-700 text-blue-300 px-4 py-2 rounded text-xs font-mono break-all">
                      {secret}
                    </code>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verify-code">Verification Code</Label>
                  <Input
                    id="verify-code"
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={verify2FA}
                    disabled={loading || verificationCode.length !== 6}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Enable"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSetup2FA(false)
                      setVerificationCode("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your admin password regularly for better security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={changePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Must be at least 8 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Information */}
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Key className="w-5 h-5" />
              Security Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <ul className="list-disc list-inside space-y-1">
              <li>Always enable Two-Factor Authentication for maximum security</li>
              <li>Use a strong, unique password for your admin account</li>
              <li>Never share your admin credentials with anyone</li>
              <li>Log out when not actively using the admin portal</li>
              <li>Keep your authenticator app secure and backed up</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
