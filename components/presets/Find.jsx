import React from 'react';
import request from 'superagent';

// react-md
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';
import ListItem from 'react-md/lib/Lists/ListItem';
import List from 'react-md/lib/Lists/List';
import Tabs from 'react-md/lib/Tabs/Tabs';
import Tab from 'react-md/lib/Tabs/Tab';

// Components
import Pagination from 'components/misc/Pagination';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

export default class FindPresets extends React.Component {

  constructor(props) {
    super(props);

    let searchType = 'url', searchQuery = '';

    if (this.props.location.query.user)
      searchType = 'user', searchQuery = this.props.location.query.user;

    this.state = {
      presets: [], tab: 0, order: 'downloads', direction: 'desc',
      lastId: (this.props.location.query.lastId || 0),
      searchType, searchQuery
    };

    this._renderInstalled = this._renderInstalled.bind(this);
    this._renderRemote = this._renderRemote.bind(this);
    this._loadPresets = this._loadPresets.bind(this);
    this._renderList = this._renderList.bind(this);
  }

  componentDidMount() {
    this._loadPresets(false);
  }

  /**
   * Make sure the query string's lastId variable matches this.state.lastId.
   */
  componentWillReceiveProps(props) {
    if (this.state.lastId != props.location.query.lastId) {
      this.setState({
        lastId: (props.location.query.lastId || 0)
      }, () => this._loadPresets(false));
    }
  }

  /**
   * Updates this.state.tab and calls this._loadPresets().
   * @param {number} tab - Index of the active tab. 0 == remote, 1 == installed
   */
  onChangeTab(tab) {
    this.setState({ tab }, () => this._loadPresets(false));
  }

  /**
   * Updates this.state and calls this._loadPresets().
   * @param {string} prop - The property name within this.state to set val to.
   * @param {any} val - The value to set to this.state at prop.
   */
  onFilter(prop, val) {
    this.setState({ [prop]: val }, () => this._loadPresets());
  }

  /**
   * Loads presets based on active tab and uses user input from filter
   * controls.
   * @param {boolean} [timeout=true] - If true, everything is wrapped in a 200
   * millisecond timeout that is cleared if _loadPresets() is called again
   * before the timeout is finished.
   */
  _loadPresets(timeout = true) {
    clearTimeout(this.searchTimeout);
    
    this.searchTimeout = setTimeout(() => {
      // Remote presets
      if (this.state.tab == 0) {
        const query = Object.assign({}, this.state);
        
        delete query.presets, delete query.tab;

        request
          .get(XYBUTTONS_URL + 'api/presets')
          .query(query)
          .end((err, res) => {
            if (!err && res.body.presets)
              this.setState({ presets: res.body.presets });
          });
      }
      // Locally installed presets
      else {
        const presets = [];
        
        Object.entries(this.props.storage).map(s => {
          if (s[0].indexOf('preset_') == 0)
            presets.push(s[1]);
        });

        this.setState({ presets });
      }
    }, timeout ? 200 : 0);
  }

  /**
   * Renders the actual list of presets.
   * @returns {JSX.Element}
   */
  _renderList() {
    if (!this.state.presets.length) {
      return (
        <List className='presets-list'>
          <ListItem primaryText='No presets found'  />
        </List>
      );
    }

    return (
      <List className='presets-list'>{
        this.state.presets.map(preset =>
          <a href={'#/presets/' + preset.id} key={preset.id}>
            <ListItem
              threeLines
              primaryText={preset.name}
              secondaryText={
                (
                  preset.domains == '*'
                    ? 'Global' : preset.domains == '**'
                    ? 'Multiple' : preset.domains
                )
                + '\n' + preset.description.split('\n')[0]
              }
            />
          </a>
        )
      }</List>
    );
  }

  /**
   * Renders the list of matching presets and controls for finding presets.
   * @returns {JSX.Element}
   */
  _renderRemote() {
    if (this.state.tab != 0 || !this.state.presets) return <div />;

    return (
      <div className='find-presets remote'>
        <div className='controls'>
          <div className='md-grid'>
            <SelectField
              id='select--order-by'
              label='Order By'
              value={this.state.order}
              menuItems={[
                { label: 'Downloads', value: 'downloads' },
                { label: 'Date Created', value: 'created' },
                { label: 'Last Updated', value: 'updated' }
              ]}
              onChange={v => this.onFilter('order', v)}
              className='md-cell'
            />

            <SelectField
              id='select--order-direction'
              label='Order Direction'
              value={this.state.direction}
              menuItems={[
                { label: 'Ascending', value: 'asc' },
                { label: 'Descending', value: 'desc' }
              ]}
              onChange={v => this.onFilter('direction', v)}
              className='md-cell'
            />

            <SelectField
              id='select--search-type'
              label='Search Type'
              value={this.state.searchType}
              menuItems={[
                { label: 'Name', value: 'name' },
                { label: 'Domain', value: 'site' },
                { label: 'URL Match', value: 'url' }
              ]}
              onChange={v => this.onFilter('searchType', v)}
              className='md-cell'
            />
          </div>
          
          <div className='md-grid'>
            <TextField
              fullWidth
              id='search--remote'
              type='search'
              label='Search'
              className='md-cell'
              onChange={v => this.onFilter('searchQuery', v)}
            />
          </div>
        </div>

        {this._renderList()}

        <Pagination
          lastId={(this.state.presets[24] || {}).id}
          onChange={id => this.setState({ lastId: id })}
          currentLastId={this.state.lastId}
        />
      </div>
    );
  }

  /**
   * Renders all installed presets that match search query.
   * @returns {JSX.Element}
   */
  _renderInstalled() {
    if (this.state.tab != 1 || !this.state.presets) return <div />;

    return (
      <div className='find-presets installed'>
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
          <Tab label='Remote'>{this._renderRemote()}</Tab>
          <Tab label='Installed'>{this._renderInstalled()}</Tab>
        </Tabs>
      </TabsContainer>
    );
  }

}