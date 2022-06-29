import { Module } from '@nestjs/common';
import { JobSchedulerModule } from 'nest-job-scheduler';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [JobSchedulerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
