import { v4 as uuid } from "uuid";

export class ScheduledJob {
  constructor(job: ScheduledJob) {
    if (!job.id) {
      job.id = uuid();
    }
    this.id = job.id;
    this.cron = job.cron;
    this.name = job.name;
    this.enabled = true;
  }
  id?: string
  name: string;
  cron: string;
  enabled: boolean;
}
