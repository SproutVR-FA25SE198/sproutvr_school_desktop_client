'use client';

import { http_school } from '@/common/utils/http';
import type { Map, MapList, MapListItem } from '../types/map.types';

export interface FetchMapsParams {
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  mapStatus?: number; 
  subjectId?: string;
  isPaginated?: boolean;
}

const DEFAULT_PARAMS: Required<Pick<FetchMapsParams, 'pageIndex' | 'pageSize' | 'isPaginated' | 'sortBy'>> = {
  pageIndex: 1,
  pageSize: 10,
  isPaginated: true,
  sortBy: 'createdAtUtcDesc',
};

const MAPS_ADMIN_ENDPOINT = '/api/v1/school-admin/maps';
const MAPS_AUTHORIZED_ENDPOINT = '/api/v1/authorized/maps';

export interface MapListResult {
  items: MapListItem[];
  totalItems: number;
}

// Fetch Map list
export async function fetchMaps(params: FetchMapsParams = {}): Promise<MapListResult> {
  const query = {
    ...DEFAULT_PARAMS,
    ...params,
  } as FetchMapsParams;

  const response = await http_school.get<MapList>(MAPS_AUTHORIZED_ENDPOINT, {
    params: query,
  });

  const apiData = response.data;

  if (!apiData?.items) {
    return { items: [], totalItems: 0 };
  }

  return {
    items: apiData.items,
    totalItems: apiData.totalItems ?? apiData.items.length,
  };
}

// Fetch Map by id 
export async function fetchMapById(id: string): Promise<Map | null> {
  if (!id) return null;

  const response = await http_school.get<Map>(`${MAPS_AUTHORIZED_ENDPOINT}/${id}`);
  const item = response.data;

  if (!item) {
    return null;
  }

  return item
}

// Change Map status
export async function updateMapStatus(id: string, status: number): Promise<void> {
  if (!id) throw new Error('Missing Map id');

  await http_school.patch(`${MAPS_ADMIN_ENDPOINT}/${id}/assign-status`, {
    status,
  });
}