/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PriorityType = 'low' | 'medium' | 'high' | 'urgent';
export type StatusType = 'pending' | 'received' | 'in_progress' | 'waiting_parts' | 'completed' | 'cancelled';

export interface RepairRequest {
  id: string; // e.g., REQ00220
  createdAt: string; // ISO format or Thai formatted date
  reporterName: string;
  department: string;
  category: string;
  equipmentName: string;
  priority: PriorityType;
  description: string;
  additionalNotes?: string;
  images: string[]; // Base64 or object URLs
  assignedMechanic: string; // "-" or mechanic name
  status: StatusType;
  cost: number; // cost of parts/repair
  updatedAt: string;
  targetDate?: string;
  rootCause?: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'repairing' | 'broken';
  lastChecked: string;
}

export interface SparePart {
  id: string;
  name: string;
  stock: number;
  minStock: number;
  pricePerUnit: number;
}

export interface Mechanic {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  status: 'idle' | 'busy' | 'off';
  activeJobs: number;
}

export interface Department {
  id: string;
  name: string;
  building: string;
  floor: number;
}
