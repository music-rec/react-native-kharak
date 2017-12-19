import { merge, map, union, without, castArray } from 'lodash';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

export default class {
  // eslint-disable-next-line no-unused-vars
  constructor({ route, navItem, reducer }, ...features) {
    this.tabItem = combine(arguments, arg => arg.tabItem);
    this.reducer = combine(arguments, arg => arg.reducer);
    this.route = combine(arguments, arg => arg.route);
  }

  get tabItems() {
    return merge(...this.tabItem);
  }

  get reducers() {
    return merge(...this.reducer);
  }

  get routes() {
    return this.route.map((component, idx) => React.cloneElement(component, { key: idx + this.route.length }));
  }
}
