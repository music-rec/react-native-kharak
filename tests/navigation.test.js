import React from 'react';
import renderer from 'react-test-renderer';

import App from './App';

describe('Navigation Tests', () => {
  it('Create an Instance', () => {
    const rendered = renderer.create(<App />).toJSON();
    expect(rendered).toBeTruthy();
  });
});
