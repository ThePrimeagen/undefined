import { getConfig } from "./config";
import getData from "./file";
import type { Data } from "./types";
import { stringify, undefinedRun } from "./undefined-runner";

const config = getConfig();
const data = getData<Data>(config.file);
const context = undefinedRun(data, config);

console.log(stringify(context));
