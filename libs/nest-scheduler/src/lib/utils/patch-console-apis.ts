
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuid } from "uuid";
import { getTimeString } from "./get-time";
(global as any).consoleStore = {
  ...console
}
export function patchConsoleApis() {
  console.log = console.error = console.warn = logToFile
}

function logToFile(...data: any[]) {
  const fileName = `${getTimeString()}-${uuid()}`;
}
