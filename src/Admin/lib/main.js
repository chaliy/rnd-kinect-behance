import './main.scss';

import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import {ROOT} from './api';

import Layout from './components/layout';
import Home from './containers/home';
import Stats from './stats';

render(
    <Router history={hashHistory}>
      <Route path={ROOT} component={Layout}>
        <IndexRoute component={Home} />
        {Stats}
      </Route>
    </Router>,
    document.getElementById('app')
)
