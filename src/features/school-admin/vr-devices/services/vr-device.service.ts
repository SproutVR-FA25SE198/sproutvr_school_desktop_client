'use client';

import http from '@/common/utils/http';
import type { VRDeviceDisplay, VRDeviceStatus } from '../types/device.types';

export interface VRDeviceStatusResponse {
  key: VRDeviceStatus;
  name: string;
}

export interface VRDeviceApiItem {
  id: string;
  name: string;
  serializeNumber: string;
  serialNumber?: string;
  status: VRDeviceStatusResponse;
  createdAtUtc: string;
  createdAtVietNam?: string;
}

export interface VRDeviceApiResponse {
  totalItems: number;
  items: VRDeviceApiItem[];
}

export interface VRDeviceDetailResponse extends VRDeviceApiItem {
  taskProgresses?: unknown[];
  sessionSummaries?: unknown[];
}

export interface FetchVRDevicesParams {
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  name?: string;
  vrDeviceStatus?: VRDeviceStatus;
  serialNumber?: string;
  isPaginated?: boolean;
}

const DEFAULT_PARAMS: Required<Pick<FetchVRDevicesParams, 'pageIndex' | 'pageSize' | 'isPaginated' | 'sortBy'>> = {
  pageIndex: 1,
  pageSize: 12,
  isPaginated: true,
  sortBy: 'createdAtUtcDesc',
};

const VR_DEVICES_ENDPOINT = '/api/v1/authorized/vrdevices';
const VR_DEVICES_IMPORT_ENDPOINT = '/api/v1/school-admin/vrdevices/import';
const VR_DEVICE_ASSIGN_STATUS_ENDPOINT = '/api/v1/school-admin/vrdevices';

export interface VRDeviceListResult {
  items: VRDeviceDisplay[];
  totalItems: number;
}

export async function fetchVRDevices(params: FetchVRDevicesParams = {}): Promise<VRDeviceListResult> {
  const query = {
    ...DEFAULT_PARAMS,
    ...params,
  } as FetchVRDevicesParams;

  const response = await http.get<VRDeviceApiResponse>(VR_DEVICES_ENDPOINT, {
    params: query,
  });

  const apiData = response.data;

  if (!apiData?.items) {
    return { items: [], totalItems: 0 };
  }

  return {
    items: apiData.items.map((item) => ({
      id: item.id,
      name: item.name,
      status: item.status?.key ?? 0,
      serialNumber: item.serialNumber ?? item.serializeNumber,
      createdAtUtc: item.createdAtUtc,
      updatedAtUtc: item.createdAtUtc,
    })),
    totalItems: apiData.totalItems ?? apiData.items.length,
  };
}

export async function fetchVRDeviceById(id: string): Promise<VRDeviceDisplay | null> {
  if (!id) return null;

  const response = await http.get<VRDeviceDetailResponse>(`${VR_DEVICES_ENDPOINT}/${id}`);
  const item = response.data;

  if (!item) {
    return null;
  }

  return {
    id: item.id,
    name: item.name,
    status: item.status?.key ?? 0,
    serialNumber: item.serialNumber ?? item.serializeNumber,
    createdAtUtc: item.createdAtUtc,
    updatedAtUtc: item.createdAtUtc,
  };
}

export async function importVRDevices(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('excelFile', file);

  await http.post(VR_DEVICES_IMPORT_ENDPOINT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function updateVRDeviceStatus(id: string, status: VRDeviceStatus): Promise<void> {
  if (!id) throw new Error('Missing VR device id');

  await http.patch(`${VR_DEVICE_ASSIGN_STATUS_ENDPOINT}/${id}/assign-status`, {
    status,
  });
}
