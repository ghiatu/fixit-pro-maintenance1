/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  LayoutDashboard, 
  Wrench, 
  PlusCircle, 
  Layers, 
  Database, 
  Smartphone, 
  LogOut, 
  Settings, 
  Menu, 
  X, 
  Radio, 
  CheckCircle, 
  AlertCircle,
  FolderTree,
  Users,
  Building,
  History,
  MessageSquare,
  Wrench as ToolIcon,
  CircleCheck,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { RepairRequest, StatusType, PriorityType, Equipment, SparePart } from './types';
import { INITIAL_REPAIR_REQUESTS, EQUIPMENT_LIST, SPARE_PARTS } from './data/mockData';
import Dashboard from './components/Dashboard';
import RequestTable from './components/RequestTable';
import NewRequestForm from './components/NewRequestForm';
import CustomerPortal from './components/CustomerPortal';
import AdminLogin from './components/AdminLogin';
import TechnicianPortal from './components/TechnicianPortal';

interface FloatingNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export default function App() {
  // Global States
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [activePortal, setActivePortal] = useState<'customer' | 'admin' | 'technician'>('customer');
  const [activeAdminMenu, setActiveAdminMenu] = useState<'dashboard' | 'requests' | 'new_request' | 'equipment' | 'parts' | 'line_notify'>('dashboard');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Floating Notifications state
  const [notifications, setNotifications] = useState<FloatingNotification[]>([]);

  // Local clock state centered in B.E. (Buddhist Era) 2569
  const [time, setTime] = useState<Date>(new Date());

  // Format dynamic clock to match Screenshot 2 precisely
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getThaiClockString = () => {
    // Current date values
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const months = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    
    // We force BE 2569 based on screenshot or add +543 to current year relative to 2026.
    // If system shows 2026, calendar is 2026 + 543 = 2569.
    const dayName = days[time.getDay()];
    const dateNum = time.getDate();
    const monthName = months[time.getMonth()];
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');

    return `${dayName} ${dateNum} ${monthName} 2569 ${hours}:${minutes}:${seconds}`;
  };

  // Safe initialize state from LocalStorage or mock fallback data
  useEffect(() => {
    const stored = localStorage.getItem('building_repair_requests');
    if (stored) {
      try {
        setRequests(JSON.parse(stored));
      } catch (e) {
        setRequests(INITIAL_REPAIR_REQUESTS);
      }
    } else {
      setRequests(INITIAL_REPAIR_REQUESTS);
      localStorage.setItem('building_repair_requests', JSON.stringify(INITIAL_REPAIR_REQUESTS));
    }
  }, []);

  const saveToLocalStorage = (newList: RepairRequest[]) => {
    setRequests(newList);
    localStorage.setItem('building_repair_requests', JSON.stringify(newList));
  };

  // Helper trigger floating push notifications
  const pushNotification = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const newNotif: FloatingNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 5000);
  };

  // ACTIONS HANDLERS
  const handleAddNewRequest = (newFields: Partial<RepairRequest>) => {
    const nextIdNum = requests.length > 0 
      ? Math.max(...requests.map(r => parseInt(r.id.replace('REQ00', '')))) + 1
      : 221;
    
    const newReq: RepairRequest = {
      id: `REQ00${nextIdNum}`,
      createdAt: new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 5),
      reporterName: newFields.reporterName || 'ทั่วไป',
      department: newFields.department || 'ทั่วไป',
      category: newFields.category || 'เครื่องใช้ไฟฟ้า',
      equipmentName: newFields.equipmentName || '',
      priority: newFields.priority || 'medium',
      description: newFields.description || '',
      additionalNotes: newFields.additionalNotes || '',
      images: newFields.images || [],
      assignedMechanic: '-',
      status: 'pending',
      cost: 0,
      updatedAt: new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 5)
    };

    const updated = [newReq, ...requests];
    saveToLocalStorage(updated);

    // Push screen notification
    pushNotification(
      '📥 ส่งคำขอรหัสใหม่!',
      `เราได้รับคำขอแก้ไขอุปกรณ์ ${newFields.equipmentName} เรียบร้อยแล้ว แอดมินกำลังพิจารณาคิว`,
      'info'
    );

    // Auto-migrate view to customer check or requests table depending on context
    if (activePortal === 'admin') {
      setActiveAdminMenu('requests');
    } else {
      // In customer view, we simulate that they can now track it
      pushNotification(
        '👨‍🔧 อยู่ระหว่างติดตามสด',
        `คุณสามารถใส่ชื่อ "${newReq.reporterName}" เพื่อคอยดูตัวติดตามไพพ์ไลน์`,
        'success'
      );
    }
  };

  const handleEditRequest = (edited: RepairRequest) => {
    const oldRequest = requests.find(r => r.id === edited.id);
    const updated = requests.map(r => r.id === edited.id ? {
      ...edited,
      updatedAt: new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 5)
    } : r);
    
    saveToLocalStorage(updated);

    // If status transitioned to completed, notify the client!
    if (oldRequest && oldRequest.status !== 'completed' && edited.status === 'completed') {
      pushNotification(
        `✅ ซ่อมเสร็จสิ้น! บิลใบงาน: ${edited.id}`,
        `อุปกรณ์ "${edited.equipmentName}" ได้รับการแก้ไขโดยช่าง "${edited.assignedMechanic}" เรียบร้อยแล้ว`,
        'success'
      );
    } else {
      pushNotification(
        `⚙️ ปรับปรุงใบงาน ${edited.id}`,
        `สถานะปัจจุบันถูกปรับเป็น: ${
          edited.status === 'completed' ? 'เสร็จสิ้น' : 
          edited.status === 'in_progress' ? 'กำลังดำเนินการ' : 
          edited.status === 'waiting_parts' ? 'รอชิ้นส่วนอะไหล่' : 'ปรับเปลี่ยนรายละเอียด'
        }`,
        'info'
      );
    }
  };

  const handleDeleteRequest = (id: string) => {
    const updated = requests.filter(r => r.id !== id);
    saveToLocalStorage(updated);
    pushNotification('🗑️ ลบใบงานซ่อม', `รหัส ${id} ถูกลบออกจากฐานข้อมูลกลางของอาคารเรียบร้อย`, 'warning');
  };

  // Mock DB list for equipment checking in Master-Tabs
  const handleToggleEquipmentStatus = (id: string) => {
    pushNotification('🔧 อัปเดตอุปกรณ์', 'สถานะการตรวจสภาพอุปกรณ์ชิ้นนี้ถูกบันทึกเรียบร้อย', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans transition-all selection:bg-indigo-600 selection:text-white" id="main-container">
      
      {/* APP HEADER NAVBAR BAR */}
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-6 sm:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5 leading-none">
              FixIt Pro <span className="text-indigo-600 font-extrabold hidden sm:inline">Building Maintenance</span>
              <span className="text-[10px] text-indigo-700 font-extrabold bg-indigo-50 border border-indigo-100 rounded-md px-1.5 py-0.5">Online v2.4</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium hidden sm:block mt-0.5">ระบบลูกค้าแจ้งซ่อมอุปกรณ์ในอาคาร มีพอร์ทัลตรวจคิวงานบำรุงเรียลไทม์</p>
          </div>
        </div>

        {/* Real-time Ticking Clock BE 2569 display */}
        <div className="hidden lg:flex items-center gap-2 text-slate-600 text-xs font-semibold bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          <Clock className="w-4 h-4 text-indigo-600 shrink-0 animate-pulse" />
          <span className="font-mono tracking-wider">{getThaiClockString()}</span>
        </div>

        {/* Portal Switch Controls on header */}
        <div className="flex items-center gap-3">
          {/* Switch Tab */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => {
                setActivePortal('customer');
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePortal === 'customer' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                  : 'text-slate-500 hover:text-slate-805 hover:text-slate-800'
              }`}
            >
              หน้าแจ้งซ่อม
            </button>
            <button
              onClick={() => {
                setActivePortal('technician');
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePortal === 'technician' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' 
                  : 'text-slate-500 hover:text-slate-808 hover:text-slate-800'
              }`}
            >
              หน้างานช่าง 👨‍🔧
            </button>
            <button
              onClick={() => {
                setActivePortal('admin');
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePortal === 'admin' 
                  ? 'bg-slate-700 text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-805 hover:text-slate-800'
              }`}
            >
              แอดมิน 🔑
            </button>
          </div>

          {/* Mobile Hamburguer trigger */}
          {activePortal === 'admin' && isAdminLoggedIn && (
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </header>

      {/* RENDER BODY PORTAL */}
      <div className="flex-1 flex flex-col lg:flex-row relative">

        {/* ADMIN PORTAL LEFT SIDEBAR (Renders only if in admin view and logged in) */}
        {activePortal === 'admin' && isAdminLoggedIn && (
          <aside className={`w-full lg:w-64 bg-white text-slate-600 shrink-0 border-r border-slate-200 flex flex-col justify-between ${
            mobileMenuOpen ? 'block' : 'hidden lg:flex'
          }`}>
            <div className="p-5 space-y-6">
              {/* Profile Block */}
              <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="bg-indigo-600 text-white p-2.5 rounded-xl font-bold text-xs shadow-md shadow-indigo-150">
                  AD
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Admin (ผู้ดูแลระบบ)</h4>
                  <p className="text-[10px] text-indigo-600 font-bold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
                    ระบบเสถียรสูงสุด
                  </p>
                </div>
              </div>

              {/* Sidebar Menu sections */}
              <div className="space-y-4 text-left">
                {/* Section 1: เมนูหลัก */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3 block mb-1">เมนูหลัก</span>
                  
                  <button
                    onClick={() => { setActiveAdminMenu('dashboard'); setMobileMenuOpen(false); }}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                      activeAdminMenu === 'dashboard' 
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${activeAdminMenu === 'dashboard' ? 'bg-indigo-600' : 'bg-transparent'}`}></div>
                    <LayoutDashboard className="w-4 h-4" /> แดชบอร์ด (Dashboard)
                  </button>

                  <button
                    onClick={() => { setActiveAdminMenu('requests'); setMobileMenuOpen(false); }}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                      activeAdminMenu === 'requests' 
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${activeAdminMenu === 'requests' ? 'bg-indigo-600' : 'bg-transparent'}`}></div>
                    <Wrench className="w-4 h-4" /> คำขอแจ้งซ่อมทั้งหมด
                  </button>

                  <button
                    onClick={() => { setActiveAdminMenu('new_request'); setMobileMenuOpen(false); }}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                      activeAdminMenu === 'new_request' 
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${activeAdminMenu === 'new_request' ? 'bg-indigo-600' : 'bg-transparent'}`}></div>
                    <PlusCircle className="w-4 h-4" /> ป้อนใบแจ้งซ่อมใหม่
                  </button>
                </div>

                {/* Section 2: ข้อมูลหลัก */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3 block mb-1">ข้อมูลหลัก (Master Data)</span>
                  
                  <button
                    onClick={() => { setActiveAdminMenu('equipment'); setMobileMenuOpen(false); }}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                      activeAdminMenu === 'equipment' 
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${activeAdminMenu === 'equipment' ? 'bg-indigo-600' : 'bg-transparent'}`}></div>
                    <Layers className="w-4 h-4" /> ทะเบียบนอุปกรณ์ในอาคาร
                  </button>

                  <button
                    onClick={() => { setActiveAdminMenu('parts'); setMobileMenuOpen(false); }}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                      activeAdminMenu === 'parts' 
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${activeAdminMenu === 'parts' ? 'bg-indigo-600' : 'bg-transparent'}`}></div>
                    <Database className="w-4 h-4" /> อะไหล่ในคลังบำรุง
                  </button>
                </div>

                {/* Section 3: รายงาน & ระบบ */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3 block mb-1">ระบบงานหลังบ้าน</span>
                  
                  <button
                    onClick={() => { setActiveAdminMenu('line_notify'); setMobileMenuOpen(false); }}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                      activeAdminMenu === 'line_notify' 
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${activeAdminMenu === 'line_notify' ? 'bg-indigo-600' : 'bg-transparent'}`}></div>
                    <Smartphone className="w-4 h-4" /> แจ้งเตือนผ่าน LINE Group
                  </button>
                </div>
              </div>

              {/* System status widget */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xs">
                  <p className="text-[10px] opacity-70 uppercase tracking-wider mb-0.5">System Status</p>
                  <p className="text-xs font-extrabold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Fully Operational
                  </p>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                    <div className="w-full h-full bg-emerald-400"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout on sidebar bottom */}
            <div className="p-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsAdminLoggedIn(false);
                  pushNotification('🔒 ออกจากระบบ', 'คุณออกจากระบบแอดมินเรียบร้อย', 'info');
                }}
                className="w-full px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-500 flex items-center gap-2 justify-center transition-all border border-slate-200 hover:border-red-200 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> ออกจากระบบ Admin
              </button>
            </div>
          </aside>
        )}

        {/* MAIN PANEL CONTENT SPACE */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto min-h-0">
          
          {/* CUSTOMER PORTAL VIEW */}
          {activePortal === 'customer' && (
            <div className="space-y-8">
              {/* Special selector for Customer to decide: Submit New or Check Status Live */}
              <div className="flex items-center justify-center gap-4 border-b border-slate-200 pb-4">
                <span className="text-sm font-bold text-slate-400">เลือกบริการลูกค้า:</span>
                <button
                  onClick={() => setActiveAdminMenu('new_request')} // We route new request action of customer
                  className={`px-4.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activePortal === 'customer' && activeAdminMenu === 'new_request'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <PlusCircle className="w-4.5 h-4.5" /> 📝 แจ้งซ่อมใหม่ (บันทึกข้อมูล)
                </button>
                <button
                  onClick={() => setActiveAdminMenu('dashboard')} // Fallback default trackers
                  className={`px-4.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activePortal === 'customer' && activeAdminMenu !== 'new_request'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <Smartphone className="w-4.5 h-4.5" /> 📡 ตรวจสอบสถานะการซ่อมเรียลไทม์
                </button>
              </div>

              {/* Active content conditional */}
              {activeAdminMenu === 'new_request' ? (
                <NewRequestForm 
                  onSubmit={(newRequest) => {
                    handleAddNewRequest(newRequest);
                    // Automatically redirect to check status page after submit
                    setActiveAdminMenu('dashboard');
                  }}
                  onCancel={() => {
                    setActiveAdminMenu('dashboard');
                  }}
                />
              ) : (
                <CustomerPortal 
                  requests={requests} 
                  onTriggerSimulateProgress={(reqId, nextStatus) => {
                    const target = requests.find(r => r.id === reqId);
                    if (target) {
                      handleEditRequest({
                        ...target,
                        status: nextStatus
                      });
                    }
                  }}
                />
              )}
            </div>
          )}

          {/* TECHNICIAN PORTAL VIEW */}
          {activePortal === 'technician' && (
            <TechnicianPortal 
              requests={requests}
              onUpdateWork={handleEditRequest}
              pushNotification={pushNotification}
            />
          )}

          {/* ADMIN PORTAL VIEW */}
          {activePortal === 'admin' && (
            <>
              {!isAdminLoggedIn ? (
                <AdminLogin 
                  onLoginSuccess={() => {
                    setIsAdminLoggedIn(true);
                    setActiveAdminMenu('dashboard');
                    pushNotification('🔓 เข้าสู่ระบบสำเร็จ', 'ยินดีต้อนรับผู้ดูแลระบบอาคาร เข้าถึงเมนูหลังบ้านได้แล้ว', 'success');
                  }}
                  onBackToCustomer={() => {
                    setActivePortal('customer');
                  }}
                />
              ) : (
                <div className="space-y-4">
                  
                  {/* Dynamic page title header depending on menu */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-150 pb-4">
                    <div>
                      <h2 className="text-xl font-extrabold text-gray-950 font-sans tracking-tight">
                        {activeAdminMenu === 'dashboard' && '📊 แผงควบคุมสถิติสรุปยอด'}
                        {activeAdminMenu === 'requests' && '📥 รายการคำขอประสานงานแจ้งซ่อม'}
                        {activeAdminMenu === 'new_request' && '📝 บันทึกข้อมูลเพื่อเริ่มซ่อมใหม่'}
                        {activeAdminMenu === 'equipment' && '🏢 สังกัดฐานทะเบียนอุปกรณ์ในอาคาร'}
                        {activeAdminMenu === 'parts' && '📦 รายชื่อชิ้นส่วนในคลังบำรุง'}
                        {activeAdminMenu === 'line_notify' && '📱 การกำหนดส่งสติกเกอร์ & ไลน์แจ้งเตือน'}
                      </h2>
                      <p className="text-gray-400 text-xs mt-1">
                        {activeAdminMenu === 'dashboard' && 'ภาพรวมระบบข้อมูลบำรุงและการวิเคราะห์รอบเดือน'}
                        {activeAdminMenu === 'requests' && 'อัปเดตสถานะ กำหนดวิศวกรผู้ดูแล หรือยกเลิกใบงาน'}
                        {activeAdminMenu === 'new_request' && 'แผงบันทึกฟอร์มแทนโดยฝ่ายประสานงานส่วนกลาง'}
                        {activeAdminMenu === 'equipment' && 'ตรวจสอบความขัดข้อง สุขภาพเครื่องจักรและกล้อง'}
                        {activeAdminMenu === 'parts' && 'รายงานปริมาณอะไหล่สำรอง ป้องกันของขาดแคลน'}
                        {activeAdminMenu === 'line_notify' && 'เชื่อมโยง Token Line Notify เพื่อแจ้งผู้เข้าซ่อมเมื่อเสร็จภารกิจ'}
                      </p>
                    </div>

                    {activeAdminMenu !== 'new_request' && activeAdminMenu !== 'dashboard' && (
                      <div className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 flex items-center gap-1.5 animate-pulse">
                        <CheckCircle className="w-4 h-4" /> ฐานข้อมูลเชื่อมโยงคลังสมบูรณ์
                      </div>
                    )}
                  </div>

                  {/* Active content block rendering */}
                  {activeAdminMenu === 'dashboard' && (
                    <Dashboard requests={requests} />
                  )}

                  {activeAdminMenu === 'requests' && (
                    <RequestTable 
                      requests={requests}
                      onAddClick={() => setActiveAdminMenu('new_request')}
                      onEditRequest={handleEditRequest}
                      onDeleteRequest={handleDeleteRequest}
                    />
                  )}

                  {activeAdminMenu === 'new_request' && (
                    <NewRequestForm 
                      onSubmit={(newFields) => {
                        handleAddNewRequest(newFields);
                        setActiveAdminMenu('requests');
                      }}
                      onCancel={() => {
                        setActiveAdminMenu('requests');
                      }}
                    />
                  )}

                  {/* MASTER TAB: EQUIPMENT LIST */}
                  {activeAdminMenu === 'equipment' && (
                    <div className="bg-white rounded-2xl border border-gray-150 p-6 space-y-4 shadow-xs">
                      <div className="flex justify-between items-center bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-xs">
                        <p className="font-semibold text-indigo-800">ℹ️ คุณสมบัติอุปกรณ์ทั้งหมดถูกเก็บไว้ในทะเบียนทรัพย์สินอาคาร เพื่อความแม่นยำในการคิวป้ายส่งซ่อม</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                              <th className="p-3">รหัสอุปกรณ์</th>
                              <th className="p-3">ชื่อทรัพย์สิน</th>
                              <th className="p-3">หมวดประเภท</th>
                              <th className="p-3 text-center">สถานะปัจจุบัน</th>
                              <th className="p-3">ตรวจสอบล่าสุด</th>
                              <th className="p-3 text-center">แก้ไขข้อมูล</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm divide-y divide-gray-150">
                            {EQUIPMENT_LIST.map(eq => (
                              <tr key={eq.id} className="hover:bg-gray-50/20">
                                <td className="p-3 font-mono font-bold text-gray-500">{eq.id}</td>
                                <td className="p-3 font-semibold text-gray-800">{eq.name}</td>
                                <td className="p-3 text-gray-500">{eq.category}</td>
                                <td className="p-3 text-center">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                    eq.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                                    eq.status === 'repairing' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {eq.status === 'active' ? 'พร้อมใช้งาน' :
                                     eq.status === 'repairing' ? 'อยู่ระหว่างซ่อมแซม' : 'ขัดข้องชำรุด'}
                                  </span>
                                </td>
                                <td className="p-3 text-xs text-gray-400">{eq.lastChecked}</td>
                                <td className="p-3 text-center">
                                  <button onClick={() => handleToggleEquipmentStatus(eq.id)} className="text-indigo-600 font-semibold text-xs hover:underline cursor-pointer">
                                    กดบันทึกเช็คสภาพ 📝
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* MASTER TAB: SPARE PARTS */}
                  {activeAdminMenu === 'parts' && (
                    <div className="bg-white rounded-2xl border border-gray-150 p-6 space-y-4 shadow-xs">
                      <div className="flex justify-between items-center bg-amber-50/50 p-4 rounded-xl border border-amber-50 text-xs text-yellow-800">
                        <p className="font-semibold flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-600" /> 
                          อะไหล่ที่มีจำนวนต่ำกว่าเกณฑ์ขั้นต่ำ จะส่งผลให้ใบงานเปลี่ยนเป็นสถานะ "รอชิ้นส่วนอะไหล่" ทันที
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {SPARE_PARTS.map(part => {
                          const isLow = part.stock <= part.minStock;
                          return (
                            <div key={part.id} className={`p-4 rounded-xl border transition-all ${
                              isLow ? 'bg-red-50/50 border-red-200' : 'bg-white border-gray-150 hover:bg-gray-50/20'
                            }`}>
                              <span className="text-[10px] font-mono text-gray-450 uppercase tracking-widest">{part.id}</span>
                              <h4 className="font-bold text-sm text-gray-800 mt-1">{part.name}</h4>
                              <div className="flex items-center justify-between text-xs pt-3 mt-3 border-t border-gray-100 text-gray-500">
                                <span>คงคลัง: <strong className={isLow ? 'text-red-600 font-black' : 'text-gray-800'}>{part.stock} ชิ้น</strong> (ขั้นต่ำ {part.minStock})</span>
                                <span className="font-semibold text-emerald-600">{new Intl.NumberFormat('th-TH').format(part.pricePerUnit)} บาท/หน่วย</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* MASTER TAB: LINE NOTIFICATION SETTINGS */}
                  {activeAdminMenu === 'line_notify' && (
                    <div className="max-w-2xl bg-white rounded-2xl border border-gray-150 p-6 space-y-4 shadow-xs">
                      <div className="flex items-center gap-2 mb-4 bg-emerald-500 p-4 text-white rounded-xl">
                        <Smartphone className="w-8 h-8 shrink-0" />
                        <div>
                          <h4 className="font-bold text-sm">LINE Notify Integrations (การจำลองส่งเข้ามือถือแชทกลุ่ม)</h4>
                          <p className="text-[10px] opacity-80">แอปนี้ได้เปิดระบบ WebSocket พอร์ตเชื่อมกลุ่ม โดยหากการซ่อมเสร็จ ระบบจะจำลองปิงแจ้งเตือนทันที</p>
                        </div>
                      </div>

                      <div className="space-y-4 text-left">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500">LINE NOTIFY GROUP TOKEN</label>
                          <input 
                            type="text" 
                            disabled 
                            value="dHUTFckaKpy5Li43QRiXs2_LineNotify_tokenSimulationActive" 
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-mono bg-gray-50 text-gray-400"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500">ประเภทข้อความที่จะส่ง</label>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs text-gray-600">
                              <input type="checkbox" defaultChecked disabled className="rounded-sm text-emerald-600" />
                              ส่งเข้ากลุ่มช่างและวิศวกรทันทีเมื่อมีผู้ประสาน "แจ้งซ่อมใหม่"
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-600">
                              <input type="checkbox" defaultChecked disabled className="rounded-sm text-emerald-600" />
                              แจ้งหาลูกค้ารายบุคคลแบบทันทีเมื่อเปลี่ยนสถานะซ่อมเป็น "เสร็จสิ้น"
                            </label>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-gray-55 bg-gray-50 border border-gray-150 text-xs text-gray-500 space-y-2">
                          <p className="font-black flex items-center gap-1.5 text-gray-700">
                            <Info className="w-4 h-4 text-blue-500" /> โครงสร้างตัวอย่างข้อความเมื่อปิดงาน:
                          </p>
                          <blockquote className="font-mono bg-white p-3 rounded-lg border border-gray-100 select-all leading-normal whitespace-pre-wrap">
                            {`📢 LINE NOTIFICATION:
ช่าง [ชื่อช่าง] ได้ทำการปิดใบงานแจ้งซ่อมเรียบร้อย!
รหัสใบงาน: REQ00xxxx
อุปกรณ์: [ชื่ออุปกรณ์]
ปัญหา: [เนื้อความปัญหา]
ค่าใช้จ่ายรวม: [ค่าใช้จ่าย] บาท
สถานะ: เสร็จสิ้นเรียบร้อยแล้ว ในอาคาร`}
                          </blockquote>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* FOOTER COOPERATING BRAND */}
      <footer className="bg-white border-t border-gray-150 py-3.5 px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
        <p className="font-medium">© 2026 ระบบลูกค้าและช่างเทคนิคแจ้งซ่อมพอร์ทัลอาคาร. สงวนลิขสิทธิ์.</p>
        <p className="flex items-center gap-1.5 font-bold mt-1.5 sm:mt-0 text-[11px] text-gray-500">
          📍 พัฒนาด้วยความประณีต • ⚡ เชื่อมต่อด้วย Websocket จำลอง (เรียลไทม์)
        </p>
      </footer>

      {/* --- LIVE FLOATING SCREEN NOTIFICATIONS ALERTS --- */}
      <div className="fixed top-20 right-4 z-50 space-y-2.5 max-w-sm w-full pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl shadow-xl border text-sm pointer-events-auto flex items-start gap-3 transform transition-all animate-slide-left ${
              n.type === 'success' 
                ? 'bg-emerald-50 border-emerald-150 text-emerald-800' 
                : n.type === 'warning' 
                  ? 'bg-rose-50 border-rose-150 text-rose-800' 
                  : 'bg-blue-50/95 border-blue-150 text-blue-900'
            }`}
          >
            <div className="mt-0.5">
              {n.type === 'success' ? (
                <CircleCheck className="w-5 h-5 text-emerald-600" />
              ) : n.type === 'warning' ? (
                <AlertCircle className="w-5 h-5 text-rose-600" />
              ) : (
                <Info className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <h5 className="font-extrabold text-xs">{n.title}</h5>
              <p className="text-xs text-gray-500 mt-1 leading-normal">{n.message}</p>
            </div>
            <button 
              onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))}
              className="text-gray-400 hover:text-gray-600 text-xs shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
