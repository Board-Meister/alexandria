---
sidebar_position: 5
sidebar_label: 'Loading resources'
---

# Loading Resources

Loading additional resources like images or lazy loaded components might be a little hard if you don't know from where
you were loaded. To accommodate this issue our registration config have additional parameters where the user defines
from where your plugin was loaded - you just have to specify correct suffix to the file.

## Getting assets

Your initial path to the assets is defined in `asset.src` property. But Marshal provides additional method to make
retrieving assets path (and upgrading to higher versions) easier:
```ts
const aPlugin = marshal.get<IPlugin>('boardmeister/plugin');
const assetPath = marshal.asset(aPlugin, 'folder/image.jpg');
```
or if you are inside the plugin:
```ts
const assetPath = marshal.asset(this, 'folder/image.jpg');
```

## Getting components

Your initial path to the resources is defined in `resource.src` property. And similarly to `asset` Marshal provides
additional method to make retrieving resource path easier:
```ts
const aPlugin = marshal.get<IPlugin>('boardmeister/plugin');
const componentPath = marshal.getResourceUrl(aPlugin, 'folder/component.js');
const component = await import(componentPath);
```
or if you are inside the plugin:
```ts
const componentPath = marshal.getResourceUrl(this, 'folder/component.js');
const component = await import(componentPath);
```