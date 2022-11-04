import { getConfig } from "./config";
import getData from "./file";
import { stringify, undefinedRun } from "./undefined-runner";
const config = getConfig();
const data = getData(config.file);
const context = undefinedRun(data, config);
console.log(stringify(context));
