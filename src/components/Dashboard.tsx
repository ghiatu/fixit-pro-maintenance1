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

      {/* SLA & REPAIR OVERDUE SUMMARY SECTION */}
      <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-6" id="sla-summary-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-md font-bold text-gray-900 font-sans flex items-center gap-2">
              🕒 ระบบติดตามผลงานซ่อมตามแผน (SLA & Target Completion Monitoring)
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              คำนวณจากความสอดคล้องระหว่าง วันเป้าหมายเสร็จสิ้น (Target Date) และสถานะปัจจุบันของใบงาน
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-650 rounded-full">
              วันนี้: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* SLA KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-rose-800 text-xs font-bold uppercase tracking-wide">⚠️ งานเกินเวลาซ่อม (Overdue SLA)</span>
              <h4 className="text-3xl font-extrabold text-rose-600 font-sans">
                {requests.filter(r => {
                  if (!r.targetDate || r.status === 'completed' || r.status === 'cancelled') return false;
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  const target = new Date(r.targetDate);
                  target.setHours(0,0,0,0);
                  return target < today;
                }).length} <span className="text-xs font-medium text-rose-500">ใบงาน</span>
              </h4>
            </div>
            <div className="bg-rose-500 text-white p-2.5 rounded-lg">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-indigo-800 text-xs font-bold uppercase tracking-wide">📅 กำหนดเป้าหมายแล้ว</span>
              <h4 className="text-3xl font-extrabold text-indigo-700 font-sans">
                {requests.filter(r => r.targetDate).length} <span className="text-xs font-medium text-indigo-500">ใบงาน</span>
              </h4>
            </div>
            <div className="bg-indigo-600 text-white p-2.5 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-emerald-800 text-xs font-bold uppercase tracking-wide">✅ ดำเนินการตามกำหนด</span>
              <h4 className="text-3xl font-extrabold text-emerald-700 font-sans">
                {requests.filter(r => {
                  if (r.status === 'completed') return true;
                  if (!r.targetDate) return false;
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  const target = new Date(r.targetDate);
                  target.setHours(0,0,0,0);
                  return target >= today;
                }).length} <span className="text-xs font-medium text-emerald-500">ใบงาน</span>
              </h4>
            </div>
            <div className="bg-emerald-500 text-white p-2.5 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Detailed Status Counts Table */}
        <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl">
          <span className="text-xs font-bold text-gray-500 uppercase block mb-3">📋 สรุปรายการคำขอแบ่งตามทุกสถานะ (Repair Status Distribution)</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-3xs text-center">
              <span className="text-[11px] font-bold text-gray-400 block">🕒 รอรับเรื่อง</span>
              <span className="text-lg font-extrabold text-indigo-600">{requests.filter(r => r.status === 'pending').length}</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-3xs text-center">
              <span className="text-[11px] font-bold text-cyan-550 block">🔹 รับเรื่องแล้ว</span>
              <span className="text-lg font-extrabold text-cyan-600">{requests.filter(r => r.status === 'received').length}</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-3xs text-center">
              <span className="text-[11px] font-bold text-purple-400 block">⚙️ ดำเนินการ</span>
              <span className="text-lg font-extrabold text-purple-600">{requests.filter(r => r.status === 'in_progress').length}</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-3xs text-center">
              <span className="text-[11px] font-bold text-amber-500 block">🚚 รออะไหล่</span>
              <span className="text-lg font-extrabold text-amber-600">{requests.filter(r => r.status === 'waiting_parts').length}</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-3xs text-center">
              <span className="text-[11px] font-bold text-emerald-600 block">✅ เสร็จสิ้น</span>
              <span className="text-lg font-extrabold text-emerald-600">{requests.filter(r => r.status === 'completed').length}</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-3xs text-center">
              <span className="text-[11px] font-bold text-red-500 block">🚫 ยกเลิกแล้ว</span>
              <span className="text-lg font-extrabold text-red-500">{requests.filter(r => r.status === 'cancelled').length}</span>
            </div>
          </div>
        </div>

        {/* List of Overdue Cases when they exist */}
        {requests.filter(r => {
          if (!r.targetDate || r.status === 'completed' || r.status === 'cancelled') return false;
          const today = new Date();
          today.setHours(0,0,0,0);
          const target = new Date(r.targetDate);
          target.setHours(0,0,0,0);
          return target < today;
        }).length > 0 && (
          <div className="border border-red-200 bg-red-50/30 rounded-xl p-4">
            <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
              รายชื่อใบงานด่วนที่ดำเนินการล่าช้า เกินเป้าหมายจำหน่ายงาน (Overdue Details)
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-red-50/80 border-b border-red-100 text-rose-800 font-bold">
                    <th className="p-2">รหัสใบงาน</th>
                    <th className="p-2">ผู้แจ้ง / แผนก</th>
                    <th className="p-2">รายละเอียดปัญหากลุ่มอุปกรณ์</th>
                    <th className="p-2 text-center">เป้าหมาย (Target)</th>
                    <th className="p-2 text-center">สถานะ</th>
                    <th className="p-2">ช่างซ่อม</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100">
                  {requests.filter(r => {
                    if (!r.targetDate || r.status === 'completed' || r.status === 'cancelled') return false;
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    const target = new Date(r.targetDate);
                    target.setHours(0,0,0,0);
                    return target < today;
                  }).map(r => (
                    <tr key={r.id} className="hover:bg-red-50/50">
                      <td className="p-2 font-bold font-mono text-gray-700">{r.id}</td>
                      <td className="p-2 font-medium text-gray-800">{r.reporterName} ({r.department})</td>
                      <td className="p-2 text-gray-600 truncate max-w-[200px]">{r.equipmentName} - {r.description}</td>
                      <td className="p-2 text-center font-bold text-red-600">{r.targetDate}</td>
                      <td className="p-2 text-center">
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {r.status === 'pending' ? 'รอรับเรื่อง' :
                           r.status === 'received' ? 'รับแล้ว' :
                           r.status === 'in_progress' ? 'ก๊อกเเก๊กทำอยู่' : 'รออะไหล่'}
                        </span>
                      </td>
                      <td className="p-2 font-semibold text-gray-700">{r.assignedMechanic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
