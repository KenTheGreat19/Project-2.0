'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, AlertCircle, KeyRound } from 'lucide-react';

export default function AdminSignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);

  useEffect(() => {
    // Clear any existing admin session
    document.cookie = 'admin_session=; path=/admin; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setAttemptsRemaining(null);

    try {
      const response = await fetch('/api/admin/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          twoFactorCode: requires2FA ? twoFactorCode : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        if (data.requires2FA) {
          setRequires2FA(true);
          setError('');
        } else {
          setError(data.error || 'Authentication failed');
          if (data.attemptsRemaining !== undefined) {
            setAttemptsRemaining(data.attemptsRemaining);
          }
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <div className="relative w-full max-w-md">
        {/* Security Badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full p-4">
            <Shield className="w-12 h-12 text-purple-400" />
          </div>
        </div>

        {/* Sign In Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-slate-400">Secure Access Only</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-400 text-sm">{error}</p>
                {attemptsRemaining !== null && attemptsRemaining > 0 && (
                  <p className="text-red-300 text-xs mt-1">
                    {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!requires2FA ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      placeholder="admin@example.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Two-Factor Authentication Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-center text-2xl tracking-widest placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="000000"
                    required
                    maxLength={6}
                    autoComplete="one-time-code"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  {requires2FA ? 'Verify Code' : 'Sign In Securely'}
                </>
              )}
            </button>

            {requires2FA && (
              <button
                type="button"
                onClick={() => {
                  setRequires2FA(false);
                  setTwoFactorCode('');
                  setError('');
                }}
                className="w-full text-slate-400 hover:text-slate-300 text-sm transition"
              >
                ← Back to login
              </button>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Lock className="w-4 h-4" />
              <span>Encrypted & Protected by Multi-Factor Authentication</span>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-sm text-slate-400">
          <p>All access attempts are logged and monitored</p>
          <p className="mt-1">Unauthorized access is prohibited</p>
        </div>
      </div>
    </div>
  );
}
