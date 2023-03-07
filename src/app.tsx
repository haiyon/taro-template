import { Component } from 'preact';
import { Provider } from 'react-redux';

import configStore from '@/store';

import '@/styles/index.scss';

const store = configStore();

class App extends Component {
  async componentDidMount() {}
  async componentDidShow() {}
  async componentDidHide() {}
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
