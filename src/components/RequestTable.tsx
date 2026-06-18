/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Eye, Edit3, Trash2, Filter, AlertTriangle, PlusCircle, CheckCircle, Clock, X, Save, RefreshCw } from 'lucide-react';
import { RepairRequest, StatusType, PriorityType } from '../types';
import { MECHANICS, DEPARTMENTS } from '../data/mockData';

interface RequestTableProps {
  requests: RepairRequest[];
  onAddClick: () => void;
  onEditRequest: (request: RepairRequest) => void;
  onDeleteRequest: (id: string) => void;
}

export default function RequestTable({ requests, onAddClick, onEditRequest, onDeleteRequest }: RequestTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Modal Views state
  const [viewRequest, setViewRequest] = useState<RepairRequest | null>(null);
  const [editRequest, setEditRequest] = useState<RepairRequest | null>(null);

  // Filter computation
  const filteredRequests = requests.filter(req => {
    const matchesSearch =
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && req.status === 'pending') ||
      (statusFilter === 'received' && req.status === 'received') ||
      (statusFilter === 'in_progress' && req.status === 'in_progress') ||
      (statusFilter === 'waiting_parts' && req.status === 'waiting_parts') ||
      (statusFilter === 'completed' && req.status === 'completed') ||
      (statusFilter === 'cancelled' && req.status === 'cancelled');

    const matchesPriority =
      priorityFilter === 'all' || req.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Helpers to render styles
  const getPriorityBadge = (p: PriorityType) => {
    switch (p) {
      case 'low':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-gray-50 text-indigo-600 rounded-full inline-flex items-center gap-1">⬇ ต่ำ</span>;
      case 'medium':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-yellow-50 text-yellow-700 rounded-full inline-flex items-center gap-1">= ปานกลาง</span>;
      case 'high':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-orange-50 text-orange-700 rounded-full inline-flex items-center gap-1">↑ สูง</span>;
      case 'urgent':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-600 rounded-full inline-flex items-center gap-1">🔥 เร่งด่วน</span>;
    }
  };

  const getStatusBadge = (s: StatusType) => {
    switch (s) {
      case 'pending':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 rounded-full inline-flex items-center gap-1">🕒 รอรับเรื่อง</span>;
      case 'received':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full inline-flex items-center gap-1">🔹 รับเรื่องแล้ว</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100 rounded-full inline-flex items-center gap-1">⚙️ กำลังดำเนินการ</span>;
      case 'waiting_parts':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-100 rounded-full inline-flex items-center gap-1">🚚 รอชิ้นส่วน</span>;
      case 'completed':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full inline-flex items-center gap-1">✅ เสร็จสิ้น</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-700 border border-red-100 rounded-full inline-flex items-center gap-1">🚫 ยกเลิก</span>;
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editRequest) {
      onEditRequest(editRequest);
      setEditRequest(null);
    }
  };

  return (
    <div className="space-y-4" id="request-table-view">
      {/* Top Filter and Search Action Row */}
      <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <input
            type="text"
            placeholder="ค้นหา..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder-gray-400"
          />
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="pending">🕒 รอรับเรื่อง</option>
            <option value="received">🔹 รับเรื่องแล้ว</option>
            <option value="in_progress">⚙️ กำลังดำเนินการ</option>
            <option value="waiting_parts">🚚 รอชิ้นส่วน</option>
            <option value="completed">✅ เสร็จสิ้น</option>
            <option value="cancelled">🚫 ยกเลิก</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="w-full md:w-48">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
          >
            <option value="all">ความสำคัญทั้งหมด</option>
            <option value="low">⬇ ต่ำ</option>
            <option value="medium">= ปานกลาง</option>
            <option value="high">↑ สูง</option>
            <option value="urgent">🔥 เร่งด่วน</option>
          </select>
        </div>

        {/* New repairs trigger button */}
        <button
          onClick={onAddClick}
          className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:shadow-xl transition-all shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4.5 h-4.5" /> แจ้งซ่อมใหม่
        </button>
      </div>

      {/* Main Table Panel */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-4">รหัส</th>
                <th className="px-4 py-4">วันที่แจ้ง</th>
                <th className="px-4 py-4">ผู้แจ้ง</th>
                <th className="px-4 py-4">แผนก</th>
                <th className="px-4 py-4">อุปกรณ์</th>
                <th className="px-4 py-4">ปัญหา</th>
                <th className="px-4 py-4">ช่างผู้รับงาน</th>
                <th className="px-4 py-4">ความสำคัญ</th>
                <th className="px-4 py-4">สถานะ</th>
                <th className="px-5 py-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-gray-400">
                    ไม่พบข้อมูลประวัติคำขอแจ้งซ่อมที่พึงต้องการ
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-indigo-650 text-indigo-600">{req.id}</td>
                    <td className="px-4 py-4 text-xs text-gray-400 white-space-nowrap">{req.createdAt}</td>
                    <td className="px-4 py-4 font-semibold text-gray-900">{req.reporterName}</td>
                    <td className="px-4 py-4 text-gray-500">{req.department}</td>
                    <td className="px-4 py-4 text-gray-800 font-medium truncate max-w-[150px]">{req.equipmentName}</td>
                    <td className="px-4 py-4 text-gray-500 truncate max-w-[160px]" title={req.description}>{req.description}</td>
                    <td className="px-4 py-4 text-xs font-semibold text-gray-600">{req.assignedMechanic}</td>
                    <td className="px-4 py-4">{getPriorityBadge(req.priority)}</td>
                    <td className="px-4 py-4">{getStatusBadge(req.status)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* View details */}
                        <button
                          onClick={() => setViewRequest(req)}
                          className="bg-indigo-50 text-indigo-600 p-2 rounded-lg hover:bg-indigo-100 transition-all cursor-pointer"
                          title="ดูรายละเอียด"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* Edit details */}
                        <button
                          onClick={() => setEditRequest(req)}
                          className="bg-amber-50 text-amber-600 p-2 rounded-lg hover:bg-amber-100 transition-all cursor-pointer"
                          title="อัปเดตสถานะ/ช่าง"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {/* Delete details */}
                        <button
                          onClick={() => {
                            if (confirm(`คุณแน่ใจหรือไม่ที่จะลบใบงานคิวซ่อมที่ ${req.id}?`)) {
                              onDeleteRequest(req.id);
                            }
                          }}
                          className="bg-rose-50 text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-all cursor-pointer"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL VIEW DETAILS --- */}
      {viewRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-slide-up">
            <div className="bg-indigo-600 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold font-sans text-md flex items-center gap-2">
                📂 รายละเอียดใบคำขอแจ้งซ่อม - {viewRequest.id}
              </h3>
              <button onClick={() => setViewRequest(null)} className="hover:bg-white/20 p-1 rounded-full text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Reporter Info Header */}
              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-3">
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase">ผู้ตรวจแจ้ง</span>
                  <span className="text-sm font-bold text-gray-800">{viewRequest.reporterName}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase">ฝ่าย / แผนก</span>
                  <span className="text-sm font-bold text-gray-800">{viewRequest.department}</span>
                </div>
              </div>

              {/* Equipment Info */}
              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-3">
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase">อุปกรณ์</span>
                  <span className="text-sm font-bold text-indigo-600">{viewRequest.equipmentName}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase">หมวดหมู่</span>
                  <span className="text-sm font-medium text-gray-650">{viewRequest.category}</span>
                </div>
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-3">
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase">ความสำคัญ</span>
                  <span className="mt-1 block">{getPriorityBadge(viewRequest.priority)}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase">สถานะปัจจุบัน</span>
                  <span className="mt-1 block">{getStatusBadge(viewRequest.status)}</span>
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <span className="text-xs text-gray-400 block font-semibold uppercase">ปัญหาที่ตรวจพบ</span>
                <p className="text-sm text-gray-800 bg-gray-50 border border-gray-100 rounded-xl p-3 mt-1.5 leading-relaxed font-medium">
                  {viewRequest.description}
                </p>
              </div>

              {/* Notes */}
              {viewRequest.additionalNotes && (
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase">หมายเหตุสถานที่/เวลาเพิ่มเติม</span>
                  <p className="text-sm text-gray-600 italic bg-amber-50/50 border border-amber-50 rounded-xl p-3 mt-1.5 leading-relaxed">
                    {viewRequest.additionalNotes}
                  </p>
                </div>
              )}

              {/* Repair Progress Assignee & Cost */}
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase">ช่างผู้รับผิดชอบ</span>
                  <span className="text-sm font-bold text-gray-700">{viewRequest.assignedMechanic}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase">ค่าใช้จ่ายบำรุงซ่อม</span>
                  <span className="text-sm font-bold text-emerald-600">{viewRequest.cost > 0 ? `${new Intl.NumberFormat('th-TH').format(viewRequest.cost)} บาท` : 'ไม่มีค่าใช้จ่าย'}</span>
                </div>
              </div>

              {/* Dynamic attachments */}
              {viewRequest.images.length > 0 && (
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase mb-2">รูปภาพที่ประกอบแนบ ({viewRequest.images.length})</span>
                  <div className="grid grid-cols-2 gap-2">
                    {viewRequest.images.map((img, index) => (
                      <div key={index} className="rounded-xl overflow-hidden shadow-xs border border-gray-105 aspect-video bg-gray-50">
                        <img src={img} alt="Repair asset Attachment" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={() => setViewRequest(null)}
                className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-350 text-gray-700 text-sm font-bold transition-all"
              >
                เสร็จสิ้น
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT/ASSIGN REQUEST --- */}
      {editRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 animate-slide-up">
            <div className="bg-amber-500 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold font-sans text-md flex items-center gap-2">
                ⚙️ อัปเดตใบแจ้งซ่อม - {editRequest.id}
              </h3>
              <button onClick={() => setEditRequest(null)} className="hover:bg-white/20 p-1 rounded-full text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="p-6 space-y-4">
                {/* Visual context */}
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">อุปกรณ์และปัญหา</span>
                  <span className="text-sm font-bold text-gray-800">{editRequest.equipmentName}</span>
                  <p className="text-xs text-gray-500 line-clamp-1 truncate">{editRequest.description}</p>
                </div>

                {/* Mechanic Select Dropdown */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5 text-xs uppercase tracking-wide">
                    มอบหมายช่างผู้รับงาน
                  </label>
                  <select
                    value={editRequest.assignedMechanic}
                    onChange={(e) => setEditRequest({ ...editRequest, assignedMechanic: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                  >
                    <option value="-">- ยังไม่ระบุช่าง -</option>
                    {MECHANICS.map(tech => (
                      <option key={tech.id} value={tech.name}>
                        {tech.name} ({tech.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Dropdown */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5 text-xs uppercase tracking-wide">
                    ปรับสถานะใบงาน
                  </label>
                  <select
                    value={editRequest.status}
                    onChange={(e) => setEditRequest({ ...editRequest, status: e.target.value as StatusType })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                  >
                    <option value="pending">🕒 รอรับเรื่อง</option>
                    <option value="received">🔹 รับเรื่องแล้ว</option>
                    <option value="in_progress">⚙️ กำลังดำเนินการ</option>
                    <option value="waiting_parts">🚚 รอชิ้นส่วน</option>
                    <option value="completed">✅ เสร็จสิ้น</option>
                    <option value="cancelled">🚫 ยกเลิก</option>
                  </select>
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5 text-xs uppercase tracking-wide">
                    ความสำคัญ
                  </label>
                  <select
                    value={editRequest.priority}
                    onChange={(e) => setEditRequest({ ...editRequest, priority: e.target.value as PriorityType })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                  >
                    <option value="low">⬇ ต่ำ</option>
                    <option value="medium">= ปานกลาง</option>
                    <option value="high">↑ สูง</option>
                    <option value="urgent">🔥 เร่งด่วน</option>
                  </select>
                </div>

                {/* Cost value input for statistics */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5 text-xs uppercase tracking-wide">
                    ค่าใช้จ่ายรวมอะไหล่และบริการ (บาท)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="ระบุค่าใช้จ่ายจริง"
                    value={editRequest.cost || ''}
                    onChange={(e) => setEditRequest({ ...editRequest, cost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditRequest(null)}
                  className="px-4 py-2 rounded-xl border border-gray-250 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-amber-50"
                >
                  <Save className="w-4 h-4" /> บันทึกการอัปเดต
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
