import { AppDataSource } from "@/lib/database/typeorm";
import { PayrollRecordEntity } from "../database/entities";
import { PayrollStatus } from "@/types";

export async function getAllPayrolls() {
  const repo = AppDataSource.getRepository(PayrollRecordEntity);

  const qb = repo
    .createQueryBuilder("payroll")
    .leftJoinAndSelect("payroll.employee", "employee");

  const [data] = await qb.getManyAndCount();

  return { data };
}


export async function processOnePayroll(id: string) {
  const repo = AppDataSource.getRepository(PayrollRecordEntity);

  await repo.update(id, { status: PayrollStatus.processed });

  const updated = await repo.findOne({
    where: { id },
    relations: ["employee"],
  });

  if (!updated) {
    throw new Error("Payroll record not found after update");
  }

  return updated;
}

export async function processAllPayrolls() {
  const repo = AppDataSource.getRepository(PayrollRecordEntity);

  await repo
    .createQueryBuilder()
    .update(PayrollRecordEntity)
    .set({ status: PayrollStatus.processed })
    .execute();

  const updated = await repo.find({
    relations: ["employee"],
  });

  return updated;
}