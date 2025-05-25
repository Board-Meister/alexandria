---
sidebar_position: 5
---

# Localized events

Sometime you want to fire an event that only a specific group of listeners will receive - something scoped, for
example, per component. Thanks to that you can have multiple instances of the same component all working independently
without generating new event manager per component (and figuring out how to handle global listeners working on
multiple managers).

To accommodate such need there is an option to fire event is specific locations in the document (similarly to how
native `dispatchEvent` works). By passing node to either registration method or subscription object you can specify
where is event listener is located.

```ts
const node = document.getElementById('myElement');
herald.listen({
    event: 'event',
    subscription: () => {
        console.log('Event fired!');
    },
    anchor: node,
});
```

Now when firing events you can pass specific parts of the document to it to give event its location:

```ts
const component = document.getElementById('componentInMyElement');
await herald.dispatch(new CustomEvent('event'), {
    anchor: component,
});
```
Now every localized event listener, which isn't a direct parent of this event anchor, will be filtered out and not
executed.

:::tip Global listeners
Even though event is localized the global listeners (one without `anchor`) will be executed
:::

```ts
/*
    Our structure
    html
    -- body
    ---- div id="listenerDiv"
    ------ div id="dispatcherDiv"
    ---- div id="otherListenerDiv"
*/

herald.batch([
    {
        event: 'localized',
        subscription: () => {
            console.log('Listener received event!');
        },
        anchor: listenerDiv,
    },
    {
        event: 'localized',
        subscription: () => {
            console.log('Other listener received event!');
        },
        anchor: otherListenerDiv,
    },
]);
// Output is only "Listener received event!"
await herald.dispatch(new CustomEvent('localized'), {
    anchor: dispatcherDiv,
});
```

## Direction

Events dire upwards by default, from the dispatcher, up to the `body` tag. But if you need for event to propagate down
or both ways you can define it using `direction` parameter.

Direction parameter accepts three different values:
- `up` - Default, event goes upward
- `down` - Event goes downward
- `both` - Event goes both upward and downward

```ts
await herald.dispatch(new CustomEvent('localized'), {
    anchor: dispatcherDiv,
    direction: 'both',
});
```
Now all listeners, be it up or down, will receive this event.