'use client';

import { useRouter } from 'next/navigation';
import { Shield, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';

export function AdminHeader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to sign out?')) {
      return;
    }

    setLoading(true);
    try {
      await fetch('/api/admin/auth/signout', {
        method: 'POST',
      });

      router.push('/admin/signin');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500/20 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Admin Portal</h1>
            <p className="text-sm text-slate-400">Secure Management Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/settings/security')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </button>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{loading ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
