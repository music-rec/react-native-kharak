import prefixedDispatch from './prefixedDispatch';

export function run(subs, model, app, onError) {
  for (const key in subs) {
    if (Object.prototype.hasOwnProperty.call(subs, key)) {
      const sub = subs[key];
      sub(
        {
          dispatch: prefixedDispatch(app._store.dispatch, model),
          history: app._history
        },
        onError
      );
    }
  }
}
