import { AppDataSource } from "@/lib/database/typeorm";

export class CommonService {
  async getEntityNumber(entity: string, prefix: string) {
    const repo = AppDataSource.getRepository(entity);
    const latest = await repo
      .createQueryBuilder("record")
      .orderBy("CAST(SUBSTRING(record.number FROM 5) AS INTEGER)", "DESC")
      .getOne();

    const lastNumber = latest?.number
      ? parseInt(latest.number.replace(`${prefix}-`, ""), 10)
      : 0;

    return `${prefix}-${String(lastNumber + 1).padStart(5, "0")}`;
  }
}