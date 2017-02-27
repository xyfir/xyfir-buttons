import React, { PropTypes } from 'react';

// Components
import LinkTabs from 'components/misc/LinkTabs';

export default class ButtonTabs extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const base = '#/buttons/' + this.props.id;

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
    
    return (
      <LinkTabs
        activeTabIndex={this.props.activeTabIndex}
        tabs={tabs}
      >{this.props.children}</LinkTabs>
    );
  }

}

ButtonTabs.propTypes = {
  /**
   * The button's id. Used for the hash routes.
   */
  id: PropTypes.number.isRequired,
  /**
   * The content to render.
   */
  children: PropTypes.element.isRequired,
  /**
   * The index of the active tab.
   */
  activeTabIndex: PropTypes.number.isRequired
};