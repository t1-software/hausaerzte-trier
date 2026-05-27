import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import globals from "globals";

export default [
    {
        ignores: [
            ".DS_Store",
            "node_modules/**",
            "build/**",
            ".svelte-kit/**",
            "package/**",
            ".env",
            ".env.*",
            "!.env.example",
            "pnpm-lock.yaml",
            "package-lock.json",
            "yarn.lock",
        ],
    },
    {
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.es2017,
                ...globals.node,
            },
        },
    },
    js.configs.recommended,
    ...tsPlugin.configs["flat/recommended"],
    ...svelte.configs["flat/recommended"],
    {
        files: ["**/*.svelte"],
        languageOptions: {
            parserOptions: {
                parser: tsParser,
            },
        },
    },
    eslintConfigPrettier,
    ...svelte.configs["flat/prettier"],
    {
        rules: {
            "svelte/no-at-html-tags": "off",
        },
    },
];
