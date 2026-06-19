import React, { useState } from 'react';
import { 
  Wrench, 
  User, 
  Clock, 
  Search, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Layers, 
  Coins, 
  Package, 
  SlidersHorizontal,
  ChevronRight,
  UserCheck,
  Send,
  Plus,
  Trash2,
  Lock,
  Tag
} from 'lucide-react';
import { RepairRequest, StatusType, PriorityType, SparePart, Mechanic } from '../types';
import { MECHANICS, SPARE_PARTS } from '../data/mockData';

interface TechnicianPortalProps {
  requests: RepairRequest[];
  onUpdateWork: (updatedRequest: RepairRequest) => void;
  pushNotification: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function TechnicianPortal({ requests, onUpdateWork, pushNotification }: TechnicianPortalProps) {
  // Technician Login and Zoom States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('active_jobs'); // 'active_jobs', 'pending', 'completed', 'all'
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<RepairRequest | null>(null);

  // Editing state within detail view
  const [assignedMechanic, setAssignedMechanic] = useState('-');
  const [currentStatus, setCurrentStatus] = useState<StatusType>('pending');
  const [repairCost, setRepairCost] = useState<number>(0);
  const [techNotes, setTechNotes] = useState('');
  const [selectedPart, setSelectedPart] = useState('');
  const [partsQty, setPartsQty] = useState(1);
  const [usedPartsLog, setUsedPartsLog] = useState<{ name: string; qty: number; price: number }[]>([]);

  // Filter requests
  const filteredRequests = requests.filter(req => {
    // Search filter
    const matchesSearch = 
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.department.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'active_jobs') {
      matchesStatus = req.status !== 'completed' && req.status !== 'cancelled';
    } else if (statusFilter === 'pending') {
      matchesStatus = req.status === 'pending';
    } else if (statusFilter === 'completed') {
      matchesStatus = req.status === 'completed';
    }

    // Priority filter
    const matchesPriority = priorityFilter === 'all' || req.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Handle clicking a request to load into editor
  const handleSelectRequest = (req: RepairRequest) => {
    setSelectedRequest(req);
    setAssignedMechanic(req.assignedMechanic === '-' ? MECHANICS[0].name : req.assignedMechanic);
    setCurrentStatus(req.status);
    setRepairCost(req.cost);
    setTechNotes(req.additionalNotes || '');
    setUsedPartsLog([]);
    setSelectedPart('');
  };

  // Add spare parts cost dynamically
  const handleAddPartToCost = () => {
    if (!selectedPart) return;
    const partObj = SPARE_PARTS.find(p => p.id === selectedPart);
    if (!partObj) return;

    const price = partObj.pricePerUnit * partsQty;
    setRepairCost(prev => prev + price);
    setUsedPartsLog(prev => [...prev, { name: partObj.name, qty: partsQty, price }]);
    pushNotification(
      '📦 ยืนยันเบิกอะไหล่',
      `จำลองการใช้ ${partObj.name} จำนวน ${partsQty} ชิ้น (มูลค่า ${price} บาท)`,
      'info'
    );
  };

  const handleSaveWorkspace = () => {
    if (!selectedRequest) return;

    const finalNotes = techNotes.trim();
    // Simulate updating requests
    const updated: RepairRequest = {
      ...selectedRequest,
      assignedMechanic: assignedMechanic,
      status: currentStatus,
      cost: repairCost,
      additionalNotes: finalNotes,
      updatedAt: new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 5)
    };

    onUpdateWork(updated);
    setSelectedRequest(null);
    pushNotification(
      '⚙️ บันทึกความคืบหน้าสำเร็จ!',
      `อัปเดตใบงาน ${selectedRequest.id} เป็น "${
        currentStatus === 'completed' ? 'ซ่อมเสร็จสิ้น' : 
        currentStatus === 'in_progress' ? 'กำลังดำเนินการ' : 
        currentStatus === 'waiting_parts' ? 'รออะไหล่' : 'รับเรื่องงานแล้ว'
      }" เรียบร้อย`,
      'success'
    );
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === '5678') {
      setIsLoggedIn(true);
      setLoginError('');
      pushNotification('🔓 เข้าสู่ระบบสำเร็จ', 'เริ่มดำเนินการตรวจสอบและจัดบันทึกรายการคำขอได้ทันที', 'success');
    } else {
      setLoginError('ชื่อผู้ใช้หรือรหัสผ่านสำหรับช่างไม่ถูกต้อง! คีย์เวิร์ดเฉลย: admin / 5678');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 animate-fade-in text-left">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-slide-up">
          <div className="bg-slate-900 text-white p-8 text-center space-y-3 relative">
            <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-450 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> ช่างเทคนิค
            </div>
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg text-white">
              <Wrench className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold font-sans">ระบบลงชื่อเข้าใช้ช่างอาคาร</h3>
              <p className="text-xs text-slate-400 mt-1">Technician Workdesk Authorization</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {loginError && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">บัญชีช่างผู้ใช้ (Username)</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder-slate-400"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">รหัสเข้าระบบ (Password)</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-250 bg-slate-50/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder-slate-400"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Hint Box (User requested) */}
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 space-y-1 text-slate-600">
              <span className="text-[10px] text-indigo-700 font-bold block">💡 ข้อมูลทดสอบยืนยันช่างเทคนิค:</span>
              <p className="text-[11px] leading-relaxed">
                บัญชีใช้งาน: <strong className="text-indigo-800">admin</strong><br />
                รหัสผ่านสำหรับบอร์ดช่าง: <strong className="text-indigo-800">5678</strong>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:shadow-xl hover:bg-indigo-705 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" /> เข้าใช้ระบบปฏิบัติการช่าง
            </button>
          </form>
        </div>
      </div>
    );
  }

  const getPriorityBadge = (p: PriorityType) => {
    switch (p) {
      case 'low': return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">ต่ำ</span>;
      case 'medium': return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-100">ปานกลาง</span>;
      case 'high': return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-100 font-extrabold">สูง</span>;
      case 'urgent': return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100 animate-pulse font-black">ด่วนที่สุด ⚡</span>;
    }
  };

  return (
    <div className="space-y-6" id="technician-portal">
      {/* Header Profile Dashboard banner */}
      <div className="bg-linear-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-8 shadow-xl border border-slate-700">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-xs text-indigo-200 mb-4 animate-pulse">
              <Wrench className="w-4 h-4 text-emerald-400" /> พอร์ทัลเจ้าหน้าที่ช่างเทคนิค (Technician Hub)
            </span>
            <h2 className="text-3xl font-extrabold font-sans tracking-tight">
              ศูนย์รับงานและอัปเดตงานซ่อมอาคาร
            </h2>
            <p className="text-slate-350 text-sm mt-2 leading-relaxed">
              สำหรับทีมช่างเทคนิคและวิศวกรประจำโครงการ: คุณสามารถดำเนินการรับงานซ่อมแซม, ปรับปรุงกระบวนงาน, บันทึกการลงอะไหล่คงคลัง ตลอดจนประมาณการค่าใช้จ่ายเพื่อปิดงานระบบ
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xs min-w-[220px]">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg">
              ENG
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">ทีมวิศวกรซ่อมบำรุง</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">พนักงานปฏิบัติงานออนไลน์</p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                พร้อมรับงานใหม่
              </div>
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setUsername('');
                  setPassword('');
                  setSelectedRequest(null);
                  pushNotification('🔒 ออกจากระบบ', 'ออกจากส่วนรับงานช่างเรียบร้อย', 'info');
                }}
                className="mt-2 text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer text-left block border-t border-white/10 pt-1.5 w-full"
              >
                🚪 ออกจากระบบช่าง
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Ticket lists under filters */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                📋 ทะเบียนใบงานแจ้งซ่อมที่มอบหมาย ({filteredRequests.length} รายการ)
              </h3>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStatusFilter('active_jobs')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === 'active_jobs' 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                      : 'bg-slate-100 text-slate-655 hover:bg-slate-200 text-slate-600 border border-slate-200'
                  }`}
                >
                  งานกำลังซ่อม
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === 'pending' 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                      : 'bg-slate-100 text-slate-655 hover:bg-slate-200 text-slate-600 border border-slate-200'
                  }`}
                >
                  รอดำเนินการ
                </button>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === 'all' 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                      : 'bg-slate-100 text-slate-655 hover:bg-slate-200 text-slate-600 border border-slate-200'
                  }`}
                >
                  ทั้งหมด
                </button>
              </div>
            </div>

            {/* Inputs & Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Search */}
              <div className="relative sm:col-span-2">
                <input
                  type="text"
                  placeholder="ค้นหารหัสใบงาน, ชื่อผู้แจ้ง หรือตัวอุปกรณ์..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-250 bg-slate-50/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white placeholder-slate-400 transition-all"
                />
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>

              {/* Priority Filter */}
              <div>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-250 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                >
                  <option value="all">ความเร่งด่วน: ทั้งหมด</option>
                  <option value="low">ต่ำ</option>
                  <option value="medium">ปานกลาง</option>
                  <option value="high">สูง</option>
                  <option value="urgent">ด่วนที่สุด ⚡</option>
                </select>
              </div>
            </div>

            {/* Work request list */}
            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto pr-2 space-y-2 pt-2">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs space-y-2">
                  <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>ไม่พบรายการแจ้งซ่อมซุ่มตามตัวกรองนี้</p>
                </div>
              ) : (
                filteredRequests.map((req) => {
                  const isSelected = selectedRequest?.id === req.id;
                  return (
                    <div 
                      key={req.id}
                      onClick={() => handleSelectRequest(req)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-xs' 
                          : 'border-slate-100 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">{req.id}</span>
                          {getPriorityBadge(req.priority)}
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                            req.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                            req.status === 'in_progress' ? 'bg-purple-100 text-purple-800 animate-pulse' :
                            req.status === 'waiting_parts' ? 'bg-amber-100 text-amber-800' :
                            req.status === 'received' ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {req.status === 'completed' ? 'ซ่อมเสร็จสิ้น' :
                             req.status === 'in_progress' ? 'กำลังซ่อมแซม' :
                             req.status === 'waiting_parts' ? 'รออะไหล่สำรอง' :
                             req.status === 'received' ? 'รับทราบคำซ่อมแล้ว' : 'รอแอดมินเปิดรับเรื่อง'}
                          </span>
                        </div>
                        
                        <p className="font-bold text-slate-800 text-sm mt-1">{req.equipmentName}</p>
                        
                        <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2">
                          <span className="flex items-center gap-1"><User className="w-3 h-3 text-slate-400" /> {req.reporterName} ({req.department})</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {req.createdAt}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 block font-semibold">ช่างที่รับผิดชอบ</span>
                        <span className={`text-xs font-bold ${req.assignedMechanic !== '-' ? 'text-indigo-650 text-indigo-600' : 'text-rose-500 font-extrabold'}`}>
                          {req.assignedMechanic !== '-' ? req.assignedMechanic : '⚠️ ยังไม่กำหนดช่าง'}
                        </span>
                        <ChevronRight className="w-5 h-5 text-slate-350 ml-auto mt-1" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right column: Active work management details */}
        <div className="lg:col-span-1">
          {selectedRequest ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5 shadow-sm sticky top-20 text-left animate-slide-up">
              <div className="flex justify-between items-center border-b border-slate-150 pb-3.5">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">กำลังจัดการงาน</span>
                  <h3 className="font-bold font-sans text-md text-slate-900">{selectedRequest.id}</h3>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-2.5 py-1 text-[10px] bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  ปิดหน้านี้
                </button>
              </div>

              {/* Informative view */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">อุปกรณ์ที่เสียหาย</span>
                  <p className="font-bold text-slate-800">{selectedRequest.equipmentName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">รายละเอียดความพังเสียหาย</span>
                  <p className="text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-100 mt-1">
                    "{selectedRequest.description}"
                  </p>
                </div>
                {selectedRequest.additionalNotes && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">บันทึกสถานที่แจ้ง</span>
                    <p className="text-slate-500">{selectedRequest.additionalNotes}</p>
                  </div>
                )}
              </div>

              {/* Image Attachments for Technicians */}
              {selectedRequest.images && selectedRequest.images.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2 text-xs">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">📷 รูปภาพที่แนบมา ({selectedRequest.images.length} รูป)</span>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {selectedRequest.images.map((img, i) => (
                      <div 
                        key={i} 
                        onClick={() => setZoomedImage(img)}
                        className="rounded-lg overflow-hidden border border-slate-200 aspect-video bg-white cursor-zoom-in hover:opacity-95 transition-opacity duration-150"
                        title="คลิกเพื่อขยายรูปภาพ"
                      >
                        <img referrerPolicy="no-referrer" src={img} alt="Repair Equipment Evidence" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form elements step by step */}
              <div className="space-y-4">
                
                {/* 1. Assign Mechanic */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-605 text-slate-705 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-indigo-600" /> ระบุช่างรับผิดชอบ
                  </label>
                  <select
                    value={assignedMechanic}
                    onChange={(e) => setAssignedMechanic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-indigo-500 font-semibold"
                  >
                    <option value="-">-- เลือกมอบหมายตัวเอง / ช่างอื่นๆ --</option>
                    {MECHANICS.map(mech => (
                      <option key={mech.id} value={mech.name}>
                        {mech.name} ({mech.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Update Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-705 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" /> ขั้นระดับสถานะงานช่าง
                  </label>
                  <select
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value as StatusType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-indigo-500 font-semibold"
                  >
                    <option value="pending">🕒 แอดมินรอดำเนินการรับเรื่อง (Pending)</option>
                    <option value="received">🔹 ยืนยันช่างลงรับงานรับคิวเรื่องเรียบร้อย (Received)</option>
                    <option value="in_progress">⚙️ อยู่ระหว่างรื้อถอนซ่อมหน้างานจริง (In Progress)</option>
                    <option value="waiting_parts">📦 ระงับรอเบิกพัสดุชิ้นส่วนอะไหล่ (Waiting Parts)</option>
                    <option value="completed">✅ ซ่อมเสร็จใช้งานได้ดีพร้อมปิดงานบิล (Completed)</option>
                    <option value="cancelled">❌ ตรวจพบซ่อมไม่ได้ยกเลิกใบงาน (Cancelled)</option>
                  </select>
                </div>

                {/* 3. Materials Add ons */}
                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-3">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" /> เบิกชิ้นส่วนอะไหล่นำไปซ่อม (จำลองหักคลัง)
                  </span>
                  <div className="flex gap-2">
                    <select
                      value={selectedPart}
                      onChange={(e) => setSelectedPart(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">-- เลือกอะไหล่เบิก --</option>
                      {SPARE_PARTS.map(part => (
                        <option key={part.id} value={part.id} disabled={part.stock === 0}>
                          {part.name} - {part.pricePerUnit} บ. ({part.stock === 0 ? 'หมด' : `คลังเหลือ ${part.stock}`})
                        </option>
                      ))}
                    </select>
                    
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={partsQty}
                      onChange={(e) => setPartsQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] text-center focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                      type="button"
                      onClick={handleAddPartToCost}
                      className="px-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-[11px] font-bold flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Used parts log item */}
                  {usedPartsLog.length > 0 && (
                    <div className="text-[10px] text-slate-500 space-y-1 bg-white p-2 rounded-lg border border-slate-150">
                      <p className="font-bold text-indigo-700">ชิ้นส่วนที่ดำเนินการเบิกแล้ว:</p>
                      {usedPartsLog.map((log, i) => (
                        <div key={i} className="flex justify-between">
                          <span>• {log.name} (x{log.qty})</span>
                          <span className="font-bold">+{log.price} บาท</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Repair Budget Cost */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-705 flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Coins className="w-4 h-4 text-indigo-600" /> งบการซ่อมอาคาร (บาท)</span>
                    <span className="text-[10px] text-slate-400">(ค่าแรง + ค่าอะไหล่สะสม)</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={repairCost}
                    onChange={(e) => setRepairCost(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-bold focus:ring-2 focus:ring-indigo-500 text-left"
                  />
                </div>

                {/* 5. Technic note */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-705 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" /> ความเห็นทางวิศวกรรมของช่าง
                  </label>
                  <textarea
                    rows={2}
                    value={techNotes}
                    onChange={(e) => setTechNotes(e.target.value)}
                    placeholder="ใส่ข้อมูลความคืบหน้า รายละเอียดอะไหล่ที่เปลี่ยน..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                  />
                </div>

                {/* Save action button */}
                <button
                  type="button"
                  onClick={handleSaveWorkspace}
                  className="w-full py-3 bg-linear-to-r from-emerald-600 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:bg-emerald-650 transition-all text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> บันทึกและส่งต่องานช่างบำรุง
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 min-h-[350px] flex flex-col justify-center gap-3">
              <div className="p-3 bg-slate-50 rounded-full inline-block mx-auto text-indigo-500">
                <Wrench className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-700">ยังไม่ได้ระบุเลือกใบงาน</h4>
                <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto mt-1 leading-relaxed">
                  คลิกเลือกรายการแจ้งซ่อมด้านซ้ายเพื่อเปิดจอควบรับเรื่อง ดำเนินบันทึกชิ้นส่วนอะไหล่ และอัปเดตงาน
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Lightbox / zoomed image modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 bg-black/85 z-[200] backdrop-blur-xs flex items-center justify-center p-4" 
          onClick={() => setZoomedImage(null)}
        >
          <div 
            className="relative max-w-3xl w-full max-h-[85vh] overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              referrerPolicy="no-referrer" 
              src={zoomedImage} 
              alt="Repair Evidence Preview" 
              className="max-w-full max-h-[72vh] object-contain mx-auto block p-2" 
            />
            <div className="p-4 bg-slate-900 text-center flex items-center justify-between gap-4 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">🔍 ตรวจสอบรูปภาพประกอบหน้างานแจ้งซ่อม</span>
              <button 
                onClick={() => setZoomedImage(null)} 
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-white text-xs font-bold transition-all cursor-pointer"
              >
                ปิดหน้าต่างนี้
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
