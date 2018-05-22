import { ListItem, Snackbar, Toolbar, Divider, Drawer, Button } from 'react-md';
import { GatewayProvider, GatewayDest } from 'react-gateway';
import chromep from 'chrome-promise';
import React from 'react';

chrome.p = chromep;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      drawer: false,
      toasts: [],
      loading: true,
      storage: {}
    };

    window.__app = this;

    this._alert = this._alert.bind(this);
  }

  componentWillMount() {
    const data = {};

    chrome.p.storage.local.get(null).then(res => {
      Object.assign(data, res);

      this.setState({ storage: data, loading: false });
    });

    chrome.storage.onChanged.addListener((c, a) => this.onStorageChange(c, a));
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
      if (changes[change].newValue) storage[change] = changes[change].newValue;
      else delete storage[change];
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
      <main className="xyfir-buttons">
        <Toolbar
          colored
          title="Xyfir Buttons"
          nav={
            <Button icon onClick={() => this.setState({ drawer: true })}>
              menu
            </Button>
          }
        />

        <Drawer
          onVisibilityToggle={v => this.setState({ drawer: v })}
          autoclose={true}
          navItems={[
            <a href="#/buttons">
              <ListItem primaryText="Buttons" />
            </a>,
            <a href="#/presets">
              <ListItem primaryText="Presets" />
            </a>,

            <Divider />,

            <a href="#/docs" target="_blank">
              <ListItem primaryText="Documentation" />
            </a>,
            <a href="https://github.com/Xyfir/Buttons" target="_blank">
              <ListItem primaryText="Contribute" />
            </a>,
            <a
              href="https://www.xyfir.com/documentation/xyfir-buttons"
              target="_blank"
            >
              <ListItem primaryText="Contact" />
            </a>
          ]}
          visible={this.state.drawer}
          header={
            <Toolbar
              colored
              nav={
                <Button icon onClick={() => this.setState({ drawer: false })}>
                  arrow_back
                </Button>
              }
            />
          }
          type={Drawer.DrawerTypes.TEMPORARY}
        />

        <GatewayProvider>
          <div>
            {React.cloneElement(this.props.children, {
              App: this,
              storage: this.state.storage,
              params: this.props.params,
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
    );
  }
}
