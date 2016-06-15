import { Component } from 'react';

export default class Layout extends Component {

    render () {
        let { children } = this.props;

        return (
            <div className="container">
              <nav className="navbar navbar-default">
                <div className="container-fluid">

                  <div className="navbar-header">
                    <a className="navbar-brand" href="#">Admin</a>
                  </div>

                  <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav">
                      <li><a href="#">Домашная</a></li>
                      <li><a href="#/stats">Статистика</a></li>
                    </ul>
                  </div>

                </div>
              </nav>



              {children}
            </div>
        )
    }
};
