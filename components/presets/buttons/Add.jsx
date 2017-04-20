import request from 'superagent';
import React from 'react';

// Components
import ButtonList from 'components/buttons/List';
import Tabs from 'components/misc/Tabs';

// Modules
import downloadPresets from 'lib/shared/presets/download';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

export default class AddPresetButton extends React.Component {

  constructor(props) {
    super(props);

    this.state = { buttons: [], preset: this.props.params.preset };
    
    this._loadButtons();
  }

  /**
   * Attempts to a add a button to the preset.
   * @param {number} id
   */
  onAddButton(id) {
    request
      .post(`${XYBUTTONS_URL}api/presets/${this.state.preset}/buttons/${id}`)
      .send({
        size: '4em', position: '50%,50%', styles: '{}', modKey: (
          this.props.storage.modkeys.presets[this.state.preset] || ''
        )
      })
      .end((err, res) => {
        if (err || res.body.error) {
          this.props.App._alert(res.body.message);
        }
        else {
          const next = () => {
            this._loadButtons();
            this.props.App._alert('Button added to preset');
          };
          
          downloadPresets([{ id: this.state.preset }]).then(next).catch(next);
        }
      });
  }

  /**
   * Loads buttons from storage (not App.state.storage), filters out buttons
   * already in the current preset, and saves those remaining to
   * this.state.buttons.
   */
  _loadButtons() {
    chrome.p.storage.local.get(null).then(result => {
      // Get all buttons
      let buttons =
        Object.entries(result)
          .filter(e => e[0].indexOf('button_') == 0)
          .map(b => b[1]);
      
      // Get all buttons in preset
      const presetButtons = result['preset_' + this.state.preset].buttons;

      // Remove from buttons[] where in presetButtons[]
      presetButtons.forEach(b1 =>
        buttons = buttons.filter(b2 => b1.id != b2.id)
      );
      
      this.setState({ buttons });
    });
  }

  render() {
    return (
      <Tabs
        type={2}
        base={'#/presets/' + this.props.params.preset}
        isCreator={true}
        activeTabIndex={4}
      >
        <div className='add-button-to-preset'>
          <p>
            Only buttons that are both downloaded locally and are not in the preset will be shown.
            <br />
            Clicking one of the items in the list will add its corresponding button to the preset.
            <br />
            If you're looking for a button that you don't already have downloaded, use the <a href="#/buttons">Find Buttons</a> section to download it first.
          </p>

          <ButtonList
            onClick={id => this.onAddButton(id)}
            buttons={this.state.buttons}
          />
        </div>
      </Tabs>
    );
  }

}