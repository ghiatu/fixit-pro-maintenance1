/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RepairRequest, Equipment, SparePart, Mechanic, Department } from '../types';

export const DEPARTMENTS: Department[] = [
  { id: 'DP01', name: 'ฝ่ายไอที', building: 'อาคาร A', floor: 4 },
  { id: 'DP02', name: 'ฝ่ายบุคคล', building: 'อาคาร A', floor: 2 },
  { id: 'DP03', name: 'ฝ่ายบัญชี', building: 'อาคาร B', floor: 3 },
  { id: 'DP04', name: 'ฝ่ายการตลาด', building: 'อาคาร B', floor: 1 },
  { id: 'DP05', name: 'ฝ่ายผลิต', building: 'อาคาร C', floor: 1 },
  { id: 'DP06', name: 'ฝ่ายวิจัยและพัฒนา', building: 'อาคาร A', floor: 5 },
];

export const CATEGORIES = [
  '-- ทั้งหมด --',
  'เครื่องใช้ไฟฟ้า',
  'ระบบไอที & เครือข่าย',
  'สุขาภิบาล & ประปา',
  'เครื่องใช้สำนักงาน',
  'เครื่องเสียงและงานระบบ'
];

export const EQUIPMENT_LIST: Equipment[] = [
  { id: 'EQ01', name: 'เครื่องปรับอากาศ LG รุ่น 9469', category: 'เครื่องใช้ไฟฟ้า', status: 'repairing', lastChecked: '2026-06-10' },
  { id: 'EQ02', name: 'กล้องวงจรปิด Bosch รุ่น 1718', category: 'ระบบไอที & เครือข่าย', status: 'broken', lastChecked: '2026-06-12' },
  { id: 'EQ03', name: 'เครื่องพิมพ์ HP รุ่น 3594', category: 'เครื่องใช้สำนักงาน', status: 'active', lastChecked: '2026-06-15' },
  { id: 'EQ04', name: 'เครื่องเสียง TOA รุ่น 4291', category: 'เครื่องเสียงและงานระบบ', status: 'active', lastChecked: '2026-05-20' },
  { id: 'EQ05', name: 'เครื่องใช้สำนักงาน Toshiba รุ่น 8408', category: 'เครื่องใช้สำนักงาน', status: 'repairing', lastChecked: '2026-06-14' },
  { id: 'EQ06', name: 'กล้องวงจรปิด Bosch รุ่น 5902', category: 'ระบบไอที & เครือข่าย', status: 'broken', lastChecked: '2026-05-30' },
  { id: 'EQ07', name: 'UPS/แบตเตอรี่ APC รุ่น 2749', category: 'ระบบไอที & เครือข่าย', status: 'active', lastChecked: '2026-06-02' },
  { id: 'EQ08', name: 'โทรศัพท์/เครือข่าย Ubiquiti รุ่น 7117', category: 'ระบบไอที & เครือข่าย', status: 'active', lastChecked: '2026-06-10' },
  { id: 'EQ09', name: 'อุปกรณ์ไฟฟ้า Toshiba รุ่น 2674', category: 'เครื่องใช้ไฟฟ้า', status: 'active', lastChecked: '2026-06-14' },
  { id: 'EQ10', name: 'โทรศัพท์/เครือข่าย Ubiquiti รุ่น 9831', category: 'ระบบไอที & เครือข่าย', status: 'broken', lastChecked: '2026-06-01' },
  { id: 'EQ11', name: 'เครื่องพิมพ์ Ricoh รุ่น 6570', category: 'เครื่องใช้สำนักงาน', status: 'broken', lastChecked: '2026-06-01' },
  { id: 'EQ12', name: 'เครื่อง Shure รุ่น 6680', category: 'เครื่องเสียงและงานระบบ', status: 'repairing', lastChecked: '2026-06-05' },
  { id: 'EQ13', name: 'เครื่องเสียง Sennheiser รุ่น 6743', category: 'เครื่องเสียงและงานระบบ', status: 'active', lastChecked: '2026-06-12' },
];

export const MECHANICS: Mechanic[] = [
  { id: 'M01', name: 'รัชชานนท์ ซ่อมได้', specialty: 'เครื่องเสียงและระบบไฟฟ้า', phone: '081-234-5678', status: 'idle', activeJobs: 0 },
  { id: 'M02', name: 'ธนากร รักงาน', specialty: 'กล้องวงจรปิดและเครือข่าย', phone: '082-345-6789', status: 'busy', activeJobs: 2 },
  { id: 'M03', name: 'พิเชษฐ สายช่าง', specialty: 'เครื่องใช้สำนักงานทั่วไป', phone: '083-456-7890', status: 'busy', activeJobs: 1 },
  { id: 'M04', name: 'วิทยา พร้อมซ่อม', specialty: 'เครื่องเสียงและงานระบบ', phone: '084-567-8901', status: 'idle', activeJobs: 1 },
  { id: 'M05', name: 'สมศักดิ์ ช่างไฟ', specialty: 'ระบบไฟฟ้าอาคาร', phone: '085-678-9012', status: 'idle', activeJobs: 0 },
  { id: 'M06', name: 'สุรเชษฐ์ เก่งงาน', specialty: 'เครื่องปรับอากาศและระบบทำความเย็น', phone: '086-789-0123', status: 'busy', activeJobs: 1 },
];

export const SPARE_PARTS: SparePart[] = [
  { id: 'SP01', name: 'บอร์ดขยายเสียง TOA', stock: 2, minStock: 1, pricePerUnit: 12500 },
  { id: 'SP02', name: 'เลนส์กล้องวงจรปิด 4mm', stock: 5, minStock: 2, pricePerUnit: 1800 },
  { id: 'SP03', name: 'สายฟิวส์ทนความร้อน', stock: 15, minStock: 5, pricePerUnit: 120 },
  { id: 'SP04', name: 'แบตเตอรี่ UPS 12V 9Ah', stock: 4, minStock: 2, pricePerUnit: 950 },
  { id: 'SP05', name: 'พอร์ต LAN RJ45 Cat6 (กล่อง)', stock: 3, minStock: 1, pricePerUnit: 450 },
  { id: 'SP06', name: 'คอมเพรสเซอร์แอร์ LG 12000BTU', stock: 0, minStock: 1, pricePerUnit: 3500 },
];

export const INITIAL_REPAIR_REQUESTS: RepairRequest[] = [
  {
    id: 'REQ00220',
    createdAt: '2026-03-26 22:43',
    reporterName: 'ธนกร รุ่งโรจน์',
    department: 'ฝ่ายบุคคล',
    category: 'เครื่องเสียงและงานระบบ',
    equipmentName: 'เครื่องเสียง Sennheiser รุ่น 6743',
    priority: 'urgent',
    description: 'ลำโพงไม่มีออกเสียง',
    additionalNotes: 'ห้องประชุมใหญ่ ชั้น 2 อาคาร A',
    images: [],
    assignedMechanic: 'รัชชานนท์ ซ่อมได้',
    status: 'completed',
    cost: 4500,
    updatedAt: '2026-03-27 10:15',
  },
  {
    id: 'REQ00219',
    createdAt: '2026-05-17 22:43',
    reporterName: 'ภาณุ พงศ์ภัทร',
    department: 'ฝ่ายไอที',
    category: 'ระบบไอที & เครือข่าย',
    equipmentName: 'กล้องวงจรปิด Bosch รุ่น 1718',
    priority: 'high',
    description: 'เลนส์เบลอ',
    additionalNotes: 'บริเวณหน้าบันไดเลื่อนชั้น 1 อาคาร B',
    images: [],
    assignedMechanic: 'ธนากร รักงาน',
    status: 'waiting_parts',
    cost: 1800,
    updatedAt: '2026-05-18 14:20',
  },
  {
    id: 'REQ00218',
    createdAt: '2026-05-29 22:43',
    reporterName: 'สุเมธ ดวงแก้ว',
    department: 'ฝ่ายการตลาด',
    category: 'เครื่องใช้สำนักงาน',
    equipmentName: 'เครื่องพิมพ์ HP รุ่น 3594',
    priority: 'medium',
    description: 'พิมพ์ไม่ออก',
    additionalNotes: 'เสียบปลั๊กแล้วไฟไม่เข้าเครื่อง',
    images: [],
    assignedMechanic: 'รัชชานนท์ ซ่อมได้',
    status: 'completed',
    cost: 350,
    updatedAt: '2026-05-30 11:00',
  },
  {
    id: 'REQ00217',
    createdAt: '2026-03-20 22:43',
    reporterName: 'ภาณุ พงศ์ภัทร',
    department: 'ฝ่ายไอที',
    category: 'เครื่องเสียงและงานระบบ',
    equipmentName: 'เครื่องเสียง TOA รุ่น 4291',
    priority: 'medium',
    description: 'ลำโพงไม่มีออกเสียง',
    additionalNotes: 'มีเสียงซ่าเบาๆ แต่เปิดเพลงไม่ดัง',
    images: [],
    assignedMechanic: 'ธนากร รักงาน',
    status: 'completed',
    cost: 12500,
    updatedAt: '2026-03-21 16:30',
  },
  {
    id: 'REQ00216',
    createdAt: '2026-05-30 22:43',
    reporterName: 'รัชดา พรมศรี',
    department: 'ฝ่ายบัญชี',
    category: 'เครื่องใช้สำนักงาน',
    equipmentName: 'เครื่องใช้สำนักงาน Toshiba รุ่น 8408',
    priority: 'high',
    description: 'มีกลิ่นไหม้',
    additionalNotes: 'มีควันลอยขึ้นมาจางๆ ตอนกดสแกนเอกสาร',
    images: [],
    assignedMechanic: 'พิเชษฐ สายช่าง',
    status: 'in_progress',
    cost: 1200,
    updatedAt: '2026-05-31 09:00',
  },
  {
    id: 'REQ00215',
    createdAt: '2026-03-31 22:43',
    reporterName: 'ภาณุ พงศ์ภัทร',
    department: 'ฝ่ายไอที',
    category: 'ระบบไอที & เครือข่าย',
    equipmentName: 'กล้องวงจรปิด Bosch รุ่น 5902',
    priority: 'urgent',
    description: 'บันทึกไม่ได้',
    additionalNotes: 'ระบบแจ้งคัดลอกไฟล์ล้มเหลว',
    images: [],
    assignedMechanic: '-',
    status: 'pending',
    cost: 0,
    updatedAt: '2026-03-31 22:43',
  },
  {
    id: 'REQ00214',
    createdAt: '2026-05-26 22:43',
    reporterName: 'ศศิพิมล พัฒนกุล',
    department: 'ฝ่ายวิจัยและพัฒนา',
    category: 'ระบบไอที & เครือข่าย',
    equipmentName: 'UPS/แบตเตอรี่ APC รุ่น 2749',
    priority: 'low',
    description: 'สัญญาณเสียงเตือน',
    additionalNotes: 'เสียงร้องติ๊ดๆ ตลอดเวลาแม้จะถอดสายออก',
    images: [],
    assignedMechanic: 'รัชชานนท์ ซ่อมได้',
    status: 'completed',
    cost: 950,
    updatedAt: '2026-05-27 15:40',
  },
  {
    id: 'REQ00213',
    createdAt: '2026-06-09 22:43',
    reporterName: 'รัชดา พรมศรี',
    department: 'ฝ่ายบัญชี',
    category: 'เครื่องใช้สำนักงาน',
    equipmentName: 'เครื่องใช้สำนักงาน Toshiba รุ่น 8408',
    priority: 'high',
    description: 'มีกลิ่นไหม้',
    additionalNotes: 'ส่งซ้ำรอบสอง อาการเดิมเลยค่ะ',
    images: [],
    assignedMechanic: 'วิทยา พร้อมซ่อม',
    status: 'completed',
    cost: 2400,
    updatedAt: '2026-06-10 13:20',
  },
  {
    id: 'REQ00212',
    createdAt: '2026-04-06 22:43',
    reporterName: 'ชัยวัฒน์ ฉลาดเฉลียว',
    department: 'ฝ่ายไอที',
    category: 'ระบบไอที & เครือข่าย',
    equipmentName: 'โทรศัพท์/เครือข่าย Ubiquiti รุ่น 7117',
    priority: 'low',
    description: 'พอร์ตไม่ทำงาน',
    additionalNotes: 'พอร์ตที่ 4 ไฟสีเหลืองไม่กะพริบ',
    images: [],
    assignedMechanic: 'สมศักดิ์ ช่างไฟ',
    status: 'completed',
    cost: 1500,
    updatedAt: '2026-04-07 11:30',
  },
  {
    id: 'REQ00211',
    createdAt: '2026-06-10 22:43',
    reporterName: 'รัตนา สว่างใจ',
    department: 'ฝ่ายผลิต',
    category: 'เครื่องใช้ไฟฟ้า',
    equipmentName: 'อุปกรณ์ไฟฟ้า Toshiba รุ่น 2674',
    priority: 'high',
    description: 'ปลั๊กไฟไหม้',
    additionalNotes: 'เต้ารับหลังตู้เย็นละลาย คาดว่ากระแสไฟเกิน',
    images: [],
    assignedMechanic: 'สุรเชษฐ์ เก่งงาน',
    status: 'completed',
    cost: 550,
    updatedAt: '2026-06-11 10:00',
  },
  {
    id: 'REQ00210',
    createdAt: '2026-04-26 22:43',
    reporterName: 'ภาณุ พงศ์ภัทร',
    department: 'ฝ่ายไอที',
    category: 'เครื่องใช้ไฟฟ้า',
    equipmentName: 'เครื่องปรับอากาศ LG รุ่น 9469',
    priority: 'low',
    description: 'รีโมทไม่ทำงาน',
    additionalNotes: 'เปลี่ยนถ่านแล้วแต่ยังกดเปิดไม่ได้ ต้องกดปุ่มหลังเครื่องแทน',
    images: [],
    assignedMechanic: 'สุรเชษฐ์ เก่งงาน',
    status: 'received',
    cost: 0,
    updatedAt: '2026-04-27 14:00',
  },
  {
    id: 'REQ00209',
    createdAt: '2026-04-29 22:43',
    reporterName: 'สุเมธ ดวงแก้ว',
    department: 'ฝ่ายการตลาด',
    category: 'ระบบไอที & เครือข่าย',
    equipmentName: 'โทรศัพท์/เครือข่าย Ubiquiti รุ่น 9831',
    priority: 'low',
    description: 'เน็ตช้าผิดปกติ',
    additionalNotes: 'ทดสอบ Speed test ได้เพียง 5Mbps',
    images: [],
    assignedMechanic: '-',
    status: 'pending',
    cost: 0,
    updatedAt: '2026-04-29 22:43',
  },
  {
    id: 'REQ00208',
    createdAt: '2026-05-10 22:43',
    reporterName: 'วีระศักดิ์ วิริยะ',
    department: 'ฝ่ายไอที',
    category: 'เครื่องใช้สำนักงาน',
    equipmentName: 'เครื่องพิมพ์ Ricoh รุ่น 6570',
    priority: 'low',
    description: 'เครื่องไม่ตอบสนอง',
    additionalNotes: 'หน้าจอสัมผัสค้างโลโก้ตอนบูต',
    images: [],
    assignedMechanic: '-',
    status: 'cancelled',
    cost: 0,
    updatedAt: '2026-05-11 12:00',
  },
  {
    id: 'REQ00207',
    createdAt: '2026-04-02 22:43',
    reporterName: 'ภาณุ พงศ์ภัทร',
    department: 'ฝ่ายไอที',
    category: 'เครื่องเสียงและงานระบบ',
    equipmentName: 'เครื่อง Shure รุ่น 6680',
    priority: 'urgent',
    description: 'เสียงแตก',
    additionalNotes: 'ไมโครโฟนไร้สาย ช่องสัญญาณคู่เสียงแตกพร่ามาก',
    images: [],
    assignedMechanic: 'วิทยา พร้อมซ่อม',
    status: 'waiting_parts',
    cost: 4800,
    updatedAt: '2026-04-04 15:10',
  }
];

// Helper to calculate statistics matching the dashboard screenshots while allowing dynamic updates
export function getStats(requests: RepairRequest[]) {
  const total = 220; // Simulated base to match the screenshot "220", or dynamic fallback.
  // We'll base stats on actual requests array, but we can scale them to match the exact screenshots
  // or we can count dynamically while maintaining high fidelity.
  // Let's count dynamically from the data, but pad the numbers slightly to match the screenshot or calculate exactly!
  // Counting exact status counts from current array:
  const pending = requests.filter(r => r.status === 'pending').length;
  const received = requests.filter(r => r.status === 'received').length;
  const inProgress = requests.filter(r => r.status === 'in_progress').length;
  const waitingParts = requests.filter(r => r.status === 'waiting_parts').length;
  const completed = requests.filter(r => r.status === 'completed').length;
  const cancelled = requests.filter(r => r.status === 'cancelled').length;

  // Let's create high-fidelity ratios
  const baseReqCount = 220;
  // If the requests length matches initial (14), we can scale it to the exact screenshot values:
  // total: 220, pending & received: 57, inProgress: 50, completed: 82, cancelling: 31
  // If request count increases, we increment these numbers to reflect the real updates.
  const offset = requests.length - INITIAL_REPAIR_REQUESTS.length;

  const currentTotal = baseReqCount + offset;
  const currentPendingAndRecv = 57 + requests.filter(r => r.status === 'pending' || r.status === 'received').length - INITIAL_REPAIR_REQUESTS.filter(r => r.status === 'pending' || r.status === 'received').length;
  const currentInProgress = 50 + requests.filter(r => r.status === 'in_progress' || r.status === 'waiting_parts').length - INITIAL_REPAIR_REQUESTS.filter(r => r.status === 'in_progress' || r.status === 'waiting_parts').length;
  const currentCompleted = 82 + requests.filter(r => r.status === 'completed').length - INITIAL_REPAIR_REQUESTS.filter(r => r.status === 'completed').length;

  // Costs calculation
  const baseCost = 361448;
  const addedCost = requests.reduce((sum, r) => sum + r.cost, 0) - INITIAL_REPAIR_REQUESTS.reduce((sum, r) => sum + r.cost, 0);
  const currentCost = baseCost + addedCost;

  return {
    total: currentTotal,
    pending: currentPendingAndRecv,
    inProgress: currentInProgress,
    completed: currentCompleted,
    equipmentCount: 138,
    mechanicsCount: 6,
    lowStockCount: 0,
    totalCost: currentCost
  };
}
