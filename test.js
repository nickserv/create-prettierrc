import createPrettierrc, { detectors } from ".";

test("createPrettierrc", () => {
  expect(createPrettierrc('console.log("Hello, world!");'))
    .toMatchInlineSnapshot(`
    Object {
      "endOfLine": "lf",
      "jsxSingleQuote": false,
      "semi": true,
      "singleQuote": false,
    }
  `);
});

describe("detectors ", () => {
  test.each([
    ["semi", false, "alert()"],
    ["semi", true, "alert();"],
    ["singleQuote", false, '"string"'],
    ["singleQuote", false, ""],
    ["singleQuote", true, "'string'"],
    ["jsxSingleQuote", true, "<a href=''/>"],
    ["jsxSingleQuote", false, '<a href=""/>'],
    ["jsxSingleQuote", false, "<a href={true} />"],
    ["endOfLine", "lf", "\n"],
    ["endOfLine", "lf", ""],
    ["endOfLine", "crlf", "\r\n"],
    ["endOfLine", "cr", "\r"],
  ])("%s: %j from %j", (method, expected, code) => {
    expect(detectors[method](code)).toBe(expected);
  });
});
