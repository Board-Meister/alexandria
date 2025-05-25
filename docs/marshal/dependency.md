---
sidebar_position: 3
sidebar_label: 'Dependencies'
---

# Dependencies

Marshal, as any package manager, allows you to define your dependencies and automatically loads them for you.
Although you have to define each used dependency the order you register them in doesn't matter as Marshal will order
them for you.

## Create your first dependency

Each dependency will have to appear in two places. First your plugin registry to know what you depend on and then your
plugin entry file to know how you refer it in code.

Lets start with registry, we define our dependencies in optional `requires` parameter the registration:

```ts title="manager.ts"
marshal.register({
    entry: {
        source: 'http://cdn.boardmeister.com/plugin/boardmeister/menu-manager',
        namespace: 'boardmeister',
        name: 'menu-manager',
        version: '1.0.0',
    },
    type: 'module',
    requires: [
        "boardmeister/router",
    ],
});
```

Here we have passed unique constraint for the module we want to load into `menu-manager`. From the constraint name we
can guess that menu manager requires a router to work properly.

```ts title="manager.ts"
marshal.register({
    entry: {
        source: 'http://cdn.boardmeister.com/plugin/boardmeister/router',
        namespace: 'boardmeister',
        name: 'router',
        version: '1.0.0',
    },
    type: 'module',
});
```

now with both plugins registrated we can start the load process:

```ts title="manager.ts"
await marshal.load();
```

## Use dependency in entry file

Now that we have registrated our plugin with explicit dependencies we should refactor our entry file to use said module:

```ts title="plugin.conf.ts"
// Import router interfaces to give a shape to our dependency
import type { IRouter } from "@boardmeister/router";

export interface IInjected {
  router: IRouter;
}

class MenuManagerPluginEntry {
  // We can name our dependencies however we want,
  // just the constraint name must match the `requires` definition
  static inject: Record<string, string> = {
    myRouter: 'boardmeister/router',
  }
  inject(injections: IInjected): void {
    console.log(injections.myRouter)
  }
}
```

Now if we load the application we should see in console our `router` plugin midst other logged messages.