---
sidebar_position: 7
sidebar_label: 'Registration cheat sheet'
---

# Registration cheat sheet

This document explains all parameters of registration config used to register new plugin.

Parameters with asterisk are required.

## `entry`*

Entry is the most important part, it defines the uniqueness of the plugin and ability to be injected elsewhere.

<hr/>

### `source`*

Defines where the plugins source code is. Possible values:
- `string`- a URL path to the entry file (even blob path) which works with `import` function
- `object` - already initialized object be it a class or actual object. Such plugin will not be initialized second time
and won't receive any injections

```ts
{
    entry: {
        source: new Router() | 'http://cdn.boardmeister.com/plugin/boardmeister/router',
```
<hr/>

### `namespace`*

A unique name defining the owner of the plugin, it can be any text.

```ts
{
    entry: {
        namespace: 'boardmeister',
```

<hr/>

### `name`*

A semi-unique name of the plugin, it just have to not repeat in the owners space, it can be any text.

```ts
{
    entry: {
        name: 'router',
```

<hr/>

### `version`*

The current version of the plugin, it can be any text
```ts
{
    entry: {
        version: '1.0.0.',
```

<hr/>

### `arguments`

An array of any kind of variables, they will be provided to the constructor of the plugin when initialized in the
arrays' order.

```ts
{
    entry: {
        arguments: [
            "first",
            { "second" : 1 },
            new Observer(),
        ]
```

<hr/>

## `type`*

Defined the type of plugin, possible values: `module` or `scope`.
```ts
{
    type: 'scope',
```

:::tip It can be more
The only additional functionality and change of behavior happens on `scope` value, otherwise the script doesn't care
what is inside. If you want to add new type like `tool` for additional functionality feel free to do so.
:::

<hr/>

## `tags`

An array of tags that plugin implements, each tag must be a string.

```ts
{
    tags: ['controller', "subscriber"],
```

<hr/>

## `requires`

Defines plugin's dependencies, an array of strings.

```ts
{
    requires: ['boardmeister/marshal'],
```

<hr/>

## `lazy`

When plugin is defined as lazy it will not be loaded at the `load` but instead will return a promise which resolved
will load and initialize the plugin.

:::danger Experimental feature.
:::

```ts
{
    lazy: true,
```

<hr/>

## `asset`

Object defining settings regarding assets loading.

<hr/>

### `src`*

The prefix path to where assets are located. Used by `asset` method.

```ts
{
    asset: {
        src: 'http://cdn.boardmeister.com/asset/'
```
Example of usage:
```ts
marshal.asset(aPlugin, 'logo.svg'); // resolves to http://cdn.boardmeister.com/asset/logo.svg
```

<hr/>

## `resource`

Object defining settings regarding resource loading (like lazy loaded components).

<hr/>

### `src`*

The prefix path to where components are located. Used by `getResourceUrl` method.

```ts
{
    resource: {
        src: 'http://cdn.boardmeister.com/resource/'
```
Example of usage:
```ts
marshal.getResourceUrl(aPlugin, 'label.js'); // resolves to http://cdn.boardmeister.com/resource/label.js
```