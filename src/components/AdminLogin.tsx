/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, UserCheck, ShieldAlert, KeyRound, ArrowRightLeft } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToCustomer: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBackToCustomer }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate database lookup conforming to prompt
    setTimeout(() => {
      if (username.trim() === 'admin' && password === '1234') {
        onLoginSuccess();
      } else {
        setError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง (กรุณากลอก admin / 1234)');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto my-12" id="admin-login-screen">
      <div className="bg-white rounded-3xl border border-gray-150 shadow-lg overflow-hidden">
        {/* Banner header */}
        <div className="bg-linear-to-b from-slate-800 to-slate-900 text-white p-8 text-center space-y-3">
          <div className="bg-white/10 p-3 rounded-full inline-block backdrop-blur-xs text-amber-400">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-sans">ผู้ดูแลระบบคิวแจ้งซ่อม (Admin)</h2>
            <p className="text-slate-400 text-xs mt-1">
              เข้าสู่ระบบเพื่อจัดการคิวซ่อม มอบหมายงานช่าง และปรับปรุงรายงานสถิติ
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
            <input
              type="text"
              required
              placeholder="กรอกชื่อผู้ใช้..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/55 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:bg-white text-sm transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
            <input
              type="password"
              required
              placeholder="••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/55 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:bg-white text-sm transition-all text-center tracking-widest font-mono"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <KeyRound className="w-4 h-4 animate-spin" /> กำลังตรวจสอบข้อมูล...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" /> เข้าสู่ระบบควบคุม
                </>
              )}
            </button>
          </div>

          <hr className="border-gray-100 my-6" />

          {/* Portal Switch Button */}
          <button
            type="button"
            onClick={onBackToCustomer}
            className="w-full py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4 text-gray-400" /> กลับสู่หน้าลูกค้าทั่วไป (Customer Portal)
          </button>
        </form>
      </div>

      <div className="text-center mt-4">
        <p className="text-xs text-gray-400">
          🔑 ใช้บัญชีทดสอบ: <span className="font-bold text-gray-600">username: admin</span>, <span className="font-bold text-gray-600">password: 1234</span>
        </p>
      </div>
    </div>
  );
}
