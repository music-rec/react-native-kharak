const NAMESPACE_SEP = '/';

export default function prefixType(type, module) {
  const typeWithoutAffix = type.replace(/\/@@[^/]+?$/, '');
  if ((module.reducers && module.reducers[typeWithoutAffix]) || (module.effects && module.effects[typeWithoutAffix])) {
    return `${module.namespace}${NAMESPACE_SEP}${type}`;
  }
  return type;
}
