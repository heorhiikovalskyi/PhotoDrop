ALTER TABLE "Images" ALTER COLUMN "albumId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "AlbumsClients" ADD CONSTRAINT "AlbumsClients_albumId_clientId_unique" UNIQUE("albumId","clientId");