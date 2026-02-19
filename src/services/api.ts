import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globales
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error de API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Tipos
interface Bike {
  id: number;
  placa: string;
  brand: string;
  model: string;
  cylinder: string;
}

interface WorkOrder {
  id: number;
  motoPlaca: string;
  entryDate: string;
  faultDescription: string;
  status: 'RECIBIDA' | 'DIAGNOSTICO' | 'EN_PROCESO' | 'LISTA' | 'ENTREGADA' | 'CANCELADA';
  total: number;
  items?: any[];
}

interface Client {
  id: number;
  name: string;
  phone: string;
  email?: string;
}

// Servicio de Motos/Bikes
export const bikeService = {
  getAll: () => apiClient.get<Bike[]>('/bikes'),
  getById: (placa: string) => apiClient.get<Bike>(`/bikes/${placa}`),
  getByPlate: (plate: string) => apiClient.get<Bike[]>(`/bikes?plate=${plate}`),
  create: (data: Partial<Bike>) => apiClient.post<Bike>('/bikes', data),
  update: (placa: string, data: Partial<Bike>) => apiClient.put<Bike>(`/bikes/${placa}`, data),
  delete: (placa: string) => apiClient.delete(`/bikes/${placa}`),
};

// Servicio de Órdenes de Trabajo
export const workOrderService = {
  getAll: (params?: any) => apiClient.get<WorkOrder[]>('/work-orders', { params }),
  getById: (id: number) => apiClient.get<WorkOrder>(`/work-orders/${id}`),
  create: (data: Partial<WorkOrder>) => apiClient.post<WorkOrder>('/work-orders', data),
  update: (id: number, data: Partial<WorkOrder>) => apiClient.put<WorkOrder>(`/work-orders/${id}`, data),
  changeStatus: (id: number, status: string) =>
    apiClient.patch<WorkOrder>(`/work-orders/${id}/status`, { status }),
  addItem: (id: number, item: any) => apiClient.post(`/work-orders/${id}/items`, item),
  deleteItem: (itemId: number) => apiClient.delete(`/work-orders/items/${itemId}`),
};

// Servicio de Clientes
export const clientService = {
  getAll: (search?: string) => apiClient.get<Client[]>('/clients', { params: { search } }),
  getById: (id: number) => apiClient.get<Client>(`/clients/${id}`),
  create: (data: Partial<Client>) => apiClient.post<Client>('/clients', data),
  update: (id: number, data: Partial<Client>) => apiClient.put<Client>(`/clients/${id}`, data),
  delete: (id: number) => apiClient.delete(`/clients/${id}`),
};

export default apiClient;
export type { Bike, WorkOrder, Client };
