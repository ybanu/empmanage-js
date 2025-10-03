export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  createdAt: string;
  updatedAt: string;
}

export type EmployeeFormData = Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>;
