/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle, Flame, Hammer, Eye, Smartphone, Wifi, X } from 'lucide-react';
import { RepairRequest, StatusType } from '../types';

interface LiveSimulatorProps {
  requests: RepairRequest[];
  onTriggerUpdate: (id: string, status: StatusType, costValue?: number) => void;
  open: boolean;
  onClose: () => void;
}

export default function LiveSimulator({ requests, onTriggerUpdate, open, onClose }: LiveSimulatorProps) {
  // Only show pending or active requests in the controller
  const activeRequests = requests.filter(r => r.status !== 'completed' && r.status !== 'cancelled');

  const getStatusActionName = (status: StatusType): string => {
    switch (status) {
      case 'pending': return 'รับเรื่องเลย';
      case 'received': return 'เริ่มซ่อม';
      case 'in_progress': return 'รอส่งชิ้นส่วน';
      case 'waiting_parts': return 'ปิดงานซ่อมเสร็จ!';
      default: return 'ดำเนินการ';
    }
  };

  const getNextStatus = (current: StatusType): StatusType => {
    switch (current) {
      case 'pending': return 'received';
      case 'received': return 'in_progress';
      case 'in_progress': return 'waiting_parts';
      case 'waiting_parts': return 'completed';
      default: return 'completed';
    }
  };

  return (
    <>
      {/* Simulation Slide-Over Widget Panel */}
      {open && (
        <div className="fixed bottom-4 right-4 z-[90] max-w-sm w-full bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl p-5 space-y-4 animate-slide-up" id="simulate-control-panel">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                <Wifi className="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <h4 className="text-sm font-bold font-sans">แผงจำลองการซ่อมแซมวิศวกร</h4>
                <p className="text-[10px] text-slate-400">ควบคุมสถานะเพื่อทดสอบแจ้งเตือนแบบสด</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-slate-450 hover:bg-slate-800 rounded-full transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
            {activeRequests.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                ไม่มีใบงานค้างซ่อมในระบบ! ลองคลิก "+ แจ้งซ่อมใหม่" เพื่อสร้างขึ้นมาใหม่
              </div>
            ) : (
              activeRequests.map((req) => (
                <div key={req.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-indigo-400 font-bold">{req.id}</span>
                    <span className="text-[10px] text-slate-500 font-bold bg-slate-850 px-2 py-0.5 rounded-full">{req.reporterName}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-200 line-clamp-1">{req.equipmentName}</p>
                  
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[10px] text-slate-405">
                      สถานะ: <span className="font-bold text-amber-400">{
                        req.status === 'pending' ? 'รอรับเรื่อง' :
                        req.status === 'received' ? 'รับเรื่องแล้ว' :
                        req.status === 'in_progress' ? 'กำลังดำเนินการ' : 'รอชื้นส่วน'
                      }</span>
                    </div>

                    <button
                      onClick={() => {
                        const next = getNextStatus(req.status);
                        // Assign random mechanic if currently '-'
                        const updatedMechanic = req.assignedMechanic === '-' ? 'รัชชานนท์ ซ่อมได้' : req.assignedMechanic;
                        onTriggerUpdate(req.id, next, next === 'completed' ? 1200 : undefined);
                      }}
                      className="px-2.5 py-1 text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1 transition-all"
                    >
                      <Play className="w-3 h-3 fill-white" /> ปรับเป็น: {
                        req.status === 'pending' ? 'รับเรื่อง' :
                        req.status === 'received' ? 'กำลังซ่อม' :
                        req.status === 'in_progress' ? 'รออะไหล่' : 'ซ่อมเสร็จสิ้น ✨'
                      }
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl text-[10px] text-indigo-200 leading-relaxed border border-indigo-950/40">
            💡 **วิธีการทดสอบ**: ค้นชื่องานตัวเองใน **หน้าลูกค้า** แล้วคลิกปุ่มซ่อมแซมด้านบนเพื่อจำลอง ช่างเทคนิคอัปเดตสถานะ คุณจะได้ยินเสียง chime และเห็นแถบกระบวนการอัปเดตทันทีแบบเรียลไทม์!
          </div>
        </div>
      )}
    </>
  );
}
