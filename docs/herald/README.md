---
sidebar_position: 1
sidebar_label: 'Intro'
---

# Intro

Herald is a asynchronous, prioritizable event handler. It allows you to trigger asynchronous events in a specific
order. Default event dispatcher (`element.dispatchEvent`) doesn't wait for asynchronous functions and just goes to
another registered method, with not explicit order system. This library is designed to wait for each event segment to
complete before moving on to the next, all in an orderly manner.

```ts
const herald = new Herald();
const unregister = herald.register(
    'bm.event',
    (): Promise<void> => new Promise(r => setTimeout(r, 2000)),
);
await herald.dispatch(new CustomEvent('bm.event'));
unregister();
```