import { Module } from '@nestjs/common';
import { JobSchedulerController } from './nest-scheduler.controller';
import { JobSchedulerService } from './nest-scheduler.service';
import { JobStorageService } from './storage/job-storage.service';

@Module({
  imports: [],
  controllers: [JobSchedulerController],
  providers: [JobSchedulerService, JobStorageService],
  exports: [JobSchedulerService]
})
export class JobSchedulerModule { }
