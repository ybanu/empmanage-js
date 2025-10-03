import { useState, useMemo } from 'react';
import { useEmployees } from '@/hooks/useEmployees';
import { Employee, EmployeeFormData } from '@/types/employee';
import { EmployeeForm } from '@/components/EmployeeForm';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [employees, searchQuery]);

  const handleAdd = (data: EmployeeFormData) => {
    addEmployee(data);
    toast({
      title: 'Employee added',
      description: `${data.name} has been added successfully.`,
    });
  };

  const handleEdit = (data: EmployeeFormData) => {
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, data);
      toast({
        title: 'Employee updated',
        description: `${data.name} has been updated successfully.`,
      });
      setEditingEmployee(undefined);
    }
  };

  const handleDelete = () => {
    if (employeeToDelete) {
      const emp = employees.find((e) => e.id === employeeToDelete);
      deleteEmployee(employeeToDelete);
      toast({
        title: 'Employee deleted',
        description: `${emp?.name} has been removed.`,
        variant: 'destructive',
      });
      setEmployeeToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const openEditForm = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingEmployee(undefined);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Employee Management
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage your team with ease. Add, edit, or remove employees.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Employee Directory</CardTitle>
                <CardDescription>
                  {filteredEmployees.length} {filteredEmployees.length === 1 ? 'employee' : 'employees'} found
                </CardDescription>
              </div>
              <Button onClick={openAddForm} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Employee
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            {filteredEmployees.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'No employees found matching your search.' : 'No employees yet. Add your first employee to get started.'}
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openEditForm(employee)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setEmployeeToDelete(employee.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <EmployeeForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={editingEmployee ? handleEdit : handleAdd}
          employee={editingEmployee}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the employee record.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Index;
