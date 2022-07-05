import { schedule as libSchedule, ScheduleOptions } from "node-cron";
import { ScheduledJob } from "../models/scheduled-job";
import { getTimeString } from "./get-time";

export function schedule(job: ScheduledJob, func: (now: Date) => void, options?: ScheduleOptions) {
  return libSchedule(job.cron, function (now) {
    console.log(`Execution of ${job.name} started @ ${getTimeString()} `);
    try {
      // Patch console.log and redirect output to a file
      func(now);
      // Restore console.log
    } catch (error) {
      // set status as error
      console.log(`Error occured in ${job.name} @ ${getTimeString()} `);
      console.error(error);
    }
    // set status as executed
    console.log(`Execution of ${job.name} ended @ ${getTimeString()} `);
  }, options);

}
