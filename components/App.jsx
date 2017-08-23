import { GatewayProvider, GatewayDest } from 'react-gateway';
import chromePromise from 'chrome-promise';
import React from 'react';

// react-md
import ListItem from 'react-md/lib/Lists/ListItem';
import Snackbar from 'react-md/lib/Snackbars';
import Toolbar from 'react-md/lib/Toolbars';
import Divider from 'react-md/lib/Dividers';
import Drawer from 'react-md/lib/Drawers';
import Button from 'react-md/lib/Buttons/Button';

chrome.p = new chromePromise();

export default class App extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      drawer: true, toasts: [], loading: true,
      storage: {}
    };

    window.__app = this;

    this._alert = this._alert.bind(this);
  }

  componentWillMount() {
    const data = {};

    chrome.p.storage.local.get(null)
      .then(res => {
        Object.assign(data, res);

        this.setState({ storage: data, loading: false });
      });
    
    chrome.storage.onChanged.addListener(
      (c, a) => this.onStorageChange(c, a)
    );
  }

  /**
   * Listen for changes to chrome.storage.local and update the application's
   * state.storage to reflect the changes made to the actual storage.
   * @param {object} changes - A key:value object holding the properties that
   * were changed. Each key's value is a StorageChange object that holds oldValue
   * and newValue properties.
   * @param {string} areaName - The name of the storage area. Possible values are
   * 'sync', 'local', or 'managed'.
   */
  onStorageChange(changes, areaName) {
    if (areaName != 'local') return;

    const storage = Object.assign({}, this.state.storage);

    Object.keys(changes).forEach(change => {
      if (changes[change].newValue)
        storage[change] = changes[change].newValue;
      else
        delete storage[change];
    });

    this.setState({ storage });
  }

  /**
   * Remove first element from toasts array.
   */
  onDismissAlert() {
    const [, ...toasts] = this.state.toasts;
    this.setState({ toasts });
  }

  /**
   * Creates a 'toast' for react-md Snackbar component.
   * @param {string} message - The text content of the toast.
   */
  _alert(message) {
    this.setState({
      toasts: this.state.toasts.concat([{ text: message }])
    });
  }


  render() {
    if (this.state.loading) return <div />;

    return (
      <main className='xyfir-buttons'>
        <Toolbar
          colored
          title='Xyfir Buttons'
          nav={
            <Button
              icon
              onClick={() => this.setState({ drawer: true })}
            >menu</Button>
          }
        />

        <Drawer
          onVisibilityToggle={
            v => this.setState({ drawer: v })
          }
          autoclose={true}
          navItems={[
            <a href='#/buttons'>
              <ListItem primaryText='Find Buttons' />
            </a>,
            <a href='#/buttons/create'>
              <ListItem primaryText='Create Button' />
            </a>,
            
            <Divider />,

            <a href='#/presets'>
              <ListItem primaryText='Find Presets' />
            </a>,
            <a href='#/presets/create'>
              <ListItem primaryText='Create Preset' />
            </a>,

            <Divider />,

            <a href='#/docs'>
              <ListItem primaryText='Documentation' />
            </a>,
            <a href='https://xyfir.com/#/contact' target='_blank'>
              <ListItem primaryText='Contact' />
            </a>,
            <a href='https://github.com/Xyfir/Xyfir-Buttons' target='_blank'>
              <ListItem primaryText='Contribute' />
            </a>
          ]}
          visible={this.state.drawer}
          header={
            <Toolbar
              colored
              nav={
                <Button
                  icon
                  onClick={() => this.setState({ drawer: false })}
                >arrow_back</Button>
              }
            />
          }
          type={Drawer.DrawerTypes.TEMPORARY}
        />

        <GatewayProvider>
          <div>
            {React.cloneElement(this.props.children, {
              App: this, storage: this.state.storage, params: this.props.params,
              location: this.props.location
            })}

            <GatewayDest name="gateway" />
          </div>
        </GatewayProvider>

        <Snackbar
          toasts={this.state.toasts}
          onDismiss={() => this.onDismissAlert()}
        />
      </main>
    )
  }

}