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

export function useAssetsList() {
  return useQuery<any[]>({
    queryKey: ['assetsList'],
    queryFn: async () => {
      const { data } = await axios.get('/api/assets-list');
      return data;
    },
  });
}
