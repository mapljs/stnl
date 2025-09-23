import { CTX, HEADERS } from '@mapl/web/constants';
import {
  type HandlerResponse,
  JSON_HEADER,
  JSON_OPTIONS,
} from '@mapl/web/core/handler';
import { noOp } from 'runtime-compiler';
import { isHydrating } from 'runtime-compiler/config';

import type { t } from 'stnl';
import build from 'stnl/build/json/stringify.rt';

export const json: <T extends t.TLoadedType>(
  schema: T,
) => HandlerResponse<t.TInfer<T>> = isHydrating
  ? () => noOp
  : (schema) => (input, hasContext) => {
      const body = build(schema, input);
      return hasContext
        ? HEADERS +
            '.push(' +
            JSON_HEADER() +
            ');return new Response(' +
            body +
            ',' +
            CTX +
            ')'
        : 'return new Response(' + body + ',' + JSON_OPTIONS() + ')';
    };
