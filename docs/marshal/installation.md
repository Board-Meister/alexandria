---
sidebar_position: 2
sidebar_label: 'Installation'
---

# Installation

To install Marshal you can use your package manager to add it as a dependency, for example:

```bash
npm i @boardmeister/marshal
```

:::tip Local installation
Although there is no CDN version, there is a minified Javascript version ready to be downloaded in repository
[here](https://github.com/Board-Meister/marshal/blob/master/dist/index.js).
:::

then you can require it in your script:

```ts title="ES module example"
import Marshal from '@boardmeister/marshal';

const marshal = new Marshal();
```

## How to register plugin

To starting using Marshal as your plugin manager you firstly have to create your plugin definitions. Each definition
must be made of:
- `entry` - Most important part, defines the plugin uniques and configuration file location.
- `type` - defines if is it just a plugin/module or a scope

additional settings will be discussed later, for now lets create your first registration config:

```ts title="manager.ts"
import Marshal, { RegisterConfig } from '@boardmeister/marshal';

const marshal = new Marshal();

// Minimal version of the registration object
const menuManagerDefinition: RegisterConfig = {
    entry: {
        source: 'http://cdn.boardmeister.com/plugin/boardmeister/menu-manager',
        namespace: 'boardmeister',
        name: 'menu-manager',
        version: '1.0.0',
    },
    type: 'module',
}

// With now ready registration object we can register new plugin
marshal.register(menuManagerDefinition);

// With registered plugins we can start loading them
// This method will load, initialize and inject required dependencies to all registered plugins
await marshal.load();
```

With registration and plugin initialization script ready we still need the actual plugin file.

## How to create entry file

To finalize plugin creation we still need the actual entry file for the plugin. It will decide when the actual plugin
will be loaded and how - it should be <u>as small as possible</u> as it will be always loaded at the start.
Optimal size for the config is about ~1KB.

```ts title="plugin.conf.ts"
// Import helper interfaces from marshal
import type { IInjectable, Module } from "@boardmeister/marshal"
import type Marshal from "@boardmeister/marshal";

// Your helper interface defining you injected dependencies
export interface IInjected {
  marshal: Marshal;
}

class MenuManagerPluginEntry {
  #injected?: IInjected;

  // How to define dependency and what this syntax does will be explained more thoroughly in later pages
  // For now you just have to know that what you define in static `inject` variable will be injected by manager
  static inject: Record<string, string> = {
    marshal: 'boardmeister/marshal', // Marshal is always registered and available to be retrieved
  }
  inject(injections: IInjected): void {
    this.#injected = injections;
  }

  /**
   * The rest of the file is for your use! We added everything that we need to have working plugin now you have to
   * decide what it does and how it interacts with the page.
   */
}

// To allows for static and non-static method verification with Typescript we have to create new variable with
// this specific hint
const EnMenuManagerPluginEntry: IInjectable<IInjected> = AntetypeCore;

// It is very important that entry is exported as a default!
export default EnMenuManagerPluginEntry;
```

If you've create plugin using Typescript you will have to convert it to Javascript be it by using whole framework like
Vite or just package like `typescript`.

When converted to Javascript it should look like this:

```js title="plugin.conf.js"
class MenuManagerPluginEntry {
    #injected;
    static inject = { marshal: "boardmeister/marshal" };
    inject(injected) {
        this.#injected = injected;
    }
}
const EnMenuManagerPluginEntry = MenuManagerPluginEntry;
export { EnMenuManagerPluginEntry as default };
```

With file ready we can now start the script in `manager.ts` file and verify that our plugin was loaded!

With this success we are ready to go forth and learn all how to require other plugins, create scopes,
retrieved tagged modules, how to lazy load, how to retrieve associated assets and more!