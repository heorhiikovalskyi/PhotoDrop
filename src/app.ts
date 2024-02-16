import express from 'express';
import cors from 'cors';
import Controller from './controllers/Controller';
import ErrorHandler from './ErrorHandler';
import tryCatch from './tryCatch';
import ClientPaymentController from './controllers/Clients/Payment';
import ClientValidationService from './services/Clients/Validation';
import AlbumsPaymentService from './services/Clients/Payment';
import { AlbumsClientsRepository } from './repositories/AlbumsClients';
import { stripeClient } from './stripe';
import { db } from './db/db';
const errorHandler = new ErrorHandler();
const { server, validation, sql, json, limitRequests } = errorHandler;

class App {
  app: express.Application;
  private port: number;
  private controllers: Controller[];
  constructor(port: number, controllers: Controller[]) {
    this.app = express();
    this.port = port;
    this.controllers = controllers;
    this.initializeCors();
    this.initializePaymentController();
    this.initializeMiddlewares();
    this.initializeControllers();
    this.initializeErrorHandlers();
  }
  public start() {
    try {
      this.app.listen(this.port, () => {
        console.log(`http://localhost:${this.port}/`);
      });
    } catch (error) {
      console.log(error);
    }
  }
  private initializeControllers() {
    this.controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router);
    });
  }

  private initializeCors() {
    this.app.use(cors());
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
  }
  private initializeErrorHandlers() {
    this.app.use(sql);
    this.app.use(validation);
    this.app.use(json);
    this.app.use(limitRequests);
    this.app.use(server);
  }

  private initializePaymentController() {
    const clientValidation = new ClientValidationService();
    const albumsClientRepo = new AlbumsClientsRepository(db);
    const albumsPaymentService = new AlbumsPaymentService(stripeClient, albumsClientRepo);
    const clientPaymentController = new ClientPaymentController(clientValidation, albumsPaymentService);
    this.app.use(clientPaymentController.path, clientPaymentController.router);
  }
}

export default App;
