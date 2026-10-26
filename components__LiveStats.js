'use client';

import React, { useState, useEffect } from 'react';

export default function LiveStats() {
  const [stats, setStats] = useState({
    onlineUsers: 0,
    totalVisits: 0,
    totalSold: 0,
    systemStatus: 'ONLINE',
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/public-stats');
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch public stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto my-6 p-4 md:p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)] backdrop-blur-md text-white font-sans">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
          <h3 className="text-sm md:text-base font-bold tracking-wider uppercase text-slate-200">
            Statistik Toko (Live Real-Time)
          </h3>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-semibold">
          ● Status Gateway {stats.systemStatus}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-6 text-center">
        <div className="flex flex-col items-center justify-center p-3 md:p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/50 transition-all">
          <span className="text-2xl md:text-4xl font-black text-emerald-400 font-mono tracking-tight">
            {loading ? '...' : stats.onlineUsers.toLocaleString()}
          </span>
          <span className="text-xs md:text-sm text-slate-400 mt-1 font-medium">
            Pengunjung Online
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-3 md:p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-cyan-500/50 transition-all">
          <span className="text-2xl md:text-4xl font-black text-cyan-400 font-mono tracking-tight">
            {loading ? '...' : stats.totalSold.toLocaleString()}
          </span>
          <span className="text-xs md:text-sm text-slate-400 mt-1 font-medium">
            Akun Terjual
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-3 md:p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-purple-500/50 transition-all">
          <span className="text-2xl md:text-4xl font-black text-purple-400 font-mono tracking-tight">
            {loading ? '...' : stats.totalVisits.toLocaleString()}
          </span>
          <span className="text-xs md:text-sm text-slate-400 mt-1 font-medium">
            Total Kunjungan
          </span>
        </div>
      </div>
    </div>
  );
}
