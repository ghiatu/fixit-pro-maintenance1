/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Send, Image, Trash2, CheckCircle2, ChevronDown, RefreshCw } from 'lucide-react';
import { RepairRequest, PriorityType } from '../types';
import { DEPARTMENTS, CATEGORIES, EQUIPMENT_LIST } from '../data/mockData';

interface NewRequestFormProps {
  onSubmit: (request: Partial<RepairRequest>) => void;
  onCancel: () => void;
}

export default function NewRequestForm({ onSubmit, onCancel }: NewRequestFormProps) {
  const [reporterName, setReporterName] = useState('');
  const [department, setDepartment] = useState('ฝ่ายไอที');
  const [selectedCategory, setSelectedCategory] = useState('-- ทั้งหมด --');
  const [equipmentName, setEquipmentName] = useState('-- เลือกอุปกรณ์ --');
  const [priority, setPriority] = useState<PriorityType>('medium');
  const [description, setDescription] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  // File upload simulation
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Dynamic equipment catalog filtered by category
  const filteredEquipment = selectedCategory === '-- ทั้งหมด --'
    ? EQUIPMENT_LIST
    : EQUIPMENT_LIST.filter(eq => eq.category === selectedCategory);

  // Auto reset selected equipment if category changes and currently selected equipment isn't in new category
  useEffect(() => {
    if (selectedCategory !== '-- ทั้งหมด --') {
      const isStillAvailable = filteredEquipment.some(eq => eq.name === equipmentName);
      if (!isStillAvailable) {
        setEquipmentName('-- เลือกอุปกรณ์ --');
      }
    }
  }, [selectedCategory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      const filesArray = Array.from(e.target.files) as File[];
      
      // Simulate upload to "Google Drive"
      setTimeout(() => {
        const filePromises = filesArray.map(file => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              resolve(event.target?.result as string);
            };
            reader.readAsDataURL(file);
          });
        });

        Promise.all(filePromises).then(base64Images => {
          setImages(prev => [...prev, ...base64Images]);
          setUploading(false);
        });
      }, 1500); // 1.5 second upload delay for realism
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName.trim()) {
      alert('กรุณากรอกชื่อผู้แจ้ง');
      return;
    }
    if (equipmentName === '-- เลือกอุปกรณ์ --' || !equipmentName) {
      alert('กรุณาเลือกอุปกรณ์ที่ต้องการแจ้งซ่อม');
      return;
    }
    if (!description.trim()) {
      alert('กรุณากรอกรายละเอียดปัญหา');
      return;
    }

    const newRequest: Partial<RepairRequest> = {
      reporterName,
      department,
      category: selectedCategory === '-- ทั้งหมด --' ? (EQUIPMENT_LIST.find(e => e.name === equipmentName)?.category || 'ทั่วไป') : selectedCategory,
      equipmentName,
      priority,
      description,
      additionalNotes,
      images,
    };

    onSubmit(newRequest);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8" id="new-request-form">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-sans text-gray-900 flex items-center gap-2">
          📝 แจ้งซ่อมอุปกรณ์ใหม่
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          กรุณากรอกข้อมูลให้ครบถ้วน เพื่อให้ช่างซ่อมสามารถเข้าดำเนินการได้อย่างรวดเร็ว
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Reporter & Department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              ผู้แจ้ง <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="กรอกชื่อ-นามสกุลของคุณ"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              แผนก
            </label>
            <div className="relative">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white appearance-none transition-all"
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Row 2: Equipment Category */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">
            หมวดหมู่อุปกรณ์
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
          </div>
        </div>

        {/* Row 3: Select Equipment */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">
            เลือกอุปกรณ์ <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all"
              required
            >
              <option disabled value="-- เลือกอุปกรณ์ --">-- เลือกอุปกรณ์ --</option>
              {filteredEquipment.map(eq => (
                <option key={eq.id} value={eq.name}>
                  {eq.name} ({eq.category})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
          </div>
        </div>

        {/* Row 4: Priority Level */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">
            ระดับความสำคัญ <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Low */}
            <label className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
              priority === 'low'
                ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700'
                : 'border-gray-100 hover:border-gray-200 bg-white text-gray-600'
            }`}>
              <input
                type="radio"
                name="priority"
                checked={priority === 'low'}
                onChange={() => setPriority('low')}
                className="sr-only"
              />
              <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${priority === 'low' ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'}`}>
                {priority === 'low' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-indigo-600 flex items-center gap-1">
                ⬇ ต่ำ
              </span>
            </label>

            {/* Medium */}
            <label className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
              priority === 'medium'
                ? 'border-yellow-500 bg-yellow-50/50 text-yellow-800'
                : 'border-gray-100 hover:border-gray-200 bg-white text-gray-600'
            }`}>
              <input
                type="radio"
                name="priority"
                checked={priority === 'medium'}
                onChange={() => setPriority('medium')}
                className="sr-only"
              />
              <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${priority === 'medium' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-300'}`}>
                {priority === 'medium' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 flex items-center gap-1">
                = ปานกลาง
              </span>
            </label>

            {/* High */}
            <label className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
              priority === 'high'
                ? 'border-orange-500 bg-orange-50/50 text-orange-800'
                : 'border-gray-100 hover:border-gray-200 bg-white text-gray-600'
            }`}>
              <input
                type="radio"
                name="priority"
                checked={priority === 'high'}
                onChange={() => setPriority('high')}
                className="sr-only"
              />
              <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${priority === 'high' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                {priority === 'high' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 flex items-center gap-1">
                ↑ สูง
              </span>
            </label>

            {/* Urgent */}
            <label className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
              priority === 'urgent'
                ? 'border-red-500 bg-red-50/50 text-red-800'
                : 'border-gray-100 hover:border-gray-200 bg-white text-gray-600'
            }`}>
              <input
                type="radio"
                name="priority"
                checked={priority === 'urgent'}
                onChange={() => setPriority('urgent')}
                className="sr-only"
              />
              <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${priority === 'urgent' ? 'border-red-500 bg-red-500' : 'border-gray-300'}`}>
                {priority === 'urgent' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 flex items-center gap-1">
                🔥 เร่งด่วน
              </span>
            </label>
          </div>
        </div>

        {/* Row 5: Description */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">
            รายละเอียดปัญหา <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="บรรยายปัญหาที่พบให้ละเอียด..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Row 6: Additional Notes */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">
            หมายเหตุเพิ่มเติม
          </label>
          <textarea
            rows={2}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="เช่น สถานที่ติดต่อ เวลาที่สะดวก..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Row 7: Images Upload with Drive simulation */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wide">
            📷 แนบรูปภาพอุปกรณ์ (เลือกได้หลายรูป)
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 transition-all hover:border-indigo-400 bg-slate-50/50">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              id="file-upload-input"
              className="hidden"
              disabled={uploading}
            />
            <label
              htmlFor="file-upload-input"
              className="flex flex-col items-center justify-center cursor-pointer space-y-2 text-center"
            >
              {uploading ? (
                <div className="flex flex-col items-center justify-center gap-2 py-2">
                  <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
                  <span className="text-sm font-semibold text-indigo-600">กำลังอัปโหลดไปยัง Google Drive...</span>
                </div>
              ) : (
                <>
                  <div className="bg-white p-3 rounded-full border border-gray-100 shadow-sm text-gray-500">
                    <Image className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-xs mr-2">
                      Choose Files
                    </span>
                    <span className="text-gray-500 text-sm">No file chosen</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    ℹ️ รองรับไฟล์ JPG, PNG, GIF (รูปจะอัปโหลดไป Google Drive ของอาคาร)
                  </p>
                </>
              )}
            </label>

            {/* Selected Images Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 border-t border-gray-100 pt-6">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video border border-gray-100 shadow-sm">
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="bg-red-500 p-2 rounded-full text-white hover:bg-red-600 shadow-md transform hover:scale-115 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions Button Row */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all shadow-xs"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 hover:shadow-xl"
          >
            <Send className="w-4 h-4" /> ส่งคำขอ
          </button>
        </div>
      </form>
    </div>
  );
}
