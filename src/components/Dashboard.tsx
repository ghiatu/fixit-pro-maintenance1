/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Clipboard, Clock, ExternalLink, Wrench, CheckCircle, Monitor, Users, AlertTriangle, CreditCard, RefreshCw } from 'lucide-react';
import { RepairRequest } from '../types';
import { getStats } from '../data/mockData';

interface DashboardProps {
  requests: RepairRequest[];
}

export default function Dashboard({ requests }: DashboardProps) {
  const stats = getStats(requests);

  // Hardcoded realistic month data matching the bar chart ratios in screenshot 2 (years: 2026)
  // Dynamic adjusting based on requests count
  const monthlyData = [
    { name: '2026-03', 'จำนวนคำขอ': 30 + requests.filter(r => r.createdAt.startsWith('2026-03')).length - 3 },
    { name: '2026-04', 'จำนวนคำขอ': 85 + requests.filter(r => r.createdAt.startsWith('2026-04')).length - 4 },
    { name: '2026-05', 'จำนวนคำขอ': 78 + requests.filter(r => r.createdAt.startsWith('2026-05')).length - 4 },
    { name: '2026-06', 'จำนวนคำขอ': 32 + requests.filter(r => r.createdAt.startsWith('2026-06')).length - 3 },
  ];

  // Pie chart data distributions
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const receivedCount = requests.filter(r => r.status === 'received').length;
  const inProgressCount = requests.filter(r => r.status === 'in_progress').length;
  const waitingPartsCount = requests.filter(r => r.status === 'waiting_parts').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;
  const cancelledCount = requests.filter(r => r.status === 'cancelled').length;

  const totalPie = pendingCount + receivedCount + inProgressCount + waitingPartsCount + completedCount + cancelledCount;

  // Pie chart segments with nice matching colors
  const statusData = [
    { name: 'รอรับเรื่อง', value: Math.max(1, pendingCount), color: '#6366F1' }, // Indigo
    { name: 'รับเรื่องแล้ว', value: Math.max(1, receivedCount), color: '#06B6D4' }, // Cyan
    { name: 'กำลังดำเนินการ', value: Math.max(1, inProgressCount), color: '#8B5CF6' }, // Purple
    { name: 'รอชิ้นส่วน', value: Math.max(1, waitingPartsCount), color: '#F59E0B' }, // Amber
    { name: 'เสร็จสิ้น', value: Math.max(1, completedCount), color: '#10B981' }, // Green
    { name: 'ยกเลิก', value: Math.max(1, cancelledCount), color: '#EF4444' }, // Red
  ];

  const formatCost = (val: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'decimal' }).format(val);
  };

  return (
    <div className="space-y-6" id="dashboard-view">
      {/* Metrics Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: คำขอทั้งหมด */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-400 text-xs font-semibold">คำขอทั้งหมด</span>
            <h3 className="text-3xl font-bold font-sans text-gray-950">{stats.total}</h3>
          </div>
          <div className="bg-indigo-600 p-3 rounded-xl text-white shadow-lg shadow-indigo-100">
            <Clipboard className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: รอดำเนินการ */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-400 text-xs font-semibold">รอดำเนินการ</span>
            <h3 className="text-3xl font-bold font-sans text-gray-950">{stats.pending}</h3>
          </div>
          <div className="bg-amber-500 p-3 rounded-xl text-white shadow-sm shadow-amber-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: กำลังดำเนินการ */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-400 text-xs font-semibold">กำลังดำเนินการ</span>
            <h3 className="text-3xl font-bold font-sans text-gray-950">{stats.inProgress}</h3>
          </div>
          <div className="bg-purple-600 p-3 rounded-xl text-white shadow-sm shadow-purple-100">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: เสร็จสิ้น */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-400 text-xs font-semibold">เสร็จสิ้น</span>
            <h3 className="text-3xl font-bold font-sans text-gray-950">{stats.completed}</h3>
          </div>
          <div className="bg-emerald-500 p-3 rounded-xl text-white shadow-sm shadow-emerald-100">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Metrics Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 5: อุปกรณ์ทั้งหมด */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-400 text-xs font-semibold">อุปกรณ์ทั้งหมด</span>
            <h3 className="text-3xl font-bold font-sans text-gray-950">{stats.equipmentCount}</h3>
          </div>
          <div className="bg-cyan-500 p-3 rounded-xl text-white shadow-sm shadow-cyan-100">
            <Monitor className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 6: ช่างซ่อม */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-400 text-xs font-semibold">ช่างซ่อม</span>
            <h3 className="text-3xl font-bold font-sans text-gray-950">{stats.mechanicsCount}</h3>
          </div>
          <div className="bg-violet-500 p-3 rounded-xl text-white shadow-sm shadow-violet-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 7: อะไหล่ใกล้หมด */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-400 text-xs font-semibold">อะไหล่ใกล้หมด</span>
            <h3 className="text-2xl font-bold font-sans text-gray-950">{stats.lowStockCount}</h3>
          </div>
          <div className="bg-red-500 p-3 rounded-xl text-white shadow-sm shadow-rose-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 8: ค่าใช้จ่ายรวม */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-400 text-xs font-semibold">ค่าใช้จ่ายรวม (บาท)</span>
            <h3 className="text-2xl font-bold font-sans text-gray-950">{formatCost(stats.totalCost)}</h3>
          </div>
          <div className="bg-emerald-600 p-3 rounded-xl text-white shadow-sm shadow-emerald-100">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Bar chart (Monthly Stats) - occupies 3 cols */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-150 shadow-xs">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-gray-900 font-sans">
              สถิติรายเดือน
            </h4>
            <p className="text-xs text-gray-400 font-sans">จำนวนรายการแจ้งซ่อมแยกตามเดือน</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#FFF', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelClassName="text-xs font-bold text-gray-700"
                />
                <Bar dataKey="จำนวนคำขอ" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Pie chart (Job Status distribution) - occupies 2 cols */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-150 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-gray-900 font-sans">
              สถานะงาน
            </h4>
            <p className="text-xs text-gray-400 font-sans mb-4">สัดส่วนรายละเอียดประเด็นงานซ่อม</p>
          </div>
          
          <div className="relative h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="55%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#FFF', borderRadius: '12px', border: '1px solid #E5E7EB' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Centered Total */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-7">
              <span className="text-3xl font-extrabold text-gray-800">{requests.length}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">งานทั้งหมด</span>
            </div>
          </div>

          {/* Custom legend alignment to match beautifully */}
          <div className="grid grid-cols-3 gap-2 mt-4 border-t border-gray-150 pt-4 text-center">
            {statusData.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 justify-center">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] text-gray-500 font-medium truncate">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-800 mt-0.5">
                  {requests.filter(r => {
                    if (item.name === 'รอรับเรื่อง') return r.status === 'pending';
                    if (item.name === 'รับเรื่องแล้ว') return r.status === 'received';
                    if (item.name === 'กำลังดำเนินการ') return r.status === 'in_progress';
                    if (item.name === 'รอชิ้นส่วน') return r.status === 'waiting_parts';
                    if (item.name === 'เสร็จสิ้น') return r.status === 'completed';
                    if (item.name === 'ยกเลิก') return r.status === 'cancelled';
                    return false;
                  }).length} งาน
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
