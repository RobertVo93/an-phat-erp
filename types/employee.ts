export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  salary: string
  hireDate: string
  employeeType: "Full-time" | "Part-time" | "Contract" | "Intern"
  status: "Active" | "Inactive" | "On Leave"
  address?: string
  emergencyContact?: string
  notes?: string
}

export interface EmployeeFilters {
  status?: string
  employeeType?: string
  department?: string
  position?: string
  hireDateFrom?: string
  hireDateTo?: string
  salaryMin?: number
  salaryMax?: number
}

export interface EmployeeStats {
  totalEmployees: number
  activeEmployees: number
  departments: number
  onLeave: number
}
