
// TODO: There is this whole recursive definition issue that i suck at
// typescript trying to make.  I could literally make this in rust in no
// time....... i hate my choices some times.

export type TypeValue = string | string[];
export type TypeProperties = {
    [key: string]: TypeValue[],
}
export type Type = {
    unions: string[],
    properties: TypeProperties,
}

//export function typeToString(type: Type): string {
//}
