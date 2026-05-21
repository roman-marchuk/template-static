const OPERATORS = new Set(["+", "-", "*", "/"]);

type Token =
  | { kind: "number"; value: number }
  | { kind: "op"; value: "+" | "-" | "*" | "/" }
  | { kind: "lparen" }
  | { kind: "rparen" };

function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expression.length) {
    const ch = expression[i];

    if (ch === " " || ch === "\t") {
      i += 1;
      continue;
    }

    if (ch === "(") {
      tokens.push({ kind: "lparen" });
      i += 1;
      continue;
    }

    if (ch === ")") {
      tokens.push({ kind: "rparen" });
      i += 1;
      continue;
    }

    if (OPERATORS.has(ch)) {
      tokens.push({ kind: "op", value: ch as "+" | "-" | "*" | "/" });
      i += 1;
      continue;
    }

    if ((ch >= "0" && ch <= "9") || ch === ".") {
      let j = i;
      let sawDot = ch === ".";
      j += 1;

      while (j < expression.length) {
        const next = expression[j];
        if (next >= "0" && next <= "9") {
          j += 1;
          continue;
        }
        if (next === "." && !sawDot) {
          sawDot = true;
          j += 1;
          continue;
        }
        break;
      }

      const raw = expression.slice(i, j);
      if (raw === "." || (raw.match(/\./g)?.length ?? 0) > 1) {
        throw new Error("Invalid number");
      }

      const value = Number(raw);
      if (!Number.isFinite(value)) {
        throw new Error("Invalid number");
      }

      tokens.push({ kind: "number", value });
      i = j;
      continue;
    }

    throw new Error(`Invalid character: ${ch}`);
  }

  return tokens;
}

function normalizeUnaryMinus(tokens: Token[]): Token[] {
  const normalized: Token[] = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];

    if (
      token.kind === "op" &&
      token.value === "-" &&
      (i === 0 ||
        tokens[i - 1]?.kind === "op" ||
        tokens[i - 1]?.kind === "lparen")
    ) {
      normalized.push({ kind: "number", value: 0 });
      normalized.push({ kind: "op", value: "-" });
      continue;
    }

    normalized.push(token);
  }

  return normalized;
}

function precedence(op: "+" | "-" | "*" | "/"): number {
  return op === "+" || op === "-" ? 1 : 2;
}

function applyOp(a: number, b: number, op: "+" | "-" | "*" | "/"): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) {
        throw new Error("Division by zero");
      }
      return a / b;
    default:
      throw new Error("Unknown operator");
  }
}

function evaluateTokens(tokens: Token[]): number {
  const output: number[] = [];
  const ops: Array<"+" | "-" | "*" | "/" | "("> = [];

  for (const token of tokens) {
    if (token.kind === "number") {
      output.push(token.value);
      continue;
    }

    if (token.kind === "op") {
      while (ops.length > 0) {
        const top = ops[ops.length - 1];
        if (top === "(") break;
        if (precedence(top) < precedence(token.value)) break;
        const b = output.pop();
        const a = output.pop();
        if (a === undefined || b === undefined) {
          throw new Error("Invalid expression");
        }
        output.push(applyOp(a, b, top));
        ops.pop();
      }
      ops.push(token.value);
      continue;
    }

    if (token.kind === "lparen") {
      ops.push("(");
      continue;
    }

    if (token.kind === "rparen") {
      while (ops.length > 0 && ops[ops.length - 1] !== "(") {
        const op = ops.pop()!;
        if (op === "(") {
          throw new Error("Invalid expression");
        }
        const b = output.pop();
        const a = output.pop();
        if (a === undefined || b === undefined) {
          throw new Error("Invalid expression");
        }
        output.push(applyOp(a, b, op));
      }
      if (ops.length === 0 || ops.pop() !== "(") {
        throw new Error("Mismatched parentheses");
      }
    }
  }

  while (ops.length > 0) {
    const op = ops.pop()!;
    if (op === "(") {
      throw new Error("Mismatched parentheses");
    }
    const b = output.pop();
    const a = output.pop();
    if (a === undefined || b === undefined) {
      throw new Error("Invalid expression");
    }
    output.push(applyOp(a, b, op));
  }

  if (output.length !== 1) {
    throw new Error("Invalid expression");
  }

  return output[0]!;
}

function formatResult(value: number): string {
  if (!Number.isFinite(value)) {
    throw new Error("Invalid result");
  }

  const rounded = Math.round(value * 1e10) / 1e10;
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

/** Evaluate a basic arithmetic expression without using `eval()`. */
export function evaluateExpression(expression: string): string {
  const trimmed = expression.trim();
  if (!trimmed) {
    throw new Error("Expression is empty");
  }

  const tokens = normalizeUnaryMinus(tokenize(trimmed));
  if (tokens.length === 0) {
    throw new Error("Expression is empty");
  }

  const result = evaluateTokens(tokens);
  return formatResult(result);
}
