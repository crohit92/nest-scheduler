import { Injectable } from "@nestjs/common";
import { ScheduledJob } from "../models/scheduled-job";
import { join } from 'path'
import { existsSync, writeFileSync } from "fs";
import { readFile, writeFile } from "fs/promises";

@Injectable()
export class JobStorageService {
  filePath = join(__dirname, 'jobs.bin');
  async write(jobs: ScheduledJob[]) {
    await writeFile(this.filePath, JSON.stringify(jobs));
  }

  async read(): Promise<ScheduledJob[]> {
    return JSON.parse(await readFile(this.createIfNotExists(this.filePath), 'utf8') ?? '[]');
  }

  private createIfNotExists(path: string) {
    if (!existsSync(path)) {
      writeFileSync(path, '');
    }
    return path;
  }
}
