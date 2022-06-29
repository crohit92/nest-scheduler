import { Module } from '@nestjs/common';
import { JobSchedulerModule } from 'nest-job-scheduler';
import { AppSchedulersService } from './app-schedulers.service';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [JobSchedulerModule],
  controllers: [AppController],
  providers: [AppService, AppSchedulersService],
})
export class AppModule { }
