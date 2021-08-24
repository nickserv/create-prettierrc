import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";

const traverse = traverseModule.default;

const parserOptions = {
  plugins: ["jsx"],
};

const semicolonStatementTypes = [
  "ExpressionStatement",
  "EmptyStatement",
  "DebuggerStatement",
  "WithStatement",
  "VariableDeclaration",
  "Directive",
  "ClassProperty",
  "ClassPrivateProperty",
  "StaticBlock",
  "ImportDeclaration",
  "ExportNamedDeclaration",
  "ExportDefaultDeclaration",
  "ExportAllDeclaration",
];

export const detectors = {
  semi(text) {
    // TODO: Filter semicolons in literals and comments using node locations
    const semicolonCount = text.split(";").length - 1;
    const lines = parse(text, parserOptions).program.body.filter((node) =>
      semicolonStatementTypes.includes(node.type)
    ).length;
    return semicolonCount >= lines / 2;
  },
  singleQuote(text) {
    const singleQuotes = text.split("'").length - 1;
    const doubleQuotes = text.split('"').length - 1;
    return singleQuotes > doubleQuotes;
  },
  jsxSingleQuote(text) {
    let singleQuotes = 0;
    traverse(parse(text, parserOptions), {
      JSXAttribute: ({ node: { value } }) => {
        if (value.type === "StringLiteral") {
          const quote = value.extra.raw[0];

          if (quote === "'") {
            singleQuotes++;
          } else if (quote === '"') {
            singleQuotes--;
          }
        }
      },
    });
    return singleQuotes > 0;
  },
  // trailingComma: 'none' | 'es5' | 'all';
  // bracketSpacing: boolean;
  // jsxBracketSameLine: boolean;
  // requirePragma: boolean;
  // insertPragma: boolean;
  // arrowParens: 'avoid' | 'always';
  endOfLine(text) {
    const crlf = text.split("\r\n").length - 1;
    const cr = text.split("\r").length - 1 - crlf;
    const lf = text.split("\n").length - 1 - crlf;
    const result = Object.entries({ cr, crlf, lf }).reduce(
      (memo, [type, occurences]) =>
        occurences >= memo.max ? { type, max: occurences } : memo,
      { max: 0 }
    );
    return result.type;
  },
  // quoteProps: 'as-needed' | 'consistent' | 'preserve';
};

export default function createPrettierrc(text) {
  return Object.fromEntries(
    Object.entries(detectors).map(([key, detector]) => [key, detector(text)])
  );
}
