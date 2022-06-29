import { Injectable } from '@nestjs/common';
import { ScheduledJob } from './models/scheduled-job';
import { JobStorageService } from './storage/job-storage.service';

@Injectable()
export class SchedulerService {
  constructor(private readonly storage: JobStorageService) { }
  async enqueue(job: ScheduledJob) {
    const existingJobs = this.storage.read();
    this.storage.write([job]);
  }

  async allJobs() {
    return await this.storage.read();
  }
}
