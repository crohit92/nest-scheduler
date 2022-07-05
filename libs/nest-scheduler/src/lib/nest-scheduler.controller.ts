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

  // @Post()
  // async createJob(@Body() job: ScheduledJob) {
  //   return await this.scheduler.enqueue(job, () => { });
  // }

  @Put(':id/run')
  async run(@Param('id') id: string) {
    await this.scheduler.run(id);
  }

  @Put(':id/disable')
  async disableJob(@Param('id') id: string) {
    await this.scheduler.disable(id);
  }

  @Put(':id/enable')
  async enableJob(@Param('id') id: string) {
    await this.scheduler.enable(id);
  }
}
