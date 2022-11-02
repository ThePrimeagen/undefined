// TODO: This is a REALLY SHITTY version of what could be.  I am literally just
// flow stating what could be so i can get this done asap.
//
// Please forgive me.  Its not meant to be either performant nor the absolute
// most correct, just correct enough
import { Config } from "./config";
import isEqual from "lodash.isequal";
import { NamedTypeProperty, Type, TypeValue, Union } from "./types";

export type UnionizeableProperty = {
    propKey: string;
    propValue: TypeValue[];
    count: number;
};

export type KeyCounts = {
    [key: string]: {
        propKey: string;
        propValue: TypeValue[];
        count: number;
    }[]
}

export type UnionDupes = {
    [key: string]: number;
}

type TypedData = Map<string, Type>;

export function keyDupeCount(data: TypedData): KeyCounts {
    const out: KeyCounts = {};

    for (const [_, d] of data.entries()) {
        for (const [k, v] of Object.entries(d.properties)) {
            if (!out[k]) {
                out[k] = [];
            }

            const typeSet = out[k];
            let added = false;
            for (let i = 0; !added && i < typeSet.length; ++i) {
                if (isEqual(typeSet[i].propValue, v)) {
                    added = true;
                    typeSet[i].count++;
                }
            }

            if (!added) {
                typeSet.push({
                    propKey: k,
                    propValue: v,
                    count: 1,
                });
            }
        }
    }

    return out;
}

export function getUnionizableProperties(keyCounts: KeyCounts, config: Config): UnionizeableProperty[] {
    const required = config.unionCount;
    const out: UnionizeableProperty[] = [];

    for (const v of Object.values(keyCounts)) {
        for (let i = 0; i < v.length; ++i) {
            if (v[i].count >= required) {
                out.push({
                    propKey: v[i].propKey,
                    propValue: v[i].propValue,
                    count: v[i].count,
                });
            }
        }
    }

    return out;
}

// an interesting idea if we wish to optimize.
//
// we would have to do several passes and cut out branches REAL fast for this
// to work
/*
type _TreeNode = {
    union: UnionizeableProperty,
    remainingPossibles: UnionizeableProperty[],
    nodes: string[],
    children: _TreeNode[],
}
*/

function toStringValue(propValue: TypeValue[]) {
    const copy = propValue.slice(0);
    const strValues = copy.filter(x => !Array.isArray(x)).sort();

    const arrValues = copy.filter(x => Array.isArray(x));
    const additional: string = arrValues.length > 0 ? toStringValue(arrValues) : "";

    return strValues.join("") + additional;
}

function toString(propKey: string, propValue: TypeValue[]): string {
    return propKey + toStringValue(propValue);
}

function unionDupeCount(data: TypedData): UnionDupes {
    const dupes: UnionDupes = {};
    for (const v of data.values()) {
        v.unions.forEach(u => {
            if (!dupes[u]) {
                dupes[u] = 0;
            }
            dupes[u]++;
        });
    }
    return dupes;
}

function getTypesByUnionName(data: TypedData, name: string): Type[] {
    const out = [];
    for (const v of data.values()) {
        if (v.unions.includes(name)) {
            out.push(v);
        }
    }
    return out;
}

function combinedUnionName(n1: string, n2: string): string {
    if (n1.endsWith("Union")) {
        n1 = n1.substring(0, n1.length - 5);
    }

    if (n2.endsWith("Union")) {
        n2 = n2.substring(0, n2.length - 5);
    }

    return `${n1}${n2}Union`;
}

// TODO: This is a REALLY SHITTY version of what could be
function attemptCombine(data: TypedData, unions: Union, ignore: string[] = []): [boolean, string[]] {
    const dupes = unionDupeCount(data);
    const highest2: {key: string, count: number}[] = [];

    for (const [key, count] of Object.entries(dupes)) {
        if (ignore.includes(key)) {
            continue;
        }

        if (highest2.length < 2) {
            highest2.push({key, count});
        } else {
            // TODO: I am positive i can do this better
            let idx = highest2[0].count < highest2[1].count ?
                0 : 1;

            if (highest2[idx].count < count) {
                highest2[idx] = {key, count};
            }
        }
    }

    if (highest2.length !== 2) {
        return [false, []];
    }

    const [
        type0Name,
        type1Name,
    ] = highest2.map(x => x.key);

    const [
        type0,
        type1,
    ] = highest2.map(x => getTypesByUnionName(data, x.key));

    const type0Map = new Map<Type, boolean>(type0.map(x => [x, true]));
    const type1Map = new Map<Type, boolean>(type1.map(x => [x, true]));

    const common = []
    for (const t of type0Map.keys()) {
        if (type1Map.has(t)) {
            common.push(t);
        }
    }

    if (common.length > 0) {
        const newName = combinedUnionName(type0Name, type1Name);
        for (let i = 0; i < common.length; ++i) {
            common[i].unions.splice(common[i].unions.indexOf(type0Name));
            common[i].unions.splice(common[i].unions.indexOf(type1Name));
            common[i].unions.push(newName);
        }

        unions.set(newName, {
            name: newName,
            combinedUnion: [type0Name, type1Name],
        });
    }

    return [common.length > 0, [type0Name, type1Name]];
}

export function unionize(data: TypedData, config: Config): Union {
    const keyCount = keyDupeCount(data);
    const unionProps = getUnionizableProperties(keyCount, config);
    const unions = new Map<string, NamedTypeProperty>();

    // Two passes
    // 1st pass puts every possible single union together.
    // 2nd pass tries to condense
    for (let i = 0; i < unionProps.length; ++i) {
        const {
            propKey,
            propValue,
        } = unionProps[i];

        for (const type of data.values()) {
            if (propKey in type.properties && isEqual(type.properties[propKey], propValue)) {
                delete type.properties[propKey];

                const key = toString(propKey, propValue);
                if (!unions.has(key)) {
                    unions.set(key, {
                        name: propKey,
                        properties: {[propKey]: propValue},
                    });
                }

                type.unions.push(key);
            }
        }
    }

    let missCount = 0;
    let seen: string[] = [];
    do {
        const [found, newKeys] = attemptCombine(data, unions, seen);

        if (!found) {
            seen = seen.concat(newKeys);
            missCount++;
        }

    } while (missCount < 3);

    return unions;
}

