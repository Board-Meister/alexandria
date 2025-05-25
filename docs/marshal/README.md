---
sidebar_position: 1
sidebar_label: 'Intro'
---

# Intro

Marshal is a swappable, scopeable, dynamic, client side plugin manager packaged with dependency injection. That's a
mouthful so let's break it up.

## Client side and dynamic

Marshal is plugin manager entirely executed on clients' computer which loads plugins in predefine order
(defined by dependencies) and joins them together. Each plugin is a separate being which defines its API of public
methods (Contract/Interface) that other plugins/modules can use. Therefore, plugin setup is not predefined and
can be changed/customized per user even after page has loaded.

## Plugins are swappable and can be injected

Each plugin can be swapped to another which implements the same constraint/interface. Marshal forces you to define your
plugin namespace and name which he later uses to create unique constraint. Other plugins can use this constraint to
automatically retrieve related plugin/module.

:::tip Plugin swapping

Thanks to this you can effortlessly swap plugins or even substitute different implementation for different modules.
This allows for easy change to alternative product or different implementation.
:::

Plugins can require other plugins/modules without actually defining them in their code, expect for their constraint name
which creates a need for some sort of contract/definition/interface. This is why it is recommended to use
this library with the Typescript superset and leverage their Interface functionality. [Read more](./dependency.md)

## Scope plugins

Some modules cannot work properly if they are only available in the plugin's methods - they have to be globally
accessible. For example library `styled-components` for React requires from you to define new usages outside your
component which would be impossible if we were to only pass definitions from function to function. That is why you
can create a scope for each plugin with `scope module`. Their definitions are globally available and can be used
anywhere without need for injection. [Read more](./scope/README.md)