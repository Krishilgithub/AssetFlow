import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// ─── Admin Dashboard Hooks ────────────────────────────────────────────────────

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await axios.get('/api/settings');
      return data;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settingsData: any) => {
      const { data } = await axios.put('/api/settings', settingsData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}

export function usePurgeAssets() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete('/api/settings/purge');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['assetsList'] });
      queryClient.invalidateQueries({ queryKey: ['allocations'] });
      queryClient.invalidateQueries({ queryKey: ['audits'] });
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
    },
  });
}

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
  return useQuery({
    queryKey: ['audits'],
    queryFn: async () => {
      const res = await fetch('/api/audits');
      if (!res.ok) throw new Error('Failed to fetch audits');
      return res.json();
    }
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    }
  });
}

export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const res = await fetch('/api/locations');
      if (!res.ok) throw new Error('Failed to fetch locations');
      return res.json();
    }
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

// ─── Notifications Hooks ──────────────────────────────────────────────────────

/**
 * Fetch the current user's notifications
 */
export function useMyNotifications() {
  return useQuery<any[]>({
    queryKey: ['myNotifications'],
    queryFn: async () => {
      const { data } = await axios.get('/api/me/notifications');
      return data;
    },
    refetchInterval: 30000, // auto-refresh every 30s
  });
}

/**
 * Mark a single notification as read
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.patch(`/api/me/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myNotifications'] });
    },
  });
}

/**
 * Mark all notifications as read
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await axios.patch('/api/me/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myNotifications'] });
    },
  });
}

/**
 * Clear (delete) all notifications
 */
export function useClearNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await axios.delete('/api/me/notifications');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myNotifications'] });
    },
  });
}

// ─── Report Export Utility ────────────────────────────────────────────────────

/**
 * Trigger a CSV download for a given report type.
 * Usage: downloadReport('assets') or downloadReport('transfers', deptId)
 */
export async function downloadReport(format: 'assets' | 'allocations' | 'transfers' | 'maintenance', deptId?: string) {
  const params = new URLSearchParams({ format });
  if (deptId) params.set('deptId', deptId);

  const response = await axios.get(`/api/reports/export?${params.toString()}`, {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  const disposition = response.headers['content-disposition'] || '';
  const match = disposition.match(/filename="(.+?)"/);
  link.setAttribute('download', match ? match[1] : `${format}-report.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}


// ─── Auth User Helpers ────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

/** Call this right after a successful login or signup response. */
export function saveCurrentUser(user: AuthUser) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('assetflow_user', JSON.stringify(user));
  }
}

/** Clear persisted user on logout. */
export function clearCurrentUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('assetflow_user');
  }
}

export function useCurrentUser() {
  // Read localStorage synchronously so the name is available on the very first render
  const getStored = (): AuthUser | undefined => {
    if (typeof window === 'undefined') return undefined;
    try {
      const raw = localStorage.getItem('assetflow_user');
      return raw ? (JSON.parse(raw) as AuthUser) : undefined;
    } catch {
      return undefined;
    }
  };

  return useQuery<AuthUser>({
    queryKey: ['currentUser'],
    // initialData seeds the cache synchronously — no loading flash
    initialData: getStored,
    queryFn: async () => {
      // Return stored value if available (avoids any network call mid-session)
      const stored = getStored();
      if (stored) return stored;

      // First visit after login or localStorage cleared — fetch from cookie-backed API
      const { data } = await axios.get('/api/auth/me');
      if (data?.user) {
        saveCurrentUser(data.user);
      }
      return data.user as AuthUser;
    },
    retry: false,
    staleTime: 1000 * 60 * 10, // 10-min cache — user data doesn't change mid-session
  });
}