import { Component, createElement } from 'react';

export const wire = ({ mount, unmount, state }) => DecoratedComponent => {

  return class Wrapper extends Component {

    constructor(props) {
      super(props);
      this.state = state || {};
    }

    componentWillMount = () => {
      if (mount) {
        let self = this;
        mount
          .apply(self)
          .then(state => {
            if (state){
              self.setState(state);
            }
          });
      }
    };

    componentWillUnmount = () => {
      if (unmount) {
        mount.apply(this);
      }
    };

    render = () => {
      return <DecoratedComponent {...this.state} />;
    };
  }
};
