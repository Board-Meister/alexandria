---
sidebar_position: 8
sidebar_label: 'API'
---

# Marshal API

Marshal has a few methods and properties open to let you manage your plugins or extends manager itself.

## Methods

### `addScope()`

Manually add new scoped variable:

```ts
marshal.addScope('version', '1.0.0');
```

<hr/>

### `asset()`

Retrieve path to the asset based on the module.

```ts
marshal.asset(pluginInstance, 'folder/image.png')
```

<hr/>

### `get()`

Retrieve instance by their constraint name.

```ts
marshal.get<Marshal>('boardmeister/marshal')
```

<hr/>

### `getMappedInstance()`

Retrieve instance registration configuration by passing the module.

```ts
marshal.getMappedInstance(pluginInstance)
```

<hr/>

### `getModuleConstraint()`

Retrieve instance constraint by passing the registration config.

```ts
marshal.getMappedInstance({
    entry: {
        //...
        namespace: 'boardmeister',
        name: 'marshal'
    },
    //...
})
```

<hr/>

### `getResourceUrl()`

Retrieve path to the resource based on the module.

```ts
marshal.getResourceUrl(pluginInstance, 'component/label.js')
```

<hr/>

### `import()`

Returns a promise which imports components from the passed source but with set scoped variables. This is basically
`import` but with injected variables. Useful when lazy loading components.

It accepts two arguments:
- path to the resource
- additional object to be included as a scoped variables

```ts
await marshal.import(marshal.getResourceUrl(pluginInstance, 'component/userDetails.js'), {
    userId: 1234,
})
```

<hr/>

### `load()`

Loads all registered plugins.

```ts
await marshal.load()
```

<hr/>

### `register()`

Register new plugin. [Read more](./registration.md)

```ts
marshal.register({
    entry: {
        source: 'http://cdn.boardmeister.com/plugin/boardmeister/menu-manager',
        namespace: 'boardmeister',
        name: 'menu-manager',
        version: '1.0.0',
    },
    type: 'module',
})
```

<hr/>

## Properties

### `instanceMap`

`instanceMap` is a WeakMap of initialized module to their registration config.

<hr/>

### `loaded`

`loaded` property holds all loaded and initialized plugins.

<hr/>

### `registered`

`registered` property holds all registered and not loaded plugins.

<hr/>

### `scope`

`scope` holds all scoped objects.

<hr/>

### `tagMap`

`tagMap` maps tags to related plugins.

<hr/>

### static `version`

`Marshal.version` holds the version of the manager.


