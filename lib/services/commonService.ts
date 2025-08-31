import { AppDataSource } from "@/lib/database/typeorm";

export class CommonService {
  async getEntityNumber(entity: string, prefix: string, currentNumber?: string) {
    let lastNumber = 0;
    if (currentNumber) {
      lastNumber = currentNumber
        ? parseInt(currentNumber.replace(`${prefix}-`, ""), 10)
        : 0;
    }
    else {
      const repo = AppDataSource.getRepository(entity);
      const latest = await repo
        .createQueryBuilder("record")
        .orderBy("CAST(SUBSTRING(record.number FROM 5) AS INTEGER)", "DESC")
        .getOne();

      lastNumber = latest?.number
        ? parseInt(latest.number.replace(`${prefix}-`, ""), 10)
        : 0;

    }
    return `${prefix}-${String(lastNumber + 1).padStart(5, "0")}`;
  }
}