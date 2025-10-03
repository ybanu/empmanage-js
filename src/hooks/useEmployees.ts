import { useState, useEffect } from 'react';
import { Employee, EmployeeFormData } from '@/types/employee';

const STORAGE_KEY = 'employees';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setEmployees(JSON.parse(stored));
    }
  }, []);

  const saveToStorage = (data: Employee[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setEmployees(data);
  };

  const addEmployee = (data: EmployeeFormData) => {
    const newEmployee: Employee = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveToStorage([...employees, newEmployee]);
  };

  const updateEmployee = (id: string, data: EmployeeFormData) => {
    const updated = employees.map((emp) =>
      emp.id === id
        ? { ...emp, ...data, updatedAt: new Date().toISOString() }
        : emp
    );
    saveToStorage(updated);
  };

  const deleteEmployee = (id: string) => {
    saveToStorage(employees.filter((emp) => emp.id !== id));
  };

  return {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
};
