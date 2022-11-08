import { Context } from "./types";
import { contains } from "./utils";

function sumTypeKey(keys: string[]): string {
    return `${keys.join("")}st`;
}

export function sumTypes(context: Context): void {
    const sumTypes = context.config.sumType;
    if (!sumTypes) {
        return;
    }

    for (const [name, st] of Object.entries(sumTypes)) {

        const types = [];
        for (const t of context.typeSet.values()) {
            if (contains(t, st).match) {
                types.push(t);
            }
        }

        if (types.length > 0) {
            context.unions.set(sumTypeKey(st), {
                name: name,
                combinedUnion: types.map(x => x.displayName),
                useName: true,
                connectWith: "|",
            });
        }
    }
}

