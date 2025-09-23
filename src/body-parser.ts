import {
  compileErrorHandler,
  createAsyncScope,
  createContext,
  setTmp,
} from '@mapl/framework';
import { layer } from '@mapl/web';
import { CTX, REQ, TMP } from '@mapl/web/constants';
import type { MiddlewareTypes } from '@mapl/web/core/middleware';

import {
  injectDependency,
  injectExternalDependency,
  lazyDependency,
} from 'runtime-compiler';
import { isHydrating } from 'runtime-compiler/config';

import type { t } from 'stnl';
import { code } from 'stnl/build/json/assert';

import { bodyErr } from './index.ts';

/**
 * Body error external dependency name
 */
export const ERROR_DEP: () => string = lazyDependency(
  injectExternalDependency,
  bodyErr,
);

export const json: <const N extends string, T extends t.TLoadedType>(
  name: N,
  schema: T,
) => MiddlewareTypes<typeof bodyErr, Record<N, t.TInfer<T>>> = isHydrating
  ? () =>
      layer.macro((scope) => {
        createAsyncScope(scope);
        setTmp(scope);
        ERROR_DEP();
        compileErrorHandler('', scope);
        createContext(scope);
        return '';
      })
  : (name, schema) =>
      layer.macro(
        (scope) =>
          createAsyncScope(scope) +
          setTmp(scope) +
          '=await ' +
          REQ +
          '.json().catch(()=>{});if(' +
          injectDependency('(()=>{' + code(schema) + '})()') +
          '(' +
          TMP +
          ')){' +
          compileErrorHandler(ERROR_DEP(), scope) +
          '}' +
          createContext(scope) +
          CTX +
          '.' +
          name +
          '=' +
          TMP +
          ';',
      );
