# prettier-detect

Generate a Prettier config from any JavaScript code

## Usage

```js
import prettierDetect from "prettier-detect";

prettierDetect('console.log("Hello, world!")');
```

```json
{
  "endOfLine": "lf",
  "jsxSingleQuote": false,
  "semi": true,
  "singleQuote": false
}
```

## Limitations

Currently supports a limited number of Prettier config options using only JavaScript and JSX (React) syntax
