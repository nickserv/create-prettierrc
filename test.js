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
  describe.each(
    Object.entries({
      semi: [
        [false, "alert()"],
        [true, "alert();"],
      ],
      singleQuote: [
        [false, '"string"'],
        [false, ""],
        [true, "'string'"],
      ],
      jsxSingleQuote: [
        [true, "<a href=''/>"],
        [false, '<a href=""/>'],
        [false, "<a href={true} />"],
      ],
      endOfLine: [
        ["lf", "\n"],
        ["lf", ""],
        ["crlf", "\r\n"],
        ["cr", "\r"],
      ],
    })
  )("%s", (detector, cases) => {
    test.each(cases)("%j from %j", (expected, code) => {
      expect(detectors[detector](code)).toBe(expected);
    });
  });
});
