---
sidebar_position: 4
sidebar_label: 'Dispatching'
---

# Dispatching events

There are two methods for dispatching events. One for asynchronous calls and one for synchronous. There is no
difference on execution except the name:
```ts title="async.ts"
// Returns a Promise
await herald.dispatch(new CustomEvent('event'));
```
```ts title="sync.ts"
// Returns nothing
herald.dispatchSync(new CustomEvent('event'));
```
Just in case you needed a old way of event dispatching you can choose between async and sync calls.

## Stopping the event flow

If you need to stop the event to, for example, replace default behavior with your own you can use `stopPropagation` on
the event object.

```ts
herald.listen({
    event: 'event',
    subscription: (e: CustomEvent) => {
        throw new Error("Event won't be called")
    },
})
herald.listen({
    event: 'event',
    subscription: (e: CustomEvent) => {
        e.stopPropagation()
    },
    priority: -1,
})
// No error
await herald.dispatch(new CustomEvent('event'));
```
