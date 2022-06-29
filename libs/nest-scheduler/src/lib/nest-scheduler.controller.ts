import { Body, Controller, Get, Post } from '@nestjs/common';
import { ScheduledJob } from './models/scheduled-job';
import { SchedulerService } from './nest-scheduler.service';

@Controller('scheduled-jobs')
export class JobSchedulerController {
  constructor(private readonly scheduler: SchedulerService) { }

  @Get()
  async getAllJobs() {
    return await this.scheduler.allJobs();
  }

  @Post()
  async createJob(@Body() job: ScheduledJob) {
    return await this.scheduler.enqueue(new ScheduledJob(job));
  }
}
