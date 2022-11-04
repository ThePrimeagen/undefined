import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
	preset: "ts-jest/presets/js-with-ts",
	testEnvironment: "node",
	clearMocks: true,
	coverageDirectory: "coverage",
	rootDir: ".",
	collectCoverage: true,
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
	transform: {
		"^.+\\.[tj]sx?$": [
			"ts-jest",
			{
				useESM: true,
				tsconfig: "tsconfig.spec.json",
				diagnostics: {
					ignoreCodes: [
						"2322",
						"2332",
						"2339",
						"2345",
						"2379",
						"2532",
						"2769",
					],
				},
			},
		],
	},
	verbose: true,
	extensionsToTreatAsEsm: [".ts", ".tsx"],
	moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
	moduleDirectories: ["node_modules", "dist", "src"],
	coverageProvider: "v8",
};

export default jestConfig;
