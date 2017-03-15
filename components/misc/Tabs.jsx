import React, { PropTypes } from 'react';

// Components
import LinkTabs from 'components/misc/LinkTabs';

export default class Tabs extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const base = this.props.base;

    const tabs = [
      { label: 'View', hash: base },
      { label: 'Fork', hash: base + '/fork' }
    ];

    if (this.props.isCreator) {
      tabs.push(
        { label: 'Edit', hash: base + '/edit' },
        { label: 'Delete', hash: base + '/delete' }
      );
    }

    if (this.props.type == 2)
      tabs.push({ label: 'Buttons', hash: base + '/buttons' });
    
    return (
      <LinkTabs
        activeTabIndex={this.props.activeTabIndex}
        tabs={tabs}
      >{this.props.children}</LinkTabs>
    );
  }

}

Tabs.propTypes = {
  /**
   * 1 = buttons section, 2 = presets section
   */
  type: PropTypes.number,
  /**
   * The base string for the hash routes.
   */
  base: PropTypes.string.isRequired,
  /**
   * The content to render.
   */
  children: PropTypes.element.isRequired,
  /**
   * If user is creator, 'Edit' and 'Delete' tabs are shown.
   * 'Buttons' tab is displayed if type == 2.
   */
  isCreator: PropTypes.bool.isRequired,
  /**
   * The index of the active tab.
   */
  activeTabIndex: PropTypes.number.isRequired
};

Tabs.defaultProps = {
  type: 1
};