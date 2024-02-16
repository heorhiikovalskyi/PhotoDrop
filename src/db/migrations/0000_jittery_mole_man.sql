CREATE TABLE IF NOT EXISTS "Albums" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"date" date NOT NULL,
	"photographerId" integer NOT NULL,
	CONSTRAINT "Albums_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AlbumsClients" (
	"id" serial PRIMARY KEY NOT NULL,
	"albumId" integer NOT NULL,
	"clientId" integer NOT NULL,
	"paid" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" text NOT NULL,
	"selfieId" text,
	"name" text,
	"email" text,
	CONSTRAINT "Clients_number_unique" UNIQUE("number"),
	CONSTRAINT "Clients_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Images" (
	"id" text PRIMARY KEY NOT NULL,
	"albumId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ImagesClients" (
	"id" serial PRIMARY KEY NOT NULL,
	"imageId" text NOT NULL,
	"clientId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "photographers" (
	"id" serial PRIMARY KEY NOT NULL,
	"login" text NOT NULL,
	"password" text NOT NULL,
	"fullname" text,
	"email" text,
	CONSTRAINT "photographers_login_unique" UNIQUE("login"),
	CONSTRAINT "photographers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Selfies" (
	"id" text PRIMARY KEY NOT NULL,
	"clientId" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Albums" ADD CONSTRAINT "Albums_photographerId_photographers_id_fk" FOREIGN KEY ("photographerId") REFERENCES "photographers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AlbumsClients" ADD CONSTRAINT "AlbumsClients_albumId_Albums_id_fk" FOREIGN KEY ("albumId") REFERENCES "Albums"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AlbumsClients" ADD CONSTRAINT "AlbumsClients_clientId_Clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "Clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Clients" ADD CONSTRAINT "Clients_selfieId_Selfies_id_fk" FOREIGN KEY ("selfieId") REFERENCES "Selfies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Images" ADD CONSTRAINT "Images_albumId_Albums_id_fk" FOREIGN KEY ("albumId") REFERENCES "Albums"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ImagesClients" ADD CONSTRAINT "ImagesClients_imageId_Images_id_fk" FOREIGN KEY ("imageId") REFERENCES "Images"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ImagesClients" ADD CONSTRAINT "ImagesClients_clientId_Clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "Clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Selfies" ADD CONSTRAINT "Selfies_clientId_Clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "Clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
