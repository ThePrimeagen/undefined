import type { Context, Type, TypeSet, TypeValue } from "./types";
import { contains, getKeyName } from "./utils";

function getAllIntersections(data: TypeSet, collapses: string[][]): Type[][] {
	const matchSet: Type[][] = new Array();
	for (const collapse of collapses) {
		const matches = [];
		for (const type of data.values()) {
			const { match } = contains(type, collapse);

			if (match) {
				matches.push(type);
			}
		}

		matchSet.push(matches);
	}

	return matchSet;
}

function createTypeValue(types: Type[], property: string): TypeValue[] {
	const typeValues: TypeValue[] = new Array();
	for (const t of types) {
		const prop = t.properties[property] as TypeValue[];
		if (!prop) {
			continue;
		}

		for (const propType of prop) {
			// worried a bit about [string] and [string]
			// TODO: likely requires a bit more complex handling here
			if (!typeValues.includes(propType)) {
				typeValues.push(propType);
			}
		}
	}

	return typeValues;
}

function findAndReplaceDeep(
	value: TypeValue[],
	toReplace: string[],
	replaceWith: string
): void {
	value.forEach((v, i) => {
		if (Array.isArray(v)) {
			findAndReplaceDeep(v, toReplace, replaceWith);
		} else {
			if (toReplace.includes(v)) {
				value[i] = replaceWith;
			}
		}
	});
}

function replaceTypesWithType(
	data: TypeSet,
	toReplace: Type[],
	replacer: Type
): void {
	const toDelete: string[] = new Array();
	const toReplaceNames = toReplace.map((t) => t.displayName);
	const replaceWith = replacer.displayName;

	for (const [k, t] of data.entries()) {
		if (t === replacer) {
			continue;
		}

		if (toReplace.some((x) => x === t)) {
			toDelete.push(k);
		}

		// check to replace any references amoung the TypeValues
		for (const p of Object.values(t.properties)) {
			findAndReplaceDeep(p, toReplaceNames, replaceWith);
		}
	}

	toDelete.forEach((d) => {
		data.delete(d);
	});
}

/**
 * this is probably a very slow function. wild amounts of allocations here.
 **/
function buildTypeFromTypes(types: Type[], context: Context): Type {
	const common = new Set<string>();
	types.forEach((t) => {
		Object.keys(t.properties).forEach((k) => common.add(k));
	});

	const different = new Set<string>();
	types.forEach((t) => {
		const commonKeys = [...common.keys()];
		for (const k of commonKeys) {
			if (!(k in t.properties)) {
				common.delete(k);
				different.add(k);
			}
		}
	});

	const type: Type = {
		displayName: "",
		unions: [],
		properties: {},
	};

	for (const c of common.values()) {
		type.properties[c] = createTypeValue(types, c);
	}

	for (const d of different.values()) {
		const typeValues = createTypeValue(types, d);
		if (!typeValues.includes("undefined")) {
			typeValues.push("undefined");
		}

		type.properties[d] = typeValues;
	}

	type.displayName = context.namer.getName(getKeyName(type.properties), type);
	return type;
}

export function collapse(context: Context): void {
	const data = context.typeSet;

	// simple algo
	// 1. find all matches per collapse
	// 2. find all references to every collapse and make it into 1.
	// 3. make a new type and delete the old ones.

	const intersections = getAllIntersections(data, context.config.collapse);

	for (const types of intersections) {
		const combinedType = buildTypeFromTypes(types, context);
		const keyName = getKeyName(combinedType.properties);

		replaceTypesWithType(data, types, combinedType);

		data.set(keyName, combinedType);
	}
}
