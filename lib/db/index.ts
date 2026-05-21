export { db, prisma } from "./prisma";
export { checkDatabaseConnection } from "./health";
export { runInTransaction } from "./transaction";

export type {
  Prisma,
  User,
  Business,
  Category,
  Review,
  Complaint,
  BusinessClaim,
  BusinessVerification,
  ReviewVote,
  SavedBusiness,
  BusinessResponse,
  AuditLog,
} from "@prisma/client";
