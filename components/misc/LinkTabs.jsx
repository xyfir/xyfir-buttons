import React from 'react';
import PropTypes from 'prop-types';

// react-md
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';
import Tabs from 'react-md/lib/Tabs/Tabs';
import Tab from 'react-md/lib/Tabs/Tab';

export default class LinkTabs extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { tabs, activeTabIndex } = this.props;

    return (
      <TabsContainer
        colored
        onTabChange={() => 1}
        panelClassName='md-grid link-tabs'
        activeTabIndex={activeTabIndex}
      >
        <Tabs tabId='tab' className='tabs'>{
          tabs.map((tab, i) =>
            <Tab
              key={tab.label}
              label={tab.label}
              onClick={() => location.hash = tab.hash}
            >{
              activeTabIndex == i ? this.props.children : <span />
            }</Tab>
          )
        }</Tabs>
      </TabsContainer>
    );
  }

}

LinkTabs.propTypes = {
  /**
   * An array of objects detailing each tab's data.
   * `[{ label: string, hash: string }]`
   */
  tabs: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * The content to render for the active tab.
   */
  children: PropTypes.element.isRequired,
  /**
   * The index of the active tab.
   */
  activeTabIndex: PropTypes.number.isRequired
}