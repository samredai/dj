/**
 * Asynchronously loads the component for namespaces node-viewing page
 */

import * as React from 'react';
import { lazyLoad } from '../../../utils/loadable';

export const CollectionsPage = props => {
  return lazyLoad(
    () => import('./index'),
    module => module.CollectionsPage,
    {
      fallback: <div></div>,
    },
  )(props);
};
