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
export const dCmd = async (
  exePath: string,
  ...args: string[]
): Promise<{ stdout: string; stderr: string; code: number; ok: boolean }> => {
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
  };
};

/**
 * Process command wrapper intended for use in scripts. (simplifies the most common use case)
 * If you need more control, use dCmd instead.
 * Will exit if the command fails, logging the stderr and exit code.
 * @param exePath - The path to the executable to run.
 * @param args - The arguments to pass to the executable.
 * @param logCallback - Optional callback to handle logging of errors (or error hooks). If not provided, will use console.error.
 * @returns The stdout of the command.
 *
 * @example
 * const stdout = await dsCmd("curl", "https://www.google.com");
 * console.log(stdout);
 *
 * @example
 * const stdout = await dsCmd("curl", "https://www.google.com", (cmdName, code, error) => {
 *   console.log(`Command ${cmdName} failed with code ${code}: ${error}`);
 * });
 */
export const dsCmd = async (
  exePath: string,
  ...args: (string | ((cmdName: string, code: number, error: string) => void))[]
): Promise<string> => {
  const logCallback = typeof args[args.length - 1] === "function"
    ? args.pop() as (cmdName: string, code: number, error: string) => void
    : undefined;

  const cmdArgs = args as string[];

  try {
    const { stdout, stderr, code, ok } = await dCmd(exePath, ...cmdArgs);
    if (!ok) {
      const cmdName = exePath.split(/[\\/]/).pop() || exePath;
      const error = stderr || stdout;
      if (logCallback) {
        logCallback(cmdName, code, error);
      } else {
        console.error(
          `[${cmdName}] (exit code: ${code}) stderr-> ${error}`,
        );
      }
      Deno.exit(code);
    } else {
      return stdout;
    }
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    if (logCallback) {
      logCallback(exePath, 1, error);
    } else {
      console.error(error);
    }
    Deno.exit(1);
  }
};
