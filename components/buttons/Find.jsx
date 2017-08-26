import React from 'react';

// react-md
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';
import ListItem from 'react-md/lib/Lists/ListItem';
import Button from 'react-md/lib/Buttons/Button';
import List from 'react-md/lib/Lists/List';
import Tabs from 'react-md/lib/Tabs/Tabs';
import Tab from 'react-md/lib/Tabs/Tab';

// Modules
import search from 'lib/shared/util/search';

export default class FindButtons extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      buttons: [], tab: 0, searchQuery: '',
      preset: this.props.location.query.preset
    };

    this._renderInstalled = this._renderInstalled.bind(this);
    this._renderRemote = this._renderRemote.bind(this);
    this._loadButtons = this._loadButtons.bind(this);
    this._renderList = this._renderList.bind(this);
  }

  componentDidMount() {
    this._loadButtons();
  }

  /**
   * Updates this.state.tab and calls this._loadButtons().
   * @param {number} tab - Index of the active tab. 0 == installed, 1 == remote
   */
  onChangeTab(tab) {
    this.setState({ tab }, () => this._loadButtons());
  }

  /**
   * Updates this.state and calls this._loadButtons().
   * @param {string} prop - The property name within this.state to set val to.
   * @param {any} val - The value to set to this.state at prop.
   */
  onFilter(prop, val) {
    this.setState({ [prop]: val }, () => this._loadButtons());
  }

  /**
   * Loads matching buttons.
   */
  _loadButtons() {
    const buttons = Object
      .entries(this.props.storage)
      .filter(b => b[0].indexOf('button_') == 0)
      .map(b => b[1]);

    this.setState({ buttons: search(buttons, this.state.searchQuery) });
  }

  /**
   * Renders the actual list of buttons.
   * @returns {JSX.Element}
   */
  _renderList() {
    if (!this.state.buttons.length) {
      return (
        <List className='buttons-list'>
          <ListItem primaryText='No buttons found'  />
        </List>
      );
    }

    return (
      <List className='buttons-list'>{
        this.state.buttons.map(button =>
          <a href={'#/buttons/' + button.id} key={button.id}>
            <ListItem
              threeLines
              primaryText={button.name}
              secondaryText={
                (
                  button.domains == '*'
                    ? 'Global' : button.domains == '**'
                    ? 'Multiple' : button.domains
                )
                + '\n' + button.description.split('\n')[0]
              }
            />
          </a>
        )
      }</List>
    );
  }

  /**
   * Renders the list of resources for finding buttons.
   * @returns {JSX.Element}
   */
  _renderRemote() {
    if (this.state.tab != 1) return <div />;

    return (
      <List className='find-buttons remote md-paper md-paper--1'>
        <ListItem
          primaryText='GitHub'
          onClick={() => location.href =
            'https://github.com/search?q=xybuttons&type=Repositories'
          }
        />
        <ListItem
          primaryText='GitHub Gist'
          onClick={() => location.href =
            'https://gist.github.com/search?q=xybuttons&ref=simplesearch'
          }
        />
        <ListItem
          primaryText='GreasyFork'
          onClick={() => location.href =
            'https://greasyfork.org/en/scripts?q=xybuttons'
          }
        />
        <ListItem
          primaryText='OpenUserJS'
          onClick={() => location.href =
            'https://openuserjs.org/?q=xybuttons'
          }
        />
      </List>
    );
  }

  /**
   * Renders all installed buttons that match search query.
   * @returns {JSX.Element}
   */
  _renderInstalled() {
    if (this.state.tab != 0 || !this.state.buttons) return <div />;

    return (
      <div className='find-buttons installed'>
        <div className='controls'>
          <div className='md-grid'>
            <TextField
              fullWidth
              id='search--installed'
              type='search'
              label='Search'
              className='md-cell'
              onChange={v => this.onFilter('searchQuery', v)}
            />
          </div>
        </div>

        {this._renderList()}
      </div>
    );
  }

  render() {
    return (
      <TabsContainer
        colored
        onTabChange={tab => this.onChangeTab(tab)}
        panelClassName='md-grid'
        activeTabIndex={this.state.tab}
      >
        <Tabs tabId='tab' className='tabs'>
          <Tab label='Installed'>{this._renderInstalled()}</Tab>
          <Tab label='Remote'>{this._renderRemote()}</Tab>

          {/* react-md doesn't like this here but it works */}
          <Button
            floating fixed primary
            tooltipPosition='left'
            fixedPosition='br'
            tooltipLabel='Create or import button'
            onClick={() => location.hash = '#/buttons/create'}
          >add</Button>
        </Tabs>
      </TabsContainer>
    );
  }

}