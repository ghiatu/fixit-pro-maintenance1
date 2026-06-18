/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, ClipboardList, CheckCircle2, AlertCircle, PlayCircle, Clock, Bell, Settings, ArrowRight, UserCheck } from 'lucide-react';
import { RepairRequest, StatusType, PriorityType } from '../types';

interface CustomerPortalProps {
  requests: RepairRequest[];
  onTriggerSimulateProgress: (reqId: string, nextStatus: StatusType) => void;
}

export default function CustomerPortal({ requests, onTriggerSimulateProgress }: CustomerPortalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<RepairRequest | null>(null);
  
  // Audio state
  const [userSoundConsent, setUserSoundConsent] = useState(true);

  // If search query is empty, let's show default placeholders
  const filteredSearch = searchQuery.trim() === ''
    ? []
    : requests.filter(r =>
        r.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Keep selection synced when requests change in real-time
  useEffect(() => {
    if (selectedTicket) {
      const updated = requests.find(r => r.id === selectedTicket.id);
      if (updated && updated.status !== selectedTicket.status) {
        setSelectedTicket(updated);
        // Play notification sound if status changed to completed
        if (updated.status === 'completed' && userSoundConsent) {
          playNotificationSound();
        }
      }
    }
  }, [requests, selectedTicket]);

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Chime tone: elegant synthesizer sound
      const playTone = (frequency: number, startTime: number, duration: number) => {
        const osc = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, startTime);
        
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      
      const now = audioContext.currentTime;
      // High pitched pleasant double chime
      playTone(587.33, now, 0.45); // D5
      playTone(880.00, now + 0.12, 0.6); // A5
    } catch (e) {
      console.log('Unable to auto-play Web Audio. Need user interaction first.', e);
    }
  };

  // Help calculate percent and step indexes
  const getStatusStepIndex = (status: StatusType): number => {
    switch (status) {
      case 'pending': return 0;
      case 'received': return 1;
      case 'in_progress': return 2;
      case 'waiting_parts': return 3;
      case 'completed': return 4;
      case 'cancelled': return 4;
      default: return 0;
    }
  };

  const steps = [
    { label: 'รอยืนยัน', desc: 'ทีมแอดมินรับข้อมูลเข้าระบบ', status: 'pending' },
    { label: 'รับเรื่องแล้ว', desc: 'มอบหมายงานและวางแผนตรวจเช็ค', status: 'received' },
    { label: 'กำลังซ่อมแซม', desc: 'ช่างเทคนิคลงพื้นที่แก้ไขหน้างาน', status: 'in_progress' },
    { label: 'รอรับอะไหล่', desc: 'เครื่องมือ/ชิ้นส่วนอยู่ระหว่างขนส่ง', status: 'waiting_parts' },
    { label: 'เสร็จเรียบร้อย', desc: 'ตรวจเช็คความพร้อมและส่งมอบงาน', status: 'completed' }
  ];

  const currentStepIndex = selectedTicket ? getStatusStepIndex(selectedTicket.status) : 0;

  const handleQuickSelect = (req: RepairRequest) => {
    setSelectedTicket(req);
    // Auto-scroll to details smoothly if on mobile
    document.getElementById('ticket-live-details')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-6" id="customer-portal">
      {/* Search Header Hero Container */}
      <div className="bg-linear-to-r from-indigo-600 to-indigo-800 text-white rounded-3xl p-8 shadow-xl shadow-indigo-100">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-xs text-indigo-100 mb-4 animate-pulse">
            <Bell className="w-4 h-4 text-amber-300" /> ระบบเชื่อมโยงข้อมูลเรียลไทม์ (Live Sync Status)
          </div>
          <h2 className="text-3xl font-bold font-sans tracking-tight">
            ระบบตรวจสอบสถานะงานแจ้งซ่อม
          </h2>
          <p className="text-indigo-100 text-sm mt-2 leading-relaxed">
            ค้นหาชื่อผู้แจ้ง หรือรหัสคำขอแจ้งซ่อม (เช่น REQ00xxxx) เพื่อติดตามการซ่อมได้แบบทันที (Real-time Timeline Checking) 
          </p>

          <div className="relative mt-6 max-w-xl">
            <input
              type="text"
              placeholder="พิมพ์ชื่อของคุณ (เช่น ภาณุ, สุเมธ) หรือรหัสแจ้งซ่อมเพื่อสืบค้น..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-gray-900 border-none shadow-lg text-sm focus:ring-4 focus:ring-indigo-100 placeholder-gray-400"
            />
            <Search className="absolute left-4.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="flex items-center gap-4 mt-4 text-xs">
            <span className="text-indigo-200">💡 ลองค้นหา:</span>
            <button onClick={() => setSearchQuery('ภาณุ พงศ์ภัทร')} className="underline hover:text-white transition-colors cursor-pointer">ภาณุ พงศ์ภัทร</button>
            <button onClick={() => setSearchQuery('สุเมธ ดวงแก้ว')} className="underline hover:text-white transition-colors cursor-pointer">สุเมธ ดวงแก้ว</button>
            <button onClick={() => setSearchQuery('REQ00220')} className="underline hover:text-white transition-colors cursor-pointer">REQ00220</button>
          </div>
        </div>
      </div>

      {/* Main Layout Divided */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Side: Search Results (Occupies 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-150 shadow-xs p-5">
            <h3 className="font-bold font-sans text-sm text-gray-900 border-b border-gray-100 pb-3 mb-3 flex items-center justify-between">
              <span>🔎 รายการค้นพบ ({filteredSearch.length})</span>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-gray-500">
                <input
                  type="checkbox"
                  checked={userSoundConsent}
                  onChange={(e) => setUserSoundConsent(e.target.checked)}
                  className="rounded-sm text-blue-600 border-gray-200"
                />
                เปิดเสียงแจ้งเตือน 🔊
              </label>
            </h3>

            {searchQuery === '' ? (
              <div className="text-center py-8 text-gray-400 space-y-2">
                <ClipboardList className="w-10 h-10 mx-auto text-gray-300" />
                <p className="text-xs">กรุณากรอกคำค้นหาด้านบน เพื่อตรวจสอบคิวแจ้งซ่อมของคุณ</p>
              </div>
            ) : filteredSearch.length === 0 ? (
              <div className="text-center py-8 text-gray-400 space-y-2">
                <AlertCircle className="w-10 h-10 mx-auto text-yellow-500/80" />
                <p className="text-xs">ไม่พบรายการที่ตรงกับคำค้นหา "{searchQuery}"</p>
                <p className="text-[10px] text-gray-400">กรุณาตรวจสอบการสะกดชื่อ-นามสกุล หรือ รหัสแจ้งซ่อมอีกครั้ง</p>
              </div>
            ) : (
              <div className="space-y-2 text-left">
                {filteredSearch.map((req) => (
                  <button
                    key={req.id}
                    onClick={() => handleQuickSelect(req)}
                    className={`w-full p-4 rounded-xl text-left border transition-all flex items-start gap-3 cursor-pointer ${
                      selectedTicket?.id === req.id
                        ? 'bg-blue-50/50 border-blue-400 shadow-xs'
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/20'
                    }`}
                  >
                    <div className="mt-1">
                      {req.status === 'completed' ? (
                        <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-full"><CheckCircle2 className="w-4.5 h-4.5" /></div>
                      ) : req.status === 'cancelled' ? (
                        <div className="bg-rose-100 text-rose-500 p-1.5 rounded-full"><AlertCircle className="w-4.5 h-4.5" /></div>
                      ) : (
                        <div className="bg-amber-100 text-amber-655 p-1.5 rounded-full animate-pulse"><Clock className="w-4.5 h-4.5 text-amber-700" /></div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-blue-600">{req.id}</span>
                        <span className="text-[10px] text-gray-400">{req.createdAt.split(' ')[0]}</span>
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{req.equipmentName}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{req.description}</p>
                      
                      <div className="flex items-center gap-2 pt-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          req.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          req.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          req.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                          req.status === 'waiting_parts' ? 'bg-orange-100 text-orange-850' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {req.status === 'completed' ? 'เสร็จสิ้น 🌟' :
                           req.status === 'cancelled' ? 'ยกเลิก' :
                           req.status === 'in_progress' ? 'ช่างกำลังทำงาน' :
                           req.status === 'waiting_parts' ? 'รออะไหล่' : 'รอดำเนินการ'}
                        </span>
                        
                        {req.assignedMechanic !== '-' && (
                          <span className="text-[10px] text-gray-400">👤 {req.assignedMechanic}</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Active live details (Occupies 3 cols) */}
        <div className="lg:col-span-3" id="ticket-live-details">
          {selectedTicket ? (
            <div className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 space-y-6">
              {/* Card Header with real-time socket indicator */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-600 font-mono font-bold bg-blue-50 px-2.5 py-1 rounded-md">{selectedTicket.id}</span>
                    <span className="text-xs text-gray-400">บันทึกเมื่อ: {selectedTicket.createdAt}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-2">{selectedTicket.equipmentName}</h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    เชื่อมต่อเสถียร (Live-Sync)
                  </div>
                </div>
              </div>

              {/* Step By Step Progress Flow */}
              <div className="space-y-5">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400">สถานะการดำเนินการ (Real-time Timeline)</h4>
                
                {selectedTicket.status === 'cancelled' ? (
                  <div className="p-4 rounded-2xl bg-red-50 text-red-800 border border-red-100 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />
                    <div>
                      <h5 className="font-bold text-sm">คิวงานนี้ถูกยกเลิกแล้ว</h5>
                      <p className="text-xs text-red-600 mt-1">ใบคำแจ้งซ่อมฉบับนี้ถูกยกเลิกหรือลบโดยแอดมินหรือผู้แจ้งความประสงค์ หากต้องการข้อมูลติดต่อฝ่ายสนับสนุนอาคาร</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative pl-6 lg:pl-8 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                    {steps.map((step, idx) => {
                      const isDone = currentStepIndex >= idx;
                      const isCurrent = currentStepIndex === idx;
                      
                      return (
                        <div key={idx} className="relative flex items-start gap-4">
                          {/* Circle bullet index */}
                          <div className={`absolute -left-[20px] lg:-left-[24px] w-[11px] h-[11px] rounded-full ring-4 ${
                            isDone 
                              ? isCurrent 
                                ? 'bg-indigo-600 ring-indigo-100 animate-pulse' 
                                : 'bg-emerald-500 ring-emerald-100' 
                              : 'bg-white ring-gray-100 border border-slate-300'
                          }`} />

                          <div className="flex-1">
                            <span className={`text-sm font-bold block ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                              {step.label} {isCurrent && <span className="text-[10px] font-bold text-indigo-700 px-2 py-0.5 bg-indigo-50 border border-indigo-150 rounded-md ml-2 inline-block">ปัจจุบัน</span>}
                            </span>
                            <span className="text-xs text-gray-500 block mt-0.5">{step.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Assigned mechanic card detail */}
              {selectedTicket.status !== 'cancelled' && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">วิศวกร/ช่างเทคนิคดูแลงาน</span>
                    {selectedTicket.assignedMechanic !== '-' ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {selectedTicket.assignedMechanic.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{selectedTicket.assignedMechanic}</p>
                          <p className="text-[10px] text-gray-500">ทีมซ่อมบำรุงประจำอาคาร</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-gray-500 italic">⏳ กำลังจัดหาช่างเทคนิคลงพื้นที่...</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">ประมาณการค่าซ่อมแซม</span>
                    <p className="text-sm font-bold text-gray-800">
                      {selectedTicket.cost > 0 
                        ? `${new Intl.NumberFormat('th-TH').format(selectedTicket.cost)} บาท`
                        : 'รอการประเมินจากวิศวกร'
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Problem overview block */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">ข้อมูลปัญหาอุปกรณ์</span>
                <div className="p-4 rounded-2xl border border-gray-105 bg-white space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 block">ผู้แจ้งซ่อม:</span>
                      <span className="font-bold text-gray-800">{selectedTicket.reporterName} ({selectedTicket.department})</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">ความระดับความสำคัญ:</span>
                      <span className="font-bold text-gray-800">{selectedTicket.priority === 'urgent' ? '🔥 เร่งด่วน' : selectedTicket.priority === 'high' ? '↑ สูง' : selectedTicket.priority === 'medium' ? 'ปานกลาง' : 'ต่ำ'}</span>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  <div>
                    <span className="text-xs text-gray-400 block mb-1">ปัญหาที่พบตัวจริง :</span>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">{selectedTicket.description}</p>
                  </div>

                  {selectedTicket.images.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs text-gray-400 block mb-2">รูปถ่ายเพื่อวิเคราะห์ :</span>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedTicket.images.map((img, idx) => (
                          <div key={idx} className="aspect-video rounded-lg overflow-hidden border border-gray-150 shadow-xs bg-gray-50">
                            <img src={img} alt="Attachment" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Simulated Customer notification alert banner */}
              {selectedTicket.status === 'completed' && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-emerald-800 text-center space-y-3 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
                    🎉
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-md text-emerald-900">แจ้งเตือน: ซ่อมแซมเสร็จสมบูรณ์แล้ว!</h4>
                    <p className="text-xs text-emerald-700">ช่างเทคนิคได้ทำการแก้ไข ตรวจเช็ค และลงบันทึกซ่อมเสร็จสิ้นแล้วในอาคาร คุณสามารถเข้าใช้งานอุปกรณ์ดังกล่าวได้ตามปกติ</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-3xl border border-gray-150 border-dashed p-12 text-center text-gray-400 space-y-3 flex flex-col items-center justify-center min-h-[400px]">
              <div className="bg-white p-4 rounded-full border border-gray-100 shadow-xs text-gray-400">
                <UserCheck className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-gray-700 font-sans">แผงติดตามความคืบหน้าระดับบุคคล</h3>
              <p className="text-xs max-w-sm leading-relaxed">
                กรุณาป้อนชื่อเพื่อสืบค้น และเลือกบัตรรายการคิวซ่อมด้านซ้าย เพื่อเฝ้าสังเกตความคืบหน้าแบบสดๆ วินาทีต่อวินาที (Live Updates)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
