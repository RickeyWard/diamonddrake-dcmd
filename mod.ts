/**
 * Process command wrapper, simplifies the most common use case. (4 lines to 1)
 * @param exePath - The path to the executable to run.  
 * @param args - The arguments to pass to the executable.
 * @returns The stdout of the command.
 * 
 * @example
 * const { stdout, stderr, code, ok } = await dCmd("curl", "https://www.google.com");
 * console.log(code, stdout, stderr, ok);
 */
export const dCmd = async (exePath: string, ...args: string[]) => {
    const proc = new Deno.Command(exePath, {
        args: args,
        stdout: "piped",
        stderr: "piped",
    });
    
    const { stdout, stderr, code } = await proc.output();
    const textDecoder = new TextDecoder();
    const stdoutStr = textDecoder.decode(stdout);
    const stderrStr = textDecoder.decode(stderr);

    return {
        stdout: stdoutStr,
        stderr: stderrStr,
        code: code,
        ok: code === 0,
    }
}

/**
 * Process command wrapper intended for use in scripts. (simplifies the most common use case)
 * If you need more control, use dCmd instead.
 * Will exit if the command fails, logging the stderr and exit code.
 * @param exePath - The path to the executable to run.  
 * @param args - The arguments to pass to the executable.
 * @returns The stdout of the command.
 * 
 * @example
 * const stdout = await dsCmd("curl", "https://www.google.com");
 * console.log(stdout);
 */
export const dsCmd = async (exePath: string, ...args: string[]) => {
    try {
        const { stdout, stderr, code, ok } = await dCmd(exePath, ...args);
        if(!ok) {
            console.error(`[exit code: ${code}] stderr-> ${stderr||stdout}`);
            Deno.exit(code);
        } else {
            return stdout;
        }
    } catch (e) {
        console.error(e);
        Deno.exit(1);
    }
}
