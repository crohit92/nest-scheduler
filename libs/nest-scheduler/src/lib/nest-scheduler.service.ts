import { Injectable } from '@nestjs/common';
import { ScheduledJob } from './models/scheduled-job';
import { JobStorageService } from './storage/job-storage.service';
import { schedule, getTasks } from "node-cron";
@Injectable()
export class JobSchedulerService {
  constructor(private readonly storage: JobStorageService) { }
  async enqueue(job: ScheduledJob, handler: (now: Date) => void, runImmidiately = false) {
    const allJobs = await this.storage.read();
    if (allJobs.findIndex(j => j.name === job.name) === -1) {
      const task = schedule(job.cron, handler);
      console.log((task as any).options.name);
      job.id = (task as any).options.name;
      allJobs.push(new ScheduledJob(job));
      await this.storage.write(allJobs);
      if (runImmidiately) {
        handler(new Date());
      }
    }
    console.log(`Job enqued: ${job.name}`);
  }

  async allJobs() {
    console.log()
    return await this.storage.read();
  }

  async disable(id: string) {
    const tasks = getTasks();
    const task = tasks.find(t => (t as any).options.name === id);
    console.log(task);
    task?.stop();
  }
}
