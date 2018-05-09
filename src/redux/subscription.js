import prefixedDispatch from './prefixedDispatch';

export function run(subs, module, store, onError) {
  for (const key in subs) {
    if (Object.prototype.hasOwnProperty.call(subs, key)) {
      const sub = subs[key];
      sub(
        {
          dispatch: prefixedDispatch(store.dispatch, module),
          state: store.getState()[module.namespace],
          store
        },
        onError
      );
    }
  }
}
