import React from 'react';
import PropTypes from 'prop-types';

// react-md
import ListItem from 'react-md/lib/Lists/ListItem';
import List from 'react-md/lib/Lists/List';

export default class ButtonList extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Calls this.props.onClick() after preventing the event's default action if
   * this.props.onClick was provided.
   * @param {MouseEvent} e
   * @param {number} id
   */
  onClick(e, id) {
    if (this.props.onClick) {
      e.preventDefault();
      this.props.onClick(id);
    }
  }

  render() {
    const { buttons, href } = this.props;

    if (!buttons.length) {
      return (
        <List className='buttons-list'>
          <ListItem primaryText='No buttons found'  />
        </List>
      );
    }

    return (
      <List className='buttons-list'>{
        buttons.map(button =>
          <a
            onClick={e => this.onClick(e, button.id)}
            href={href.replace(':button', button.id)}
            key={button.id}
          >
            <ListItem
              threeLines
              primaryText={button.name}
              secondaryText={
                (
                  button.domains == '*'
                    ? 'Global' : button.domains == '**'
                    ? 'Multiple' : button.domains
                )
                + '\n' + button.description
              }
            />
          </a>
        )
      }</List>
    );
  }

}

ButtonList.propTypes = {
  /**
   * An array of button objects to render.
   * Each button should contain id,name,domains,description properties.
   */
  buttons: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Called when a button's list element is clicked. The function is passed the
   * button's id.
   */
  onClick: PropTypes.func,
  /**
   * The base href link used for the `a` element that wraps the button.
   * :button will be replaced with the button's id.
   * @example
   * #/buttons/:button
   */
  href: PropTypes.string
};

ButtonList.defaultProps = {
  href: ''
}