import { Injectable } from '@nestjs/common';
import { ScheduledJob } from './models/scheduled-job';
import { JobStorageService } from './storage/job-storage.service';
import { schedule as libSchedule, getTasks, ScheduledTask, ScheduleOptions } from "node-cron";

function schedule(job: ScheduledJob, func: (now: Date) => void, options?: ScheduleOptions) {
  return libSchedule(job.cron, function (now) {
    console.log(`Execution of ${job.name} started @ ${getTimeString()} `);
    try {
      // Patch console.log and redirect output to a file
      func(now);
      // Restore console.log
    } catch (error) {
      // set status as error
      console.log(`Error occured in ${job.name} @ ${getTimeString()} `);
    }
    // set status as executed
    console.log(`Execution of ${job.name} ended @ ${getTimeString()} `);
  }, options);

  function getTimeString() {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
  }
}
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
      const task = schedule(job, handler);
      // and store it
      job.id = (task as any).options.name;
      allJobs.push(new ScheduledJob(job));
      await this.storage.write(allJobs);
      if(job.enabled) {
        if (runImmidiately) {
          handler(new Date());
        }
      } else {
        task.stop();
      }
    } else {
      // If this job already exist in store
      // this will happen if the app service is restarted
      let task: ScheduledTask;
      const existingJob = allJobs[existingJobIndex];
      // if this job is enabled in store
      job.enabled = existingJob.enabled;
      if (existingJob.enabled) {
        // schedule this task --
        task = schedule(job, handler);
        if (runImmidiately) {
          handler(new Date());
        }
      } else {
        // else schedule the task and pause it immidiately
        // so it can be started via the api.
        task = schedule(job, handler);
        task.stop()
      }
      // update the task id in store, since on scheduling
      // the job, scheduler will assgn a new id
      job.id = (task as any).options.name;
      allJobs[existingJobIndex] = job;
      await this.storage.write(allJobs);
    }

    console.log(`Job enqued: ${job.name}`);
  }

  async allJobs() {
    console.log()
    return await this.storage.read();
  }

  async run(id: string) {
    const tasks = getTasks() as unknown as Map<string, ScheduledTask>;
    const task = tasks.get(id);
    (task as any)?._task?.execute(new Date());
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
