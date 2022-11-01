
const foo = {
    bar: 22,
    buzz: 69,
};

const bar = {
    bar: "this is a string",
    buzz: 69,
};

const other = {
    lithium: "is my bit daddy",
};

const other2 = {
    lithium: "is my bit daddy",
    foo,
};

console.log(JSON.stringify(foo));
console.log(JSON.stringify(bar));
console.log(JSON.stringify(other));
console.log(JSON.stringify(other2));

