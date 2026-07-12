import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// ─── Admin Dashboard Hooks ────────────────────────────────────────────────────

export function useDashboardKPIs() {
  return useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: async () => {
      const { data } = await axios.get('/api/dashboard/kpis');
      return data;
    },
  });
}

export function useDashboardActivities() {
  return useQuery({
    queryKey: ['dashboard', 'activities'],
    queryFn: async () => {
      const { data } = await axios.get('/api/dashboard/activities');
      return data;
    },
  });
}

export function useDashboardCharts() {
  return useQuery({
    queryKey: ['dashboard', 'charts'],
    queryFn: async () => {
      const { data } = await axios.get('/api/dashboard/charts');
      return data;
    },
  });
}

export function useDepartments() {
  return useQuery<any[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data } = await axios.get('/api/departments');
      return data;
    },
  });
}

export function useEmployees() {
  return useQuery<any[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data } = await axios.get('/api/employees');
      return data;
    },
  });
}

export function useAssetsList() {
  return useQuery<any[]>({
    queryKey: ['assetsList'],
    queryFn: async () => {
      const { data } = await axios.get('/api/assets');
      return data;
    },
  });
}

export function useAllocations() {
  return useQuery<any[]>({
    queryKey: ['allocations'],
    queryFn: async () => {
      const { data } = await axios.get('/api/allocations');
      return data;
    },
  });
}

export function useTransfers() {
  return useQuery<any[]>({
    queryKey: ['transfers'],
    queryFn: async () => {
      const { data } = await axios.get('/api/transfers');
      return data;
    },
  });
}

export function useAudits() {
  return useQuery<any[]>({
    queryKey: ['audits'],
    queryFn: async () => {
      const { data } = await axios.get('/api/audits');
      return data;
    },
  });
}

export function useMaintenance() {
  return useQuery<any[]>({
    queryKey: ['maintenance'],
    queryFn: async () => {
      const { data } = await axios.get('/api/maintenance');
      return data;
    },
  });
}

export function useBookings() {
  return useQuery<any[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data } = await axios.get('/api/bookings');
      return data;
    },
  });
}

// ─── Employee Self-Service Hooks ──────────────────────────────────────────────

export function useMyAssets() {
  return useQuery<any[]>({
    queryKey: ['myAssets'],
    queryFn: async () => {
      const { data } = await axios.get('/api/me/assets');
      return data;
    },
  });
}

export function useMyBookings() {
  return useQuery<any[]>({
    queryKey: ['myBookings'],
    queryFn: async () => {
      const { data } = await axios.get('/api/me/bookings');
      return data;
    },
  });
}

export function useMyMaintenance() {
  return useQuery<any[]>({
    queryKey: ['myMaintenance'],
    queryFn: async () => {
      const { data } = await axios.get('/api/me/maintenance');
      return data;
    },
  });
}

export function useMyTransfers() {
  return useQuery<any[]>({
    queryKey: ['myTransfers'],
    queryFn: async () => {
      const { data } = await axios.get('/api/me/transfers');
      return data;
    },
  });
}

export function useMyReturns() {
  return useQuery<any[]>({
    queryKey: ['myReturns'],
    queryFn: async () => {
      const { data } = await axios.get('/api/me/returns');
      return data;
    },
  });
}

// ─── Department Head Hooks ────────────────────────────────────────────────────

/**
 * Fetches all department-scoped data in a single request.
 * Returns: { dept, overview, assets, employees, transfers, maintenance, returns, bookings }
 */
export function useDeptOverview() {
  return useQuery<any>({
    queryKey: ['dept', 'overview'],
    queryFn: async () => {
      const { data } = await axios.get('/api/dept/overview');
      return data;
    },
  });
}

/**
 * Mutation helper for approving a dept-scoped request
 */
export function useApproveMutation(target: 'transfers' | 'returns' | 'maintenance') {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.patch(`/api/dept/${target}/${id}/approve`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dept', 'overview'] });
    },
  });
}

/**
 * Mutation helper for rejecting a dept-scoped request
 */
export function useRejectMutation(target: 'transfers' | 'maintenance') {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const { data } = await axios.patch(`/api/dept/${target}/${id}/reject`, { reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dept', 'overview'] });
    },
  });
}
