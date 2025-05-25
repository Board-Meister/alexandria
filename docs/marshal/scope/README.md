---
sidebar_position: 1
sidebar_label: 'Creating scope'
---

# Creating scope

As said in [Intro](../README.md) some modules we have to access globally, not just inside our functions - but still not
available to anything other then our plugins!

For this purpose we have plugins of `scope` type. There are few differences between `scope` and `module` plugins:
- `scope` > `module` - scoped plugins have their own load queue, separate from modules. They are still ordered by their
 `requires` but are loaded before any module type plugin.
- scopes do not have __entry file__ but __scope file__ which should always return an object
- you can add scoped variables manually without having to wait for the load process by `addScope` method
- scopes are not initialized - they are never treated as classes

## Create scope plugin

There isn't much difference between `module` and `scope` registration except its type:

```ts title="manager.ts"
marshal.register({
    entry: {
        source: 'http://cdn.boardmeister.com/plugin/boardmeister/react',
        namespace: 'boardmeister',
        name: 'react',
        version: '1.0.0',
    },
    type: 'scope',
});
```
## Scope file

But the file it points to is completely different:

```ts title="react.scope.ts"
import React from 'react';
import * as JsxRuntime from 'react/jsx-runtime';
import ReactDOM from 'react-dom/client'

export default const scope = {
  react: React,
  jsxRuntime: JsxRuntime,
  reactDom: ReactDOM,
};
```

Here we are exporting three libraries:
- React - the React library
- React JSX - React syntax extension for writing UI
- ReactDOM - React router

all of them have defined keys in the exported object which will be converted into actual variables when modules are
loaded.

:::danger Global variables
This means that you have 3 global variables `react`, `jsxRuntime` and `reactDom` which you cannot overwrite or create
anew in your scope
:::

Thanks to this scope now every other plugin you will use doesn't have to worry about bundling react into their script.
This saves space and you can be sure that everyone is using the same version of the UI builder.

## Adding scope manually

If you already have loaded and initialized variable that should go into the scope of loaded plugins you can add
it like so:

```ts title="manager.ts"
import React from 'react';

marshal.addScope('react', React);
```

now if you were to load other modules they will be able to use variable `react` to access React functionality.

```ts title="plugin.ts"
const { useEffect } = react;
```

:::tip You don't like this?
If you are not a fan of example above and would prefer to use `import { useEffect } from 'react'` be sure to read
[Aliasing](./aliasing.md)
:::