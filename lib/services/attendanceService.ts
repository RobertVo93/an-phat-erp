import { AppDataSource } from "@/lib/database/typeorm";
import { AttendanceRecordEntity, PayrollRecordEntity } from "../database/entities";
import { AttendanceStatus, PayrollStatus } from "@/types";

export async function getAllAttendanceRecords() {
  const repo = AppDataSource.getRepository(AttendanceRecordEntity);
  const qb = repo
    .createQueryBuilder("attendance")
    .leftJoinAndSelect("attendance.employee", "employee");
  const [data] = await qb.getManyAndCount();
  return { data };
}

export async function addAttendanceRecord(data: Partial<AttendanceRecordEntity>) {
  const attendanceRepo = AppDataSource.getRepository(AttendanceRecordEntity);
  const payrollRepo = AppDataSource.getRepository(PayrollRecordEntity);

  // 1. create attendance
  const attendance = attendanceRepo.create(data);
  const savedAttendance = await attendanceRepo.save(attendance);

  // 2. create payroll
  const { employee, date, status } = savedAttendance;

  if (employee && date && status === AttendanceStatus.present) {
    const parsedDate = new Date(date);
    const payPeriod = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}`;

    let payroll = await payrollRepo.findOne({
      where: {
        employee: { id: employee.id },
        payPeriod,
      },
      relations: ["employee"],
    });

    if (!payroll) {
      payroll = payrollRepo.create({
        employee,
        payPeriod,
        bonus: 0,
        deductions: 0,
        totalSalary: 0,
        status: PayrollStatus.pending,
        workingShifts: 0,
      });
    }

    payroll.workingShifts += 1; // 1 attendance has 1 shift
    payroll.totalSalary = payroll.workingShifts * (employee.salary ?? 0);

    await payrollRepo.save(payroll);
  }

  return savedAttendance;
}

export async function updateAttendanceRecord(id: string, data: Partial<AttendanceRecordEntity>) {
  const attendanceRepo = AppDataSource.getRepository(AttendanceRecordEntity);
  const payrollRepo = AppDataSource.getRepository(PayrollRecordEntity);

  const existingAttendance = await attendanceRepo.findOne({
    where: { id },
    relations: { employee: true },
  });

  if (!existingAttendance) {
    throw new Error("Attendance record not found");
  }

  const prevEmployee = existingAttendance.employee;
  const prevStatus = existingAttendance.status;
  const prevDate = existingAttendance.date;
  const prevPayPeriod = prevDate?.toString().slice(0, 7); // YYYY-MM

  // update attendance
  await attendanceRepo.update(id, data);

  // get new attendance (to compare with the old one => update changes)
  const updatedAttendance = await attendanceRepo.findOne({
    where: { id },
    relations: { employee: true },
  });

  if (!updatedAttendance) {
    throw new Error("Updated attendance record not found");
  }

  const newEmployee = updatedAttendance.employee;
  const newStatus = updatedAttendance.status;
  const newDate = updatedAttendance.date;
  const newPayPeriod = newDate?.toString().slice(0, 7); // YYYY-MM

  const isOldValid = prevStatus === AttendanceStatus.present && prevEmployee && prevPayPeriod;
  const isNewValid = newStatus === AttendanceStatus.present && newEmployee && newPayPeriod;

  // decrease workshifts from old employee (case we change attendance employee)
  if (
    isOldValid &&
    (!isNewValid || prevEmployee.id !== newEmployee?.id || prevPayPeriod !== newPayPeriod)
  ) {
    const oldPayroll = await payrollRepo.findOne({
      where: {
        employee: { id: prevEmployee.id },
        payPeriod: prevPayPeriod,
      },
      relations: ["employee"],
    });

    if (oldPayroll) {
      oldPayroll.workingShifts = Math.max(0, oldPayroll.workingShifts - 1);

      if (oldPayroll.workingShifts === 0) {
        await payrollRepo.remove(oldPayroll);
      } else {
        oldPayroll.totalSalary = oldPayroll.workingShifts * (oldPayroll.employee?.salary ?? 0);
        await payrollRepo.save(oldPayroll);
      }
    }
  }

  // add workshifts from old employee (case we change attendance employee)
  if (isNewValid && (
    !isOldValid ||
    prevEmployee.id !== newEmployee.id ||
    prevPayPeriod !== newPayPeriod
  )) {
    let newPayroll = await payrollRepo.findOne({
      where: {
        employee: { id: newEmployee.id },
        payPeriod: newPayPeriod,
      },
      relations: ["employee"],
    });

    if (!newPayroll) {
      newPayroll = payrollRepo.create({
        employee: newEmployee,
        payPeriod: newPayPeriod,
        bonus: 0,
        deductions: 0,
        totalSalary: 0,
        status: PayrollStatus.pending,
        workingShifts: 0,
      });
    }

    newPayroll.workingShifts += 1;
    newPayroll.totalSalary = newPayroll.workingShifts * (newEmployee.salary ?? 0);
    await payrollRepo.save(newPayroll);
  }

  return updatedAttendance;
}

export async function deleteAttendanceRecord(id: string) {
  const attendanceRepo = AppDataSource.getRepository(AttendanceRecordEntity);
  const payrollRepo = AppDataSource.getRepository(PayrollRecordEntity);

  const attendance = await attendanceRepo.findOne({
    where: { id },
    relations: { employee: true },
  });

  if (!attendance) {
    throw new Error("Attendance record not found");
  }

  const { employee, status, date } = attendance;

  // update payroll
  if (employee && date && status === AttendanceStatus.present) {
    const payPeriod = new Date(date).toISOString().slice(0, 7); // YYYY-MM

    const payroll = await payrollRepo.findOne({
      where: {
        employee: { id: employee.id },
        payPeriod,
      },
      relations: ["employee"],
    });

    if (payroll) {
      payroll.workingShifts = Math.max(0, payroll.workingShifts - 1);
      payroll.totalSalary = payroll.workingShifts * (employee.salary ?? 0);

      if (payroll.workingShifts === 0 && payroll.status === PayrollStatus.pending) {
        await payrollRepo.remove(payroll);
      } else {
        await payrollRepo.save(payroll);
      }
    }
  }

  return attendanceRepo.delete(id);
}