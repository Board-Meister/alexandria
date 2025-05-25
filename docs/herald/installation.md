---
sidebar_position: 2
---

# Installation

To install Herald you can use your package manager to add it as a dependency, for example:

```bash
npm i @boardmeister/herald
```

After the package was installed, you can use it like so:

```ts
import { Herald } from '@boardmeister/herald';

const herald = new Herald();
```

Each instance of Herald has its own event queue, so you can have few event handler at the same time, all independent.