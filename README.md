`stnl` validators for `@mapl/web`.
```ts
import * as bodyParser from '@mapl/stnl/body-parser';
import { t } from 'stnl';

import { router, handle } from '@mapl/web';

const app = router([
  bodyParser.json(
    'body',
    t.dict({
      name: t.string,
      pwd: t.string
    })
  )
], [
  handle.get('/info', (c) => {
    const user = c.body;
    // Use props
    console.log(c.name, c.pwd);

    ...
  })
]);
```
