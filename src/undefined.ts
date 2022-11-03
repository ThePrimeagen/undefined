import getData from "./file";
import { getConfig } from "./config";
import { stringifyEnum } from "./enum";
import { typeToString } from "./types";
import { Data, undefinedRun } from "./undefined-runner";

const config = getConfig();
const data = getData<Data>(config.file);

const {
    typeSet,
    unions,
    enums,
} = undefinedRun(data, config);

for (const enumData of enums) {
    console.log(stringifyEnum(enumData[0], enumData[1]));
}

console.log(typeToString(typeSet, unions, config));

