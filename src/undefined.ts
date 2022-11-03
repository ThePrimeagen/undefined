import getData from "./file";
import { getConfig } from "./config";
import { stringify, undefinedRun } from "./undefined-runner";
import { Data } from "./types";

const config = getConfig();
const data = getData<Data>(config.file);
const context = undefinedRun(data, config);

console.log(stringify(context));
