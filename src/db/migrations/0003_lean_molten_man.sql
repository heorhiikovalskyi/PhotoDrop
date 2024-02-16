ALTER TABLE "Clients" ADD COLUMN "selfieId" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Clients" ADD CONSTRAINT "Clients_selfieId_Selfies_id_fk" FOREIGN KEY ("selfieId") REFERENCES "Selfies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
