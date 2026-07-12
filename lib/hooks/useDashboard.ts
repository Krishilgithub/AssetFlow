import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
    queryKey: ["audits"],
    queryFn: async () => {
      const { data } = await axios.get("/api/audits");
      return data;
    },
  });
}

export function useMaintenance() {
  return useQuery<any[]>({
    queryKey: ["maintenance"],
    queryFn: async () => {
      const { data } = await axios.get("/api/maintenance");
      return data;
    },
  });
}

export function useBookings() {
  return useQuery<any[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data } = await axios.get("/api/bookings");
      return data;
    },
  });
}