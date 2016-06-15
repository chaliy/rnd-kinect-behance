import { IndexRoute, Route } from 'react-router';

import Home from './containers/home';

export default (
  <Route path="stats">
    <IndexRoute component={Home} />
    <Route path="home" component={Home} />
  </Route>);
