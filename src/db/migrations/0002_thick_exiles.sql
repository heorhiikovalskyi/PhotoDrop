ALTER TABLE "Clients" DROP CONSTRAINT "Clients_selfieId_Selfies_id_fk";
--> statement-breakpoint
ALTER TABLE "Clients" DROP COLUMN IF EXISTS "selfieId";