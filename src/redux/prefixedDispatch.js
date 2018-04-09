import invariant from 'invariant';
import warning from 'warning';

import prefixType from './prefixType';

const NAMESPACE_SEP = '/';

export default function prefixedDispatch(dispatch, module) {
  return action => {
    const { type } = action;
    invariant(type, 'dispatch: action should be a plain Object with type');
    warning(
      type.indexOf(`${module.namespace}${NAMESPACE_SEP}`) !== 0,
      `dispatch: ${type} should not be prefixed with namespace ${module.namespace}`
    );
    return dispatch({ ...action, type: prefixType(type, module) });
  };
}
