import React from 'react';

// react-md
import Button from 'react-md/lib/Buttons/Button';

// Components
import ButtonList from 'components/buttons/List';
import Tabs from 'components/misc/Tabs';

export default class ViewPresetButtons extends React.Component {
  constructor(props) {
    super(props);

    this.state = { buttons: [] };
  }

  componentWillMount() {
    const id = this.props.params.preset;

    chrome.p.storage.local
      .get('preset_' + id)
      // Get ids of all buttons in preset
      .then(res => {
        const { buttons } = res['preset_' + id];
        return chrome.p.storage.local.get(buttons.map(b => 'button_' + b.id));
      })
      // Load full object for each button
      .then(res =>
        this.setState({ buttons: Object.keys(res).map(k => res[k]) })
      );
  }

  render() {
    if (!this.state.buttons) return <div />;

    return (
      <Tabs
        type={2}
        base={'#/presets/' + this.props.params.preset}
        activeTabIndex={4}
      >
        <div className="buttons-in-preset">
          <div className="controls">
            <Button
              raised
              primary
              label="Add Button"
              onClick={() => (location.hash += '/add')}
            >
              add
            </Button>

            <Button
              raised
              secondary
              label="Place Buttons"
              onClick={() => (location.hash += '/place')}
            >
              open_with
            </Button>
          </div>

          <ButtonList
            buttons={this.state.buttons}
            href={`#/presets/${this.props.params.preset}/buttons/:button`}
          />
        </div>
      </Tabs>
    );
  }
}
