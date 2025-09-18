import type { MiddlewareTypes } from '@mapl/web/core/middleware';
import {
  compileErrorHandler,
  createAsyncScope,
  createContext,
  setTmp,
} from '@mapl/framework';
import { layer } from '@mapl/web';
import { CTX, REQ, TMP } from '@mapl/web/constants';

import { code } from 'stnl/build/json/assert';
import type { t } from 'stnl';

import { isHydrating } from 'runtime-compiler/config';
import { injectDependency, injectExternalDependency } from 'runtime-compiler';

import { bodyErr } from './index.ts';

/**
 * Body error external dependency name
 */
export const ERROR_DEP: string = injectExternalDependency(bodyErr);

export const json: <const N extends string, T extends t.TLoadedType>(
  name: N,
  schema: T,
) => MiddlewareTypes<typeof bodyErr, Record<N, t.TInfer<T>>> = isHydrating
  ? () =>
      layer.macro((scope) => {
        createAsyncScope(scope);
        setTmp(scope);
        compileErrorHandler(scope);
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
          TMP +
          '=' +
          ERROR_DEP +
          ';' +
          compileErrorHandler(scope) +
          '}' +
          createContext(scope) +
          CTX +
          '.' +
          name +
          '=' +
          TMP +
          ';',
      );
