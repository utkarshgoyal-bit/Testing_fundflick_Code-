import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_DEPARTMENT, FETCH_DEPARTMENTS } from '@/redux/actions/types';
import { RootState } from '@/redux/slices';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type Department = {
  departmentName: string;
  description: string;
};

interface DepartmentSelectProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function DepartmentSelect({ value, onChange }: DepartmentSelectProps) {
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.department);
  const [departments, setDepartments] = useState<any[]>(data);

  const [newDept, setNewDept] = useState({ departmentName: '', description: '' });

  const handleAddDepartment = () => {
    if (newDept.departmentName.trim()) {
      const newDepartment: Department = {
        departmentName: newDept.departmentName,
        description: newDept.description,
      };
      dispatch({ type: ADD_DEPARTMENT, payload: newDepartment });
      setNewDept({ departmentName: '', description: '' });
      onChange(newDepartment.departmentName);
    }
  };

  const onSearchDepartmentHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    if (!searchTerm) {
      setDepartments(data);
    } else {
      const filteredDepartments = data.filter((dept) => dept.departmentName.toLowerCase().includes(searchTerm));
      setDepartments(filteredDepartments);
    }
  };

  useEffect(() => {
    dispatch({ type: FETCH_DEPARTMENTS, payload: { silent: true } });
  }, [dispatch]);

  return (
    <div className="flex items-end gap-2 w-full">
      {/* Department Select */}
      <Select onValueChange={onChange} value={value} required>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Department" />
        </SelectTrigger>
        <SelectContent>
          <input
            type="text"
            placeholder="Search departments..."
            className="w-full p-2 border border-gray-300 rounded-md"
            onChange={onSearchDepartmentHandle}
          />
          {departments.map((dept) => (
            <SelectItem key={dept._id} value={dept._id}>
              {dept.departmentName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog>
        <TooltipProvider>
          <Tooltip>
            <DialogTrigger asChild className="h-12">
              <TooltipTrigger asChild>
                <Button type="button" variant="outline">
                  +
                </Button>
              </TooltipTrigger>
            </DialogTrigger>
            <TooltipContent>
              <p>Add Department</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Enter department name"
                value={newDept.departmentName}
                onChange={(e) => setNewDept((prev) => ({ ...prev, departmentName: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Enter description"
                value={newDept.description}
                onChange={(e) =>
                  setNewDept((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleAddDepartment}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
