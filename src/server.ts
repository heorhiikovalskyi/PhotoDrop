import 'dotenv/config';
import App from './app';
import { db } from './db/db';
import PhotographersController from './controllers/Photographers/CRUD';
import { PhotographersRepository } from './repositories/Photographers';
import PhotographersService from './services/Photographers/CRUD';
import PhotographersAuthenticationController from './controllers/Photographers/Authentication';
import PhotographersAuthenticationService from './services/Photographers/Authentication';
import PhotographerUploadController from './controllers/Photographers/UploadPhotos';
import PhotographerUploadService from './services/Photographers/UploadPhotos';
import { AlbumsRepository } from './repositories/Albums';
import PhotographerValidationService from './services/Photographers/Validation';
import S3 from './services/s3';
import { s3Client } from './s3Client';
import { migrateDb } from './db/migrate';
import AdminValidationService from './services/Admin/Validation';
import AdminAuthenticationController from './controllers/Admin/Authentication';
import AdminAuthenticationService from './services/Admin/Authentication';
import ClientAuthenticationService from './services/Clients/Authentication';
import ClientValidationService from './services/Clients/Validation';
import ClientDowndloadService from './services/Clients/Download/Download';
import ClientDownloadController from './controllers/Clients/GetPhotos';
import ClientsAuthController from './controllers/Clients/Authentication';
import ClientsController from './controllers/Clients/CRUD';
import ClientUploadController from './controllers/Clients/UploadPhotos';
import AttachClientsService from './services/Photographers/AttachClients';
import AttachClientsController from './controllers/Photographers/AttachClients';
import Telegram from './services/Telegram';
import { ClientsRepository } from './repositories/Clients';
import { Storage } from './services/Telegram/Storage';
import ImagesRepository from './repositories/Images';
import ImagesClientsRepository from './repositories/ImagesClients';
import { AlbumsClientsRepository } from './repositories/AlbumsClients';
import EditProfileController from './controllers/Clients/EditProfile';
import EditProfileService from './services/Clients/EditProfile';

const { PORT } = process.env;

const main = async () => {
  await migrateDb();

  const albumsRepository = new AlbumsRepository(db);
  const photographersRepo = new PhotographersRepository(db);
  const photographersService = new PhotographersService(photographersRepo, albumsRepository);
  const adminValidation = new AdminValidationService();
  const photographerValidation = new PhotographerValidationService();
  const photographersController = new PhotographersController(
    photographersService,
    adminValidation,
    photographerValidation
  );

  const photographersAuthenticationService = new PhotographersAuthenticationService(photographersRepo);
  const photographersAuthenticationController = new PhotographersAuthenticationController(
    photographersAuthenticationService
  );

  const photographerUploadService = new PhotographerUploadService(albumsRepository, s3Client);
  const photographerValidationService = new PhotographerValidationService();
  const s3Service = new S3(s3Client);
  const photographerUploadController = new PhotographerUploadController(
    photographerUploadService,
    photographerValidationService,
    s3Service
  );

  const adminAuthService = new AdminAuthenticationService();
  const adminAuthController = new AdminAuthenticationController(adminAuthService);

  const codesLifeTime = 5;
  const codeValidTime = 3;

  const storage = new Storage(codesLifeTime, codeValidTime);
  const telegramService = new Telegram(storage);

  const clientsRepo = new ClientsRepository(db);

  const clientAuthService = new ClientAuthenticationService(telegramService, clientsRepo);

  const imagesRepo = new ImagesRepository(db);

  const clientDownloadService = new ClientDowndloadService(albumsRepository, imagesRepo, s3Service, clientsRepo);

  const clientValidationService = new ClientValidationService();

  const clientDownloadController = new ClientDownloadController(clientValidationService, clientDownloadService);

  const clientsUploadController = new ClientUploadController(clientValidationService, s3Service);

  const attachClientsService = new AttachClientsService(
    clientsRepo,
    new ImagesClientsRepository(db),
    new AlbumsClientsRepository(db)
  );

  const clientsController = new ClientsController(clientsRepo, clientDownloadService);

  const clientsAuthController = new ClientsAuthController(clientAuthService);

  const attachClientsController = new AttachClientsController(attachClientsService, photographerValidation);

  const editProfileController = new EditProfileController(clientValidationService, new EditProfileService(clientsRepo));

  const controllers = [
    clientsController,
    editProfileController,
    photographersAuthenticationController,
    photographersController,
    photographerUploadController,
    adminAuthController,
    clientDownloadController,
    clientsUploadController,
    clientsAuthController,
    attachClientsController,
  ];
  const app = new App(Number(PORT), controllers);

  app.start();
};
main();
