import { AppDataSource } from "@/lib/database/typeorm";
import { AttendanceRecordEntity } from "../database/entities";

export async function getAllAttendanceRecords() {
  const repo = AppDataSource.getRepository(AttendanceRecordEntity);
  const qb = repo
    .createQueryBuilder("attendance")
    .leftJoinAndSelect("attendance.employee", "employee");
  const [data] = await qb.getManyAndCount();
  return { data };
}

export async function addAttendanceRecord(data: Partial<AttendanceRecordEntity>) {
  const repo = AppDataSource.getRepository(AttendanceRecordEntity);
  const attendance = repo.create(data);
  return repo.save(attendance);
}

export async function updateAttendanceRecord(id: string, data: Partial<AttendanceRecordEntity>) {
  const repo = AppDataSource.getRepository(AttendanceRecordEntity);
  await repo.update(id, data);
  return repo.findOne({
    where: { id },
    relations: { employee: true },
  });
}

export async function deleteAttendanceRecord(id: string) {
  const repo = AppDataSource.getRepository(AttendanceRecordEntity);
  return repo.delete(id);
} 