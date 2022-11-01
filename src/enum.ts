import getData from "./file";

const file = process.argv[2];
const key = process.argv[3];
const data = getData<{[key: string]: string}>(file);

const found: {[key: string]: boolean} = {};
data.forEach(x => {
    if (key in x) {
        found[x[key]] = true;
    }
});

const nameKey = key.substring(0, 1).toUpperCase() + key.substring(1);
console.log(`enum ${nameKey} {`);
Object.keys(found).forEach(k => {
    console.log(`    ${k} = "${k}",`);
});
console.log(`}`);
