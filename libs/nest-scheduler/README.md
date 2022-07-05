# nest-scheduler

This library can be used to create scheduled jobs which run on a **NestJS API**. The underlying job scheduler
used in this project is [node-cron](https://www.npmjs.com/package/node-cron).

## Setup:

Setting up this library requires you to perform the following steps:
1. Install `node-cron` in your project using `npm i node-cron --save`
2. Import the module in your project.
   
  ```
    import { Module } from '@nestjs/common';
    import { JobSchedulerModule } from 'nest-job-scheduler';
    import { AppSchedulersService } from './app-schedulers.service';

    import { AppController } from './app.controller';
    import { AppService } from './app.service';

    @Module({
      imports: [JobSchedulerModule], // <----- Import the module here
      controllers: [AppController],
      providers: [AppService, AppSchedulersService],
    })
    export class AppModule { }

  ```
3. Import the scheduler service in one of your global service from where you will schedule jobs

  ```
    import { Injectable } from "@nestjs/common";
    import { JobSchedulerService } from "nest-job-scheduler";
    import { AppService } from "./app.service";

    @Injectable()
    export class AppSchedulersService {
      constructor(private scheduler: JobSchedulerService, // <----- Use DI to import the scheduler
        private readonly appService: AppService) {
        this.scheduler.enqueue({ // <----- Enqueue all the required jobs in the constructor
          name: 'Greeting', // <----- Name must be unique across all jobs to uniquely identify the job
          cron: '*/5 * * * * *', // <----- Schedule of the job
          enabled: true, // <------ Weather the job should be enabled by default
        },
          this.appService.getData.bind(this), // <----- Specify the function to be executed 
          true // <----- Should run once immidiately?
        );
      }
    }
  ```

## Access the scheduled jobs via API

When you start the target application which imports this package, a controller endpoint will get added 
to the application.

All the available endpoints in this controller can be found in [this](https://github.com/crohit92/nest-scheduler/blob/master/libs/nest-scheduler/src/JobScheduler.postman_collection.json) Postman collection
