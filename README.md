# dcmd

A lightweight Deno utility for executing shell commands with a simplified API.

## Motivation

This utility simplifies on of the most common use cases for Deno.Command into a single function call.

## Why should I use this?

You shouldn't. Copy and paste the one function into your project, or make a wrapper that makes the most sense for your project. I just use this one all time and wanted an easy way to find it.

## Usage

### Command Execution

```typescript
import { dCmd } from "jsr:@diamonddrake/dcmd";

// Execute a command and get full results
const { stdout, stderr, code, ok } = await dCmd("curl", "https://www.google.com");
console.log(`Exit code: ${code}`);
console.log(`Output: ${stdout}`);
if (!ok) {
    console.error(`Error: ${stderr}`);
}
```

### Script-Friendly Command Execution

```typescript
import { dsCmd } from "jsr:@diamonddrake/dcmd";

// Execute a command and get only stdout
// Will exit with error message if command fails
await dsCmd("curl", "https://www.google.com");
console.log("if you made it here your command ran ok");

```

## License

MIT see LICENSE file
