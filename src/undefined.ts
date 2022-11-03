import getData from "./file";
import { getConfig } from "./config";
import { Data, stringify, undefinedRun } from "./undefined-runner";

const config = getConfig();
const data = getData<Data>(config.file);
const undef = undefinedRun(data, config);

console.log(stringify(undef, config));
