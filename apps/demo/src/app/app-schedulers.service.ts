import { Injectable } from "@nestjs/common";
import { JobSchedulerService } from "nest-job-scheduler";
import { AppService } from "./app.service";

@Injectable()
export class AppSchedulersService {
  constructor(private scheduler: JobSchedulerService,
    private readonly appService: AppService) {
    this.scheduler.enqueue({
      name: 'Greeting',
      cron: '* * * * *',
      enabled: true,
    },
      this.appService.getData.bind(this),
      true
    );
    // this.scheduler.enqueue({
    //   name: 'Greeting',
    //   cron: '* * * * *',
    //   enabled: true,
    // },
    //   this.appService.getData.bind(this),
    //   true
    // )
  }

}
