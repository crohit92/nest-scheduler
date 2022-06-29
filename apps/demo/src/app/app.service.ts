import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  getData(now: Date): { message: string } {
    const result = { message: 'Welcome to demo!' };
    console.log(now.toTimeString(), result);
    return result;
  }
}
