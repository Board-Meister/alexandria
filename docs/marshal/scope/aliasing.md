---
sidebar_position: 2
sidebar_label: 'Aliasing'
---

# Aliasing

When using scoped global variables it might be inconvenient to use them over the old way. We have to add additional
line to tell TS about each new global variable and actually have two names for each of them.

```ts title="plugin.ts"
// We have to define this import as just definition import otherwise we will be including
// whole copy of styled-components library even if we are not using it (and all its dependencies)
import type styledComponents from 'styled-components'   // !!! Additional name !!!

// We have to declare this variable in each file otherwise Typescript validator will throw an exception
// regarding using non existing variable
declare const styled: typeof styledComponents;          // !!! Additional line !!!

// And finally we can use the library without getting errors from TS
const Div = styled.div`
    background-color: red;
`
```

A way to overcome this DX issue is to tell your bundler about global variable. This can be done in a lot different ways
per each bundler but to have concrete example we will focus on `esbuild` as our main bundler.

Even though `esbuild` has its own properties to allow for such endeavors like `external` or `alias` I found them
somewhat lacking and settled for an alias plugin `esbuild-plugin-path-alias`.

```bash
npm i -D esbuild-plugin-path-alias
```

With this installed we can easily alias any package however we want. Lets create a aliasing file for the
`styled-components`:

```ts title="styled-components.alias.ts"
import type Styled from "styled-components";

declare const styled: typeof Styled;

export default styled;
```

Notice how similar this is to what we did in `plugin.ts`. We just moved this repeating definition into one place which
will tell our bundler how to understand all our usages of this library.

But what exactly is happening here? In this file we specified the name of the global variable `styled`, what are its
contents (`styled-components`) and how it is exported (`default`).

With this we can use our plugin to specify how `styled-components` should be resolved during bundling.

```ts title="esbuild.config.mjs"
import aliasPlugin from 'esbuild-plugin-path-alias';

aliasPlugin({
    'styled-components': '/absolute/path/styled.alias',
}),
```

With this in place we can come back to our old habits:

```ts title="plugin.ts"
import styled from 'styled-components'

const Div = styled.div`
    background-color: red;
```

and stop worrying about duplicating this library.

:::warning Do not create additional alias maps
If you are not a creator of related scope plugin it is highly possible for them to have already prepared aliasing file
ready for you to use. Check out their library for such files and do not burden yourself unnecessarily.
:::

## Easy to use hard to maintain

For better experience library creators export their work in few different ways to make our life easier. If you want to
create a proper alias map you have to completely mimic their way of exporting. Lets take for example React library,
it does not only export React but also each of its methods separately, so we can write:
```ts
import { useState } from 'react'
const [loading, setLoading] = useState(false);
```
instead of
```ts
import React from 'react'

const { useState } = React;
const [loading, setLoading] = useState(false);
```
because of that we have to mimic their way of exporting to the letter. Here is a working example of export for
React 18.3.1:

```ts title="react.alias.ts"
import type React from 'react';

declare const react: typeof React;

export const Children = react.Children
export const Component = react.Component
export const Fragment = react.Fragment
export const Profiler = react.Profiler
export const PureComponent = react.PureComponent
export const StrictMode = react.StrictMode
export const Suspense = react.Suspense
export const cloneElement = react.cloneElement
export const createContext = react.createContext
export const createElement = react.createElement
export const createFactory = react.createFactory
export const createRef = react.createRef
export const forwardRef = react.forwardRef
export const isValidElement = react.isValidElement
export const lazy = react.lazy
export const memo = react.memo
export const startTransition = react.startTransition
export const useCallback = react.useCallback
export const useContext = react.useContext
export const useDebugValue = react.useDebugValue
export const useDeferredValue = react.useDeferredValue
export const useEffect = react.useEffect
export const useId = react.useId
export const useImperativeHandle = react.useImperativeHandle
export const useInsertionEffect = react.useInsertionEffect
export const useLayoutEffect = react.useLayoutEffect
export const useMemo = react.useMemo
export const useReducer = react.useReducer
export const useRef = react.useRef
export const useState = react.useState
export const useSyncExternalStore = react.useSyncExternalStore
export const useTransition = react.useTransition
export const version = react.version
// @ts-expect-error TS2339: Property does not exist
export const unstable_act = react.unstable_act
// @ts-expect-error TS2339: Property does not exist
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = react.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED

export default react;
```

Notice how we have two exports that TS does not know about but are actually required for libraries like React DOM to
work.

Notice how big of export map it is and its not the biggest one up there - hence the tip:

:::tip Maybe it is not worth it
If your plugin uses the global variable once or twice it might not be worth the effort to create such map. There are
even cases where using the map actually increased the size of the application.
:::

## Tips on creating alias map

If you decided after careful consideration that your benefits are big enough, here are some tips for creating maps of
such size:

1. Always export whole library as a default, it can't hurt.

2. To get real export (without TS exclusive exports like Interfaces, declarations etc.) just log it to the console. It
can't get more real then actual object in browser. Here is a function to create such map from logged variable:

```js
function createAliasMap(variable, vName) {
    return Object.keys(variable)
        .reduce((a, c) => `${a}export const ${c} = ${vName}.${c};\n`, '')
    ;
}
```