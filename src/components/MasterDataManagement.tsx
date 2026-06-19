/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlusCircle, Edit3, Trash2, Building, Layers, Monitor, Save, X, Check, Wrench } from 'lucide-react';
import { Department, Equipment } from '../types';

interface MasterDataManagementProps {
  departments: Department[];
  onSaveDepartments: (list: Department[]) => void;
  categories: string[];
  onSaveCategories: (list: string[]) => void;
  equipmentList: Equipment[];
  onSaveEquipment: (list: Equipment[]) => void;
  pushNotification: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function MasterDataManagement({
  departments,
  onSaveDepartments,
  categories,
  onSaveCategories,
  equipmentList,
  onSaveEquipment,
  pushNotification
}: MasterDataManagementProps) {
  const [activeTab, setActiveTab] = useState<'equipment' | 'department' | 'category'>('equipment');

  // Input States for Equipment
  const [eqId, setEqId] = useState('');
  const [eqName, setEqName] = useState('');
  const [eqCategory, setEqCategory] = useState(categories[1] || 'เครื่องใช้ไฟฟ้า');
  const [eqStatus, setEqStatus] = useState<'active' | 'repairing' | 'broken'>('active');
  const [isEditingEq, setIsEditingEq] = useState<boolean>(false);
  const [eqSearch, setEqSearch] = useState('');

  // Input States for Department
  const [deptId, setDeptId] = useState('');
  const [deptName, setDeptName] = useState('');
  const [deptBuilding, setDeptBuilding] = useState('อาคาร A');
  const [deptFloor, setDeptFloor] = useState<number>(1);
  const [isEditingDept, setIsEditingDept] = useState<boolean>(false);

  // Input States for Category
  const [catName, setCatName] = useState('');
  const [isEditingCat, setIsEditingCat] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  // --- EQUIPMENT CRUD ---
  const handleSaveEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eqName.trim()) {
      alert('กรุณากรอกชื่อทรัพย์สิน');
      return;
    }

    if (isEditingEq) {
      // Edit mode
      const updated = equipmentList.map(item => 
        item.id === eqId 
          ? { ...item, name: eqName, category: eqCategory, status: eqStatus, lastChecked: new Date().toISOString().slice(0, 10) }
          : item
      );
      onSaveEquipment(updated);
      pushNotification('✏️ แก้ไขอุปกรณ์สำเร็จ', `แก้ไขรายละเอียดอุปกรณ์ ${eqName} เรียบร้อยแล้ว`, 'success');
      resetEqForm();
    } else {
      // Add mode
      const newId = `EQ${String(equipmentList.length + 1).padStart(2, '0')}`;
      const newEq: Equipment = {
        id: newId,
        name: eqName,
        category: eqCategory,
        status: eqStatus,
        lastChecked: new Date().toISOString().slice(0, 10)
      };
      onSaveEquipment([...equipmentList, newEq]);
      pushNotification('➕ เพิ่มอุปกรณ์ใหม่', `บรรจุอุปกรณ์ ${eqName} เข้าคลังทะเบียนทรัพย์สินเรียบร้อย`, 'success');
      resetEqForm();
    }
  };

  const handleEditEqClick = (eq: Equipment) => {
    setEqId(eq.id);
    setEqName(eq.name);
    setEqCategory(eq.category);
    setEqStatus(eq.status);
    setIsEditingEq(true);
  };

  const handleDeleteEq = (id: string, name: string) => {
    if (confirm(`คุณมั่นใจหรือไม่ที่จะลบอุปกรณ์ ${name} ออกจากระบบ?`)) {
      onSaveEquipment(equipmentList.filter(e => e.id !== id));
      pushNotification('🗑️ ลบอุปกรณ์สำเร็จ', `นำอุปกรณ์ ${name} ออกจากทะเบียนแล้ว`, 'warning');
    }
  };

  const resetEqForm = () => {
    setEqId('');
    setEqName('');
    setEqCategory(categories[1] || 'เครื่องใช้ไฟฟ้า');
    setEqStatus('active');
    setIsEditingEq(false);
  };


  // --- DEPARTMENT CRUD ---
  const handleSaveDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim()) {
      alert('กรุณากรอกชื่อแผนก');
      return;
    }

    if (isEditingDept) {
      // Edit
      const updated = departments.map(item => 
        item.id === deptId 
          ? { ...item, name: deptName, building: deptBuilding, floor: deptFloor }
          : item
      );
      onSaveDepartments(updated);
      pushNotification('✏️ แก้ไขข้อมูลแผนก', `ปรับปรุงพิกัดและรายละเอียดแผนก ${deptName} เรียบร้อย`, 'success');
      resetDeptForm();
    } else {
      // Add
      const newId = `DP${String(departments.length + 1).padStart(2, '0')}`;
      const newDept: Department = {
        id: newId,
        name: deptName,
        building: deptBuilding,
        floor: deptFloor
      };
      onSaveDepartments([...departments, newDept]);
      pushNotification('➕ เพิ่มแผนกใหม่', `จดทะเบียนสิทธิ์แผนกแผนกใหม่ ${deptName} สำเร็จ`, 'success');
      resetDeptForm();
    }
  };

  const handleEditDeptClick = (dept: Department) => {
    setDeptId(dept.id);
    setDeptName(dept.name);
    setDeptBuilding(dept.building);
    setDeptFloor(dept.floor);
    setIsEditingDept(true);
  };

  const handleDeleteDept = (id: string, name: string) => {
    if (confirm(`ยืนยันลบแผนก ${name}? การซ่อมสำหรับแผนกนี้อาจได้รับสถิติย้อนหลังในนามแผนกทั่วไป`)) {
      onSaveDepartments(departments.filter(d => d.id !== id));
      pushNotification('🗑️ ลบแผนกแล้ว', `นำแผนก ${name} ออกจากระบบแล้ว`, 'warning');
    }
  };

  const resetDeptForm = () => {
    setDeptId('');
    setDeptName('');
    setDeptBuilding('อาคาร A');
    setDeptFloor(1);
    setIsEditingDept(false);
  };


  // --- CATEGORIES CRUD ---
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = catName.trim();
    if (!cleanName) return;
    if (categories.includes(cleanName)) {
      alert('มีหมวดหมู่นี้ในระบบเรียบร้อยแล้ว');
      return;
    }

    const updated = [...categories, cleanName];
    onSaveCategories(updated);
    pushNotification('🏷️ หมวดหมู่ใหม่', `เพิ่มหมวดประเภทอุปกรณ์ ${cleanName} สำเร็จ`, 'success');
    setCatName('');
  };

  const handleSaveEditCategory = (oldName: string) => {
    const cleanName = editingCatName.trim();
    if (!cleanName) return;
    if (categories.includes(cleanName) && cleanName !== oldName) {
      alert('มีชื่อหมวดหมู่นี้ในระบบแล้ว');
      return;
    }

    const updated = categories.map(c => c === oldName ? cleanName : c);
    onSaveCategories(updated);

    // Also cascade change to equipment categories!
    const updatedEq = equipmentList.map(eq => 
      eq.category === oldName ? { ...eq, category: cleanName } : eq
    );
    onSaveEquipment(updatedEq);

    pushNotification('🏷️ ปรับปรุงหมวดหมู่', `แก้ไขประเภทอุปกรณ์และอัปเดตทรัพย์สินที่เกี่ยวข้องแล้ว`, 'success');
    setIsEditingCat(null);
    setEditingCatName('');
  };

  const handleDeleteCategory = (name: string) => {
    if (name === '-- ทั้งหมด --') {
      alert('ไม่สามารถลบหมวดหมู่ตั้งต้นภายนอกระบบได้');
      return;
    }
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่ "${name}"? อุปกรณ์ทั้งหมดในหมวดหมู่นี้จะย้ายไปอยู่หมวดหมู่ทั่วไป`)) {
      const updated = categories.filter(c => c !== name);
      onSaveCategories(updated);

      const updatedEq = equipmentList.map(eq => 
        eq.category === name ? { ...eq, category: 'เครื่องใช้ไฟฟ้า' } : eq
      );
      onSaveEquipment(updatedEq);

      pushNotification('🗑️ ลบหมวดหมู่สำเร็จ', `ลบหมวดหมู่ ${name} ออกจากพอร์ทัลแล้ว`, 'warning');
    }
  };


  return (
    <div className="bg-white rounded-2xl border border-gray-150 shadow-xs overflow-hidden" id="master-data-management-panel">
      {/* Upper Navigation Links/Tabs */}
      <div className="bg-slate-50 border-b border-gray-150 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold font-sans text-gray-900 text-md">ศูนย์จัดการข้อมูลระบบหลังบ้าน (Master Data Administration Hub)</h3>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('equipment')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'equipment' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> อุปกรณ์ ({equipmentList.length})
          </button>
          <button
            onClick={() => setActiveTab('department')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'department' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5" /> แผนก ({departments.length})
          </button>
          <button
            onClick={() => setActiveTab('category')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'category' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> หมวดหมู่ ({categories.filter(c => c !== '-- ทั้งหมด --').length})
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* ======================================= */}
        {/* TAB 1: EQUIPMENT WORKSPACE */}
        {/* ======================================= */}
        {activeTab === 'equipment' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Register Form */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-gray-150 space-y-4 h-fit">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-150 pb-2">
                {isEditingEq ? '✏️ แก้ไขข้อมูลอุปกรณ์' : '➕ จดทะเบียนอุปกรณ์ใหม่'}
              </h4>
              <form onSubmit={handleSaveEquipment} className="space-y-4">
                {isEditingEq && (
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-400 mb-1">รหัสอุปกรณ์</span>
                    <span className="text-xs font-mono font-bold text-gray-700 block bg-slate-100 px-3 py-2 rounded-lg">{eqId}</span>
                  </div>
                )}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-xs">ชื่อทรัพย์สินอาคาร <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={eqName}
                    onChange={(e) => setEqName(e.target.value)}
                    placeholder="เช่น แอร์ LG ห้องประชุมชั้น 3"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-xs">ประเภทกลุ่มหมวดหมู่</label>
                  <select
                    value={eqCategory}
                    onChange={(e) => setEqCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.filter(c => c !== '-- ทั้งหมด --').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-xs">สถานะตรวจสภาพอุปกรณ์</label>
                  <select
                    value={eqStatus}
                    onChange={(e) => setEqStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="active">🟢 พร้อมใช้งาน (Active)</option>
                    <option value="repairing">🟣 อยู่ระหว่างซ่อม (Repairing)</option>
                    <option value="broken">🔴 ชำรุดขัดข้อง (Broken)</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" /> บันทึกข้อมูล
                  </button>
                  {isEditingEq && (
                    <button
                      type="button"
                      onClick={resetEqForm}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs py-2 px-3 rounded-lg cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Right Column: Register List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">บัญชีทะเบียนอุปกรณ์ ({equipmentList.length} รายการ)</span>
                <input
                  type="text"
                  placeholder="🔍 พิมพ์ค้นหาอุปกรณ์..."
                  value={eqSearch}
                  onChange={(e) => setEqSearch(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none w-48 bg-white"
                />
              </div>

              <div className="overflow-x-auto border border-gray-150 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-55 border-b border-gray-100 font-bold text-gray-500 uppercase">
                      <th className="p-3">รหัส</th>
                      <th className="p-3">ชื่อทรัพย์สินอุปกรณ์</th>
                      <th className="p-3">หมวดหมู่</th>
                      <th className="p-3">สถานะ</th>
                      <th className="p-3 text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {equipmentList
                      .filter(eq => eq.name.toLowerCase().includes(eqSearch.toLowerCase()) || eq.category.toLowerCase().includes(eqSearch.toLowerCase()))
                      .map(eq => (
                        <tr key={eq.id} className="hover:bg-slate-50/20">
                          <td className="p-3 font-mono font-bold text-slate-400">{eq.id}</td>
                          <td className="p-3 font-semibold text-gray-800">{eq.name}</td>
                          <td className="p-3 text-slate-500">{eq.category}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              eq.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              eq.status === 'repairing' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 
                              'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}>
                              {eq.status === 'active' ? 'พร้อมใช้งาน' :
                               eq.status === 'repairing' ? 'อยู่ระหว่างซ่อม' : 'ชดเชยเสีย'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditEqClick(eq)}
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                                title="แก้ไข"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteEq(eq.id, eq.name)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                title="ลบ"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 2: DEPARTMENT WORKSPACE */}
        {/* ======================================= */}
        {activeTab === 'department' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Register Form */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-gray-150 space-y-4 h-fit">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-150 pb-2">
                {isEditingDept ? '✏/🏢 แก้ไขบริการแผนก' : '➕ เพิ่มทะเบียนแผนกใหม่'}
              </h4>
              <form onSubmit={handleSaveDepartment} className="space-y-4">
                {isEditingDept && (
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-400 mb-1">รหัสแผนก</span>
                    <span className="text-xs font-mono font-bold text-gray-700 block bg-slate-100 px-3 py-2 rounded-lg">{deptId}</span>
                  </div>
                )}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-xs font-sans">ชื่อแผนก/ฝ่ายประสาน <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    placeholder="เช่น ฝ่ายพัสดุกองกลาง"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-xs">พิกัด อาคารที่ตั้ง</label>
                  <select
                    value={deptBuilding}
                    onChange={(e) => setDeptBuilding(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="อาคาร A">อาคาร A</option>
                    <option value="อาคาร B">อาคาร B</option>
                    <option value="อาคาร C">อาคาร C</option>
                    <option value="อาคาร D ทาวเวอร์">อาคาร D ทาวเวอร์</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-xs">ตำแหน่ง ชั้นกรรมาตร (Floor)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={deptFloor}
                    onChange={(e) => setDeptFloor(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" /> บันทึกแผนก
                  </button>
                  {isEditingDept && (
                    <button
                      type="button"
                      onClick={resetDeptForm}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs py-2 px-3 rounded-lg cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Right Column: Register List */}
            <div className="lg:col-span-2 space-y-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">รายชื่อแผนกทั้งหมดในอาคาร ({departments.length} แผนก)</span>
              
              <div className="overflow-x-auto border border-gray-150 rounded-2xl">
                <table className="w-full text-left text-xs bg-white">
                  <thead>
                    <tr className="bg-gray-55 border-b border-gray-100 font-bold text-gray-500">
                      <th className="p-3">รหัสแผนก</th>
                      <th className="p-3">ชื่อแผนก</th>
                      <th className="p-3">อาคารพิกัด</th>
                      <th className="p-3 text-center">ชั้น</th>
                      <th className="p-3 text-center">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {departments.map(dept => (
                      <tr key={dept.id} className="hover:bg-slate-50/20">
                        <td className="p-3 font-mono font-bold text-slate-400">{dept.id}</td>
                        <td className="p-3 font-semibold text-gray-800">{dept.name}</td>
                        <td className="p-3 text-gray-600">{dept.building}</td>
                        <td className="p-3 text-center font-bold text-indigo-500">{dept.floor}</td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditDeptClick(dept)}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                              title="แก้ไข"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDept(dept.id, dept.name)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                              title="ลบ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 3: CATEGORY WORKSPACE */}
        {/* ======================================= */}
        {activeTab === 'category' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Add Form */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-gray-150 space-y-4 h-fit">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-150 pb-2">
                ➕ เพิ่มประเภทอุปกรณ์ใหม่
              </h4>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-xs">ชื่อหมวดหมู่ประเภทใหม่</label>
                  <input
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="เช่น ระบบลิฟต์ & บันไดเลื่อน"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> บันทึกหมวดหมู่ใหม่
                </button>
              </form>
            </div>

            {/* Right Column: Categories List */}
            <div className="lg:col-span-2 space-y-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                คลังประเภท/ฟังก์ชันเครื่องมือ ({categories.filter(c => c !== '-- ทั้งหมด --').length} ประเภท)
              </span>

              <div className="border border-gray-150 rounded-2xl bg-white overflow-hidden">
                <div className="divide-y divide-gray-100 text-xs">
                  {categories
                    .filter(cat => cat !== '-- ทั้งหมด --')
                    .map((cat, index) => (
                      <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50/20">
                        {isEditingCat === cat ? (
                          <div className="flex items-center gap-2 w-full max-w-sm">
                            <input
                              type="text"
                              value={editingCatName}
                              onChange={(e) => setEditingCatName(e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded-lg text-xs flex-1 focus:ring-2 focus:ring-indigo-500 outline-none block bg-white"
                            />
                            <button
                              onClick={() => handleSaveEditCategory(cat)}
                              className="p-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded"
                            >
                              เซฟ
                            </button>
                            <button
                              onClick={() => setIsEditingCat(null)}
                              className="p-1 px-2.5 bg-gray-200 hover:bg-gray-350 text-gray-700 font-bold text-[10px] rounded"
                            >
                              ปิด
                            </button>
                          </div>
                        ) : (
                          <>
                            <div>
                              <span className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                {cat}
                              </span>
                              <span className="text-[10px] text-gray-400 block mt-0.5">
                                อุปกรณ์ในหมวดหมู่นี้: {equipmentList.filter(e => e.category === cat).length} ชิ้นเด่น
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setIsEditingCat(cat);
                                  setEditingCatName(cat);
                                }}
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-all cursor-pointer"
                                title="แก้ไขชื่อ"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-all cursor-pointer"
                                title="ลบหมวดหมู่"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
