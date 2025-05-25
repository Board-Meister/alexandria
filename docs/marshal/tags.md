---
sidebar_position: 6
sidebar_label: 'Tagging plugins'
---

# Tagging plugins

In you registration you can tag a plugin. By tagging I means assigning specific labels by which they can
be later retrieved.


## How to tag a plugin
```ts
marshal.register({
    entry: {
        // ...
        namespace: 'boardmeister',
        name: 'router',
    },
    tags: ['subscriber'],
})
```
In the example above we have tagged `boardmeister/router` as a `subscriber`. By itself it doesn't really mean anything.
But when we combine it with a specific event related plugin ([Herald](../herald/README.md)) you've just extended
available functionality of this plugin significantly.

## Retrieved tagged plugins

To retrieve tagged plugins we are using `requires` parameter but in a specific way:

```ts
marshal.register({
    entry: {
        // ...
        namespace: 'boardmeister',
        name: 'herald',
    },
    requires: ['!subscriber']
})
```
The exclamation mark `!` tells Marshal that everything after it, is a tag name. Now Marshal will gather all tagged
plugins and pass them as an array into Herald:

```ts title="herald.conf.ts"
import type { Module } from '@boardmeister/marshal';
import type { ISubscriber } from '@src/type.d';

export interface IInjected {
  subscribers: { config: ISubscriber, module: Module }[];
}

class Herald {
  #injected: IInjected = {
    subscribers: []
  };

  static inject: Record<string, string> = {
    subscribers: '!subscriber',
  }
  inject(injections: IInjected): void {
    this.#injected = injections;
  }
}
```

Now we are able to automatically register all tagged plugins and read to what events they are subscribing to. In
the same way we can create automatic way to register new routes into router, retrieve menu elements, register logger
channels etc.

## How are plugins passed

Plugins in the array are not just instances of the plugins. They consist of plugin definition and their instances.
- `config` - Config parameter holds related plugin registration
- `module` - holds tagged plugin instance and later (after it was initialized) the initialized state

```ts
static inject: Record<string, string> = {
    subscribers: '!subscriber',
}
inject(injections: IInjected): void {
    this.#injected = injections;
    this.#injected.subscribers.forEach(subscriber => {
        console.log(subscriber.config, subscriber.module);
    });
}
```