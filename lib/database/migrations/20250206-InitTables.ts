import { MigrationInterface, QueryRunner } from "typeorm";

export class TempMigration1748850145790 implements MigrationInterface {
    name = 'TempMigration1748850145790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."customers_status_enum" AS ENUM('active', 'inactive', 'pending')`);
        await queryRunner.query(`CREATE TYPE "public"."customers_customertype_enum" AS ENUM('vip', 'premium', 'regular')`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "name" character varying NOT NULL, "email" character varying, "phone" character varying, "company" character varying, "location" character varying, "totalOrders" integer, "totalSpent" double precision, "lastOrder" TIMESTAMP, "status" "public"."customers_status_enum", "customerType" "public"."customers_customertype_enum", "joinDate" TIMESTAMP, "notes" character varying, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_paymentstatus_enum" AS ENUM('pending', 'paid', 'partial', 'failed', 'refunded')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_paymentmethod_enum" AS ENUM('creditCard', 'debitCard', 'bankTransfer', 'cash', 'paypal')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "date" TIMESTAMP, "amount" double precision, "status" "public"."orders_status_enum", "paymentStatus" "public"."orders_paymentstatus_enum", "paymentMethod" "public"."orders_paymentmethod_enum", "shippingAddress" character varying, "notes" character varying, "tags" text array, "customer_id" uuid, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer, "unitPrice" double precision, "total" double precision, "order_id" uuid, "product_id" uuid, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."products_status_enum" AS ENUM('active', 'inactive', 'lowStock', 'outOfStock')`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "name" character varying NOT NULL, "description" character varying, "price" double precision, "cost" double precision, "stock" integer, "minStock" integer, "sku" character varying, "barcode" character varying, "status" "public"."products_status_enum", "supplier" character varying, "image" character varying, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."collections_status_enum" AS ENUM('active', 'draft', 'archived')`);
        await queryRunner.query(`CREATE TYPE "public"."collections_category_enum" AS ENUM('fashion', 'electronics', 'home', 'office')`);
        await queryRunner.query(`CREATE TABLE "collections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "name" character varying NOT NULL, "description" character varying, "productCount" integer, "status" "public"."collections_status_enum", "totalValue" character varying, "category" "public"."collections_category_enum", "image" character varying, CONSTRAINT "PK_21c00b1ebbd41ba1354242c5c4e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."attendance_records_shift_enum" AS ENUM('morning', 'afternoon', 'evening')`);
        await queryRunner.query(`CREATE TYPE "public"."attendance_records_status_enum" AS ENUM('present', 'absent', 'late', 'halfDay', 'overtime')`);
        await queryRunner.query(`CREATE TABLE "attendance_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "date" character varying, "checkIn" TIMESTAMP, "checkOut" TIMESTAMP, "shift" "public"."attendance_records_shift_enum", "status" "public"."attendance_records_status_enum", "workHours" double precision, "overtimeHours" double precision, "dailyWage" double precision, "notes" character varying, "employee_id" uuid, CONSTRAINT "PK_946920332f5bc9efad3f3023b96" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."employees_employeetype_enum" AS ENUM('fullTime', 'partTime', 'contract', 'intern')`);
        await queryRunner.query(`CREATE TYPE "public"."employees_status_enum" AS ENUM('active', 'inactive', 'onLeave')`);
        await queryRunner.query(`CREATE TABLE "employees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "name" character varying NOT NULL, "email" character varying, "phone" character varying NOT NULL, "position" character varying, "department" character varying, "salary" double precision, "hireDate" TIMESTAMP, "employeeType" "public"."employees_employeetype_enum", "status" "public"."employees_status_enum", "address" character varying, "emergencyContact" character varying, "notes" character varying, CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."utility_readings_utilitytype_enum" AS ENUM('electricity', 'water', 'gas', 'internet', 'other')`);
        await queryRunner.query(`CREATE TABLE "utility_readings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "utilityType" "public"."utility_readings_utilitytype_enum" NOT NULL, "utilityName" character varying NOT NULL, "previousReading" double precision NOT NULL, "currentReading" double precision NOT NULL, "consumption" double precision NOT NULL, "unitPrice" double precision NOT NULL, "total" double precision NOT NULL, "invoiceId" uuid, CONSTRAINT "PK_f30790235a61b9a95c339786cc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."invoices_status_enum" AS ENUM('draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "invoices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "invoiceNumber" character varying, "billingPeriod" TIMESTAMP, "issueDate" TIMESTAMP, "dueDate" TIMESTAMP, "subtotal" double precision, "taxRate" double precision, "taxAmount" double precision, "otherFees" double precision, "otherFeesDescription" character varying, "total" double precision, "paidAmount" double precision, "status" "public"."invoices_status_enum", "notes" character varying, CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payroll_records_status_enum" AS ENUM('processed', 'pending', 'failed')`);
        await queryRunner.query(`CREATE TABLE "payroll_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "employeeId" character varying NOT NULL, "name" character varying NOT NULL, "department" character varying NOT NULL, "position" character varying NOT NULL, "baseSalary" double precision NOT NULL, "overtime" double precision NOT NULL, "bonus" double precision NOT NULL, "deductions" double precision NOT NULL, "netSalary" double precision NOT NULL, "status" "public"."payroll_records_status_enum" NOT NULL, "payPeriod" character varying NOT NULL, "workingDays" integer NOT NULL, "overtimeHours" double precision NOT NULL, "notes" character varying, "processedDate" character varying, CONSTRAINT "PK_869cabe268deb5726e742f2d3f0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."stock_out_status_enum" AS ENUM('draft', 'processing', 'shipped', 'delivered', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "stock_out" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "receiptNumber" character varying NOT NULL, "date" TIMESTAMP, "items" jsonb, "subtotal" double precision, "tax" double precision, "discount" double precision, "totalAmount" double precision, "status" "public"."stock_out_status_enum", "notes" character varying, "receivedBy" character varying, "receivedDate" TIMESTAMP, "referenceNumber" character varying, "warehouse_id" uuid, CONSTRAINT "PK_bf2a8a17864156c7bd6e0e26d3f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."warehouses_status_enum" AS ENUM('active', 'maintenance', 'inactive')`);
        await queryRunner.query(`CREATE TYPE "public"."warehouses_type_enum" AS ENUM('distributionCenter', 'regionalHub', 'coldStorage', 'backupStorage')`);
        await queryRunner.query(`CREATE TYPE "public"."warehouses_temperature_enum" AS ENUM('ambient', 'refrigerated', 'frozen')`);
        await queryRunner.query(`CREATE TABLE "warehouses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "name" character varying NOT NULL, "location" character varying, "address" character varying, "manager" character varying, "capacity" integer, "occupied" integer, "status" "public"."warehouses_status_enum", "type" "public"."warehouses_type_enum", "zones" integer, "temperature" "public"."warehouses_temperature_enum", "phone" character varying, "email" character varying, "description" character varying, CONSTRAINT "PK_56ae21ee2432b2270b48867e4be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."stock_in_status_enum" AS ENUM('draft', 'pending', 'in_transit', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "stock_in" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "receiptNumber" character varying NOT NULL, "date" TIMESTAMP, "items" jsonb, "subtotal" double precision, "tax" double precision, "discount" double precision, "totalAmount" double precision, "status" "public"."stock_in_status_enum", "notes" character varying, "receivedBy" character varying, "receivedDate" TIMESTAMP, "referenceNumber" character varying, "warehouse_id" uuid, CONSTRAINT "PK_e1ad529d86e5426c9e31c85b83e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."utilities_status_enum" AS ENUM('active', 'inactive', 'overdue', 'disconnected')`);
        await queryRunner.query(`CREATE TABLE "utilities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "type" character varying, "provider" character varying, "accountNumber" character varying, "location" character varying, "monthlyUsage" double precision, "unit" character varying, "costPerUnit" double precision, "monthlyCost" double precision, "lastReading" character varying, "status" "public"."utilities_status_enum", "dueDate" character varying, "description" character varying, CONSTRAINT "PK_34584344058bc75ba48ffb84d64" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "collection_products" ("collectionsId" uuid NOT NULL, "productsId" uuid NOT NULL, CONSTRAINT "PK_6fae6d061812e3fd7c54e1c27f1" PRIMARY KEY ("collectionsId", "productsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f4999cfd719d1879fbdfd0a79d" ON "collection_products" ("collectionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fce5928dc08b6c151bb6520d47" ON "collection_products" ("productsId") `);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendance_records" ADD CONSTRAINT "FK_f97d7be854091ef9ab5d75c0de3" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "utility_readings" ADD CONSTRAINT "FK_233513d12f5a1ebc72fc526023a" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_out" ADD CONSTRAINT "FK_41b80f2246e0a6b95cc8eb3c063" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_in" ADD CONSTRAINT "FK_9dab2276038224e8189efe8856d" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collection_products" ADD CONSTRAINT "FK_f4999cfd719d1879fbdfd0a79d8" FOREIGN KEY ("collectionsId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "collection_products" ADD CONSTRAINT "FK_fce5928dc08b6c151bb6520d476" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collection_products" DROP CONSTRAINT "FK_fce5928dc08b6c151bb6520d476"`);
        await queryRunner.query(`ALTER TABLE "collection_products" DROP CONSTRAINT "FK_f4999cfd719d1879fbdfd0a79d8"`);
        await queryRunner.query(`ALTER TABLE "stock_in" DROP CONSTRAINT "FK_9dab2276038224e8189efe8856d"`);
        await queryRunner.query(`ALTER TABLE "stock_out" DROP CONSTRAINT "FK_41b80f2246e0a6b95cc8eb3c063"`);
        await queryRunner.query(`ALTER TABLE "utility_readings" DROP CONSTRAINT "FK_233513d12f5a1ebc72fc526023a"`);
        await queryRunner.query(`ALTER TABLE "attendance_records" DROP CONSTRAINT "FK_f97d7be854091ef9ab5d75c0de3"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fce5928dc08b6c151bb6520d47"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f4999cfd719d1879fbdfd0a79d"`);
        await queryRunner.query(`DROP TABLE "collection_products"`);
        await queryRunner.query(`DROP TABLE "utilities"`);
        await queryRunner.query(`DROP TYPE "public"."utilities_status_enum"`);
        await queryRunner.query(`DROP TABLE "stock_in"`);
        await queryRunner.query(`DROP TYPE "public"."stock_in_status_enum"`);
        await queryRunner.query(`DROP TABLE "warehouses"`);
        await queryRunner.query(`DROP TYPE "public"."warehouses_temperature_enum"`);
        await queryRunner.query(`DROP TYPE "public"."warehouses_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."warehouses_status_enum"`);
        await queryRunner.query(`DROP TABLE "stock_out"`);
        await queryRunner.query(`DROP TYPE "public"."stock_out_status_enum"`);
        await queryRunner.query(`DROP TABLE "payroll_records"`);
        await queryRunner.query(`DROP TYPE "public"."payroll_records_status_enum"`);
        await queryRunner.query(`DROP TABLE "invoices"`);
        await queryRunner.query(`DROP TYPE "public"."invoices_status_enum"`);
        await queryRunner.query(`DROP TABLE "utility_readings"`);
        await queryRunner.query(`DROP TYPE "public"."utility_readings_utilitytype_enum"`);
        await queryRunner.query(`DROP TABLE "employees"`);
        await queryRunner.query(`DROP TYPE "public"."employees_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."employees_employeetype_enum"`);
        await queryRunner.query(`DROP TABLE "attendance_records"`);
        await queryRunner.query(`DROP TYPE "public"."attendance_records_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."attendance_records_shift_enum"`);
        await queryRunner.query(`DROP TABLE "collections"`);
        await queryRunner.query(`DROP TYPE "public"."collections_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."collections_status_enum"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TYPE "public"."products_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_paymentmethod_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_paymentstatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TYPE "public"."customers_customertype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."customers_status_enum"`);
    }

}
