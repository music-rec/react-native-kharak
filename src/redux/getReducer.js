export default (namespace, reducers, effects, initialState) => (state = initialState, action) => {
  if (action.type.startsWith('@@')) {
    return state;
  }
  const { type } = action;
  //   let func = effects[type.replace(new RegExp(`^${namespace}/`), '')];
  //   if (func) {
  //     // eslint-disable-next-line
  //     require('./redux').saga.run(function*() {
  //       yield call(func, action, { call, put });
  //     });
  //     return state;
  //   }
  const func = reducers[type.replace(new RegExp(`^${namespace}/`), '')];
  if (func) {
    return func(state, action);
  }
  return state;
};
