import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypeScript from "eslint-config-next/typescript"

export default defineConfig([
    ...nextVitals,
    ...nextTypeScript,
    // Newly introduced React Compiler diagnostics remain visible during migration.
    // The compiler is not enabled; existing Rules of Hooks stay enforced.
    {
        rules: {
            "react-hooks/set-state-in-effect": "warn",
            "react-hooks/static-components": "warn",
        },
    },
    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
])
