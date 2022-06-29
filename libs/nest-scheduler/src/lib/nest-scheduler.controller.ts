import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ScheduledJob } from './models/scheduled-job';
import { JobSchedulerService } from './nest-scheduler.service';

@Controller('scheduled-jobs')
export class JobSchedulerController {
  constructor(private readonly scheduler: JobSchedulerService) { }

  @Get()
  async getAllJobs() {
    return await this.scheduler.allJobs();
  }

  /**
   * @depricated This method should not be used to create jobs
   * since for a job
   * @param job
   * @returns
   */
  @Post()
  async createJob(@Body() job: ScheduledJob) {
    return await this.scheduler.enqueue(job, () => { });
  }

  @Put('disable/:id')
  async disableJob(@Param('id') id: string) {
    await this.scheduler.disable(id);
  }
  @Put('enable/:id')
  async enableJob(@Param('id') id: string) {
    await this.scheduler.enable(id);
  }
}
