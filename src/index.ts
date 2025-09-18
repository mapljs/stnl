import { taggedErr, type Err, type TaggedErr } from '@safe-std/error';

const parserTag: unique symbol = Symbol();
export const parserErr: <P>(payload: P) => TaggedErr<typeof parserTag, P> =
  taggedErr(parserTag);
export const isParserErr = (e: Err): e is TaggedErr<typeof parserTag, any> =>
  e[0] === parserTag;

export const bodyErr: TaggedErr<typeof parserTag, 'malformed body'> =
  parserErr('malformed body');
