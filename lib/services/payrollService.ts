import { AppDataSource } from "@/lib/database/typeorm";
import { PayrollRecordEntity } from "@/lib/database/entities/payroll-record.entity";
import { PayrollRecord, PayrollStatus, AttendanceRecord, AttendanceStatus, AttendanceSubStatus } from "@/types";
import { getAllAttendanceRecords } from "@/lib/services/attendanceService";
import { formatDate, formatMonthYear } from "@/lib/utils";
import { CommonService } from "@/lib/services/commonService";

export async function getAllPayrollsService({ page = 1, limit = 20, sortBy = "payPeriod", sortOrder = "desc", filters = {} as Record<string, any> }) {
  const repo = AppDataSource.getRepository(PayrollRecordEntity);

  const qb = repo
    .createQueryBuilder("payroll")
    .leftJoinAndSelect("payroll.employee", "employee");

  if (filters.status) qb.andWhere("payroll.status = :status", { status: filters.status });
  if (filters.payPeriod) qb.andWhere("payroll.payPeriod = :payPeriod", { payPeriod: filters.payPeriod });
  if (filters.salaryMin) qb.andWhere("payroll.totalSalary >= :salaryMin", { salaryMin: filters.salaryMin });
  if (filters.salaryMax) qb.andWhere("payroll.totalSalary <= :salaryMax", { salaryMax: filters.salaryMax });
  if (filters.searchTerm) qb.andWhere("(payroll.notes ILIKE :searchTerm OR employee.name ILIKE :searchTerm OR employee.number ILIKE :searchTerm)", { searchTerm: `%${filters.searchTerm}%` });

  qb.orderBy(`payroll.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC");
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
}

export async function createPayrollService(data: PayrollRecord) {
  const repo = AppDataSource.getRepository(PayrollRecordEntity);
  const payroll = repo.create(data);
  await repo.save(payroll);
  return payroll;
}

export async function deletePayrollService(id: string): Promise<boolean> {
  const repo = AppDataSource.getRepository(PayrollRecordEntity);
  const record = await repo.findOne({ where: { id } });
  if (!record) throw new Error("Payroll record not found.");
  await repo.remove(record);
  return true;
}

export async function approvePayrollService(id: string) {
  const repo = AppDataSource.getRepository(PayrollRecordEntity);
  const record = await repo.findOne({ where: { id } });
  if (!record) throw new Error("Payroll record not found.");

  record.status = PayrollStatus.processed;
  return await repo.save(record);
}

export async function syncPayrollService(payPeriod: Date) {
  const formattedPayPeriod = formatMonthYear(payPeriod);
  // Step 1: get all attendance records
  const attendanceRecords = await getAllAttendanceRecords({
    page: 1, limit: 1000, sortBy: "date", sortOrder: "desc", filters: {
      dateFrom: new Date(payPeriod.getFullYear(), payPeriod.getMonth(), 1).toISOString(),
      dateTo: new Date(payPeriod.getFullYear(), payPeriod.getMonth() + 1, 0).toISOString(),
    }
  })

  // Step 2: group by employee
  const attendanceRecordsGroupByEmployee = attendanceRecords.data.reduce((acc, attendanceRecord) => {
    acc[attendanceRecord.employee?.id!] = acc[attendanceRecord.employee?.id!] || [];
    acc[attendanceRecord.employee?.id!].push(attendanceRecord);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);

  // Step 2: create payroll records
  await AppDataSource.transaction(async (manager) => {
    const payrollRepo = manager.getRepository(PayrollRecordEntity);
    const commonService = new CommonService();
    let currentNumber = await commonService.getEntityNumber(PayrollRecordEntity, "PAY");
    for (const employeeData of Object.entries(attendanceRecordsGroupByEmployee)) {
      const attendanceRecords = employeeData[1];
      const completedWork = attendanceRecords?.filter((attendanceRecord) => attendanceRecord.status === AttendanceStatus.completed && attendanceRecord.subStatus === AttendanceSubStatus.present);
      const workingShifts = completedWork?.length;
      const workingHours = completedWork?.reduce((acc, attendanceRecord) => acc + attendanceRecord.workHours!, 0);
      const baseSalary = completedWork?.reduce((acc, attendanceRecord) => acc + attendanceRecord.paidAmount!, 0);

      // get payroll for employee at payPeriod, if exist, update it, if not, create it
      let payroll = await payrollRepo.findOne({
        where: {
          employee: { id: employeeData[0] },
          payPeriod: formattedPayPeriod,
        }
      });

      if (payroll) {
        payrollRepo.merge(payroll, {
          baseSalary: baseSalary,
          totalSalary: baseSalary + (payroll.bonus || 0) - (payroll.deductions || 0),
          workingShifts: workingShifts,
          workingHours: workingHours,
          attendanceRecords: attendanceRecords,
          notes: `synced from attendance records at ${formatDate(new Date())}`,
        });
        await payrollRepo.save(payroll);
      } else {
        const newPayroll: PayrollRecord = {
          number: currentNumber,
          baseSalary: baseSalary,
          bonus: 0,
          deductions: 0,
          totalSalary: baseSalary,
          workingShifts: workingShifts,
          workingHours: workingHours,
          payPeriod: formattedPayPeriod,
          status: PayrollStatus.draft,
          paidAt: undefined,
          employee: attendanceRecords[0].employee,
          attendanceRecords: attendanceRecords,
          notes: `synced from attendance records at ${formatDate(new Date())}`,
        }
        currentNumber = await commonService.getEntityNumber(PayrollRecordEntity, "PAY", currentNumber);
        payroll = await payrollRepo.create(newPayroll);
        await payrollRepo.save(payroll);
      }
    }
  });

  return true;
}
