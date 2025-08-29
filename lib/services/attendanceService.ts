import { AppDataSource } from "@/lib/database/typeorm";
import { AttendanceRecordEntity } from "@/lib/database/entities";
import { AttendanceRecord } from "@/types";

export async function getAllAttendanceRecords({ page = 1, limit = 20, sortBy = "date", sortOrder = "desc", filters = {} as Record<string, any> }) {
  const repo = AppDataSource.getRepository(AttendanceRecordEntity);
  const qb = repo
    .createQueryBuilder("attendance")
    .leftJoinAndSelect("attendance.employee", "employee");

  if (filters.status) qb.andWhere("attendance.status = :status", { status: filters.status });
  if (filters.dateFrom) qb.andWhere("attendance.date >= :dateFrom", { dateFrom: filters.dateFrom });
  if (filters.dateTo) qb.andWhere("attendance.date <= :dateTo", { dateTo: filters.dateTo });
  if (filters.searchTerm) qb.andWhere("attendance.notes ILIKE :searchTerm OR attendance.number ILIKE :searchTerm OR employee.name ILIKE :searchTerm OR employee.number ILIKE :searchTerm", { searchTerm: `%${filters.searchTerm}%` });
  if (filters.shift) qb.andWhere("attendance.shift = :shift", { shift: filters.shift });
  if (filters.employeeId) qb.andWhere("employee.id = :employeeId", { employeeId: filters.employeeId });

  qb.orderBy(`attendance.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC");
  qb.skip((page - 1) * limit);
  qb.take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
}

export async function addAttendanceRecord(data: Partial<AttendanceRecordEntity>): Promise<AttendanceRecord> {
  const attendanceRepo = AppDataSource.getRepository(AttendanceRecordEntity);
  const attendance = attendanceRepo.create(data);
  const savedAttendance = await attendanceRepo.save(attendance);

  return savedAttendance;
}

export async function updateAttendanceRecord(id: string, data: Partial<AttendanceRecordEntity>): Promise<AttendanceRecord> {
  const attendanceRepo = AppDataSource.getRepository(AttendanceRecordEntity);

  const existingAttendance = await attendanceRepo.findOne({
    where: { id }
  });
  if (!existingAttendance) {
    throw new Error("Attendance record not found");
  }

  attendanceRepo.merge(existingAttendance, data);
  return attendanceRepo.save(existingAttendance);
}

export async function deleteAttendanceRecord(id: string) {
  const attendanceRepo = AppDataSource.getRepository(AttendanceRecordEntity);

  const attendance = await attendanceRepo.findOne({
    where: { id },
  });

  if (!attendance) {
    throw new Error("Attendance record not found");
  }

  await attendanceRepo.remove(attendance);
  return true;
}