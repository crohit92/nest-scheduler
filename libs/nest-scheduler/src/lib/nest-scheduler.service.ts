import { Injectable } from '@nestjs/common';
import { ScheduledJob } from './models/scheduled-job';
import { JobStorageService } from './storage/job-storage.service';
import { schedule, getTasks, ScheduledTask } from "node-cron";
@Injectable()
export class JobSchedulerService {
  jobNames = new Set<string>();
  constructor(private readonly storage: JobStorageService) { }
  async enqueue(job: ScheduledJob, handler: (now: Date) => void, runImmidiately = false) {
    if (this.jobNames.has(job.name)) {
      throw `Job with name: '${job.name}' already exist.`;
    }
    this.jobNames.add(job.name);
    const allJobs = await this.storage.read();
    const existingJobIndex = allJobs.findIndex(j => j.name === job.name);
    // If this job does not exist in store
    if (existingJobIndex === -1) {
      // Schedule it
      const task = schedule(job.cron, handler);
      // and store it
      job.id = (task as any).options.name;
      allJobs.push(new ScheduledJob(job));
      await this.storage.write(allJobs);

    } else {
      // If this job already exist in store
      // this will happen if the app service is restarted
      let task: ScheduledTask;
      const existingJob = allJobs[existingJobIndex];
      // if this job is enabled in store
      job.enabled = existingJob.enabled;
      if (existingJob.enabled) {
        // schedule this task --
        task = schedule(job.cron, handler);
      } else {
        // else schedule the task and pause it immidiately
        // so it can be started via the api.
        task = schedule(job.cron, handler);
        task.stop()
      }
      // update the task id in store, since on scheduling
      // the job, scheduler will assgn a new id
      job.id = (task as any).options.name;
      allJobs[existingJobIndex] = job;
      await this.storage.write(allJobs);
    }
    if (runImmidiately) {
      handler(new Date());
    }
    console.log(`Job enqued: ${job.name}`);
  }

  async allJobs() {
    console.log()
    return await this.storage.read();
  }

  async disable(id: string) {
    // If this task id is scheduled, then stop it
    const tasks = getTasks() as unknown as Map<string, ScheduledTask>;
    const task = tasks.get(id)
    task?.stop();
    // and update the store with proper status
    const allJobs = await this.allJobs();
    const index = allJobs.findIndex(j => j.id === id);
    if (index >= 0) {
      allJobs[index].enabled = false;
    }
    await this.storage.write(allJobs);
  }

  async enable(id: string) {
    // If this task id is scheduled, then start it
    const tasks = getTasks() as unknown as Map<string, ScheduledTask>;
    const task = tasks.get(id)
    task?.start();
    // and update the store with proper status
    const allJobs = await this.allJobs();
    const index = allJobs.findIndex(j => j.id === id);
    if (index >= 0) {
      allJobs[index].enabled = true;
    }
    await this.storage.write(allJobs);
  }
}
