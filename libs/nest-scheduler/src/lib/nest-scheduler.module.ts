import { Module } from '@nestjs/common';
import { JobSchedulerController } from './nest-scheduler.controller';
import { SchedulerService } from './nest-scheduler.service';
import { JobStorageService } from './storage/job-storage.service';

@Module({
  imports: [],
  controllers: [JobSchedulerController],
  providers: [SchedulerService, JobStorageService],
})
export class JobSchedulerModule { }
