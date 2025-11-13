'use client';

import { useState, useEffect } from 'react';
import { Shield, Key, Lock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function AdminSecuritySettings() {
  const [loading, setLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showSetup, setShowSetup] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    checkTwoFactorStatus();
  }, []);

  const checkTwoFactorStatus = async () => {
    try {
      const response = await fetch('/api/admin/auth/2fa/status');
      if (response.ok) {
        const data = await response.json();
        setTwoFactorEnabled(data.enabled || false);
      }
    } catch (error) {
      console.error('Error checking 2FA status:', error);
    }
  };

  const handleSetup2FA = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/auth/2fa', {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setShowSetup(true);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to generate 2FA setup' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    if (verificationCode.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter a valid 6-digit code' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/auth/2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret,
          token: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '2FA enabled successfully!' });
        setTwoFactorEnabled(true);
        setShowSetup(false);
        setQrCode('');
        setSecret('');
        setVerificationCode('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Invalid code. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm('Are you sure you want to disable two-factor authentication? This will reduce your account security.')) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/auth/2fa', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '2FA disabled successfully' });
        setTwoFactorEnabled(false);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to disable 2FA' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-purple-500" />
        <h1 className="text-3xl font-bold text-white">Security Settings</h1>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/30' 
            : 'bg-red-500/10 border border-red-500/30'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
          <p className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
            {message.text}
          </p>
        </div>
      )}

      {/* Two-Factor Authentication Section */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Key className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">Two-Factor Authentication</h2>
              <p className="text-sm text-slate-400">Add an extra layer of security to your account</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            twoFactorEnabled 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-slate-700 text-slate-400'
          }`}>
            {twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>

        {!twoFactorEnabled && !showSetup && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-400 text-sm font-medium mb-1">2FA is not enabled</p>
                <p className="text-yellow-300/80 text-sm">
                  Enable two-factor authentication to protect your admin account from unauthorized access.
                </p>
              </div>
            </div>
            <button
              onClick={handleSetup2FA}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Enable 2FA'}
            </button>
          </div>
        )}

        {showSetup && qrCode && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-block bg-white p-4 rounded-lg">
                <img src={qrCode} alt="2FA QR Code" className="w-64 h-64" />
              </div>
              <div className="space-y-2">
                <p className="text-slate-300 text-sm">
                  Scan this QR code with Google Authenticator, Authy, or any compatible app
                </p>
                <div className="bg-slate-900/50 p-3 rounded-lg">
                  <p className="text-xs text-slate-400 mb-1">Or enter this code manually:</p>
                  <code className="text-blue-400 text-sm font-mono break-all">{secret}</code>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">
                Enter Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-center text-2xl tracking-widest placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="000000"
                maxLength={6}
              />
              <p className="text-xs text-slate-400 text-center">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleEnable2FA}
                disabled={loading || verificationCode.length !== 6}
                className="flex-1 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Enable'}
              </button>
              <button
                onClick={() => {
                  setShowSetup(false);
                  setQrCode('');
                  setSecret('');
                  setVerificationCode('');
                }}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {twoFactorEnabled && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-400 text-sm font-medium mb-1">2FA is active</p>
                <p className="text-green-300/80 text-sm">
                  Your account is protected with two-factor authentication.
                </p>
              </div>
            </div>
            <button
              onClick={handleDisable2FA}
              disabled={loading}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Disabling...' : 'Disable 2FA'}
            </button>
          </div>
        )}
      </div>

      {/* Password Change Section */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-purple-400" />
          <div>
            <h2 className="text-xl font-semibold text-white">Change Password</h2>
            <p className="text-sm text-slate-400">Update your admin password</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter current password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter new password (min 8 characters)"
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Confirm new password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
