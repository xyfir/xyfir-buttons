import { Gateway } from 'react-gateway';
import request from 'superagent';
import React from 'react';

// react-md
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';

// Components
import Tabs from 'components/misc/Tabs';

// Modules
import downloadPresets from 'lib/shared/presets/download';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

export default class PlacePresetButtons extends React.Component {

  constructor(props) {
    super(props);

    const preset = this.props.storage[
      'preset_' + this.props.params.preset
    ],
    localPresetData = this.props.storage[
      'localpreset_' + this.props.params.preset
    ] || {
      buttons: []
    },
    buttons = [];
    
    preset.buttons.forEach(b1 => {
      // b1 from preset_${id}.buttons[]
      // b2 from button_${id}
      // b3 from localpreset_${id}.buttons[]
      const b2 = this.props.storage['button_' + b1.id];
      const b3 = localPresetData.buttons.find(b3 => b1.id == b3.id)
        || { styles: '{}' };

      b2.unparsedStyles = b2.styles;

      b3.styles = JSON.parse(b3.styles),
      b2.styles = JSON.parse(b2.styles),
      b1.styles = JSON.parse(b1.styles);

      const positions = b3.position
        ? b3.position.split(',')
        : b1.position.split(',');
      const size = b3.size || b1.size;
      
      const style = {
        top: positions[0], left: positions[1],
        height: size, width: size
      };

      // Position / size -> local preset styles -> preset styles
      // -> button styles
      Object.assign(b2.styles, b1.styles, b3.styles, style);

      b2.size = b1.size, b2.position = b1.position;
      buttons.push(b2);
    });

    this.state = {
      buttons, selectedButton: -1, controls: { top: '25%', left: '25%' },
      showOverlay: false, isCreator: (
        preset.creator == this.props.storage.account.uid &&
        preset.creator != 0
      )
    };
  }

  /**
   * Change a button's size.
   * @param {string} op - Operator: '+', '-'
   */
  onChangeSize(op) {
    const buttons = this.state.buttons.slice();
    const index = this.state.selectedButton;

    if (index == -1) return;

    const size = (
      Number(buttons[index].size.replace('em', ''))
      + (op == '+' ? 0.1 : -0.1) 
    ).toFixed(1) + 'em';
    
    buttons[index].size = size,
    buttons[index].styles.width = size,
    buttons[index].styles.height = size;

    this.setState({ buttons });
  }

  /**
   * Change a button's font size.
   * @param {string} op - Operator: '+', '-'
   */
  onChangeFontSize(op) {
    const buttons = this.state.buttons.slice();
    const index = this.state.selectedButton;

    if (index == -1) return;

    const size = ((
      buttons[index].styles.fontSize
        ? Number(buttons[index].styles.fontSize.replace('px', ''))
        : 14
    ) + (
      op == '+' ? 1 : -1
    )) + 'px';

    buttons[index].styles.fontSize = size;

    this.setState({ buttons });
  }

  /**
   * Calls the appropriate save method based on the user's status.
   */
  onSaveChanges() {
    this.state.isCreator ? this._saveChanges() : this._saveLocalChanges();
  }

  /**
   * Hides .xyfir-buttons-container.overlay.
   * @param {MouseEvent} e
   */
  onHideOverlay(e) {
    e.preventDefault();
    this.setState({ showOverlay: false, selectedButton: -1 });
  }

  /**
   * Called on draggable overlay elements.
   * @param {MouseEvent} e
   * @param {number} [index] - The index of the button being interacted with.
   * If not present, div.controls is being interacted with.
   */
  onMouseMove(e, index) {
    const top = ((e.clientY / window.innerHeight) * 100).toFixed(2) + '%';
    const left = ((e.clientX / window.innerWidth) * 100).toFixed(2) + '%';

    if (index != undefined) {
      const buttons = this.state.buttons.slice();
      
      buttons[index].position = top + ',' + left,
      buttons[index].styles.top = top,
      buttons[index].styles.left = left;
      
      this.setState({ buttons });
    }
    else {
      this.setState({ controls: { top, left }});
    }
  }

  /**
   * Called on draggable overlay elements.
   * @param {MouseEvent} e
   * @param {number} [index] - The index of the button being interacted with.
   * If not present, div.controls is being interacted with.
   */
  onMouseDown(e, index) {
    this._move = e2 => this.onMouseMove(e2, index);
    window.addEventListener('mousemove', this._move, true);
  }

  /**
   * @param {MouseEvent} e
   */
  onMouseUp(e) {
    window.removeEventListener('mousemove', this._move, true);
  }

  /**
   * Sends the changes to the xyButtons API and then re-downloads the preset.
   */
  _saveChanges() {
    const buttons = this.state.buttons.slice();

    const save = index => {
      if (buttons[index]) {
        const button = buttons[index];

        let styles = button.unparsedStyles;

        // Leave styles untouched if able
        if (buttons[index].styles.fontSize) {
          const originalStyles = JSON.parse(styles);

          if (originalStyles.fontSize != buttons[index].styles.fontSize) {
            originalStyles.fontSize = buttons[index].styles.fontSize;
            styles = JSON.stringify(originalStyles);
          }
        }

        request
          .put(
            XYBUTTONS_URL + 'api/presets/' +
            this.props.params.preset + '/buttons/' +
            button.id
          )
          .send({
            size: button.size, position: button.position, styles
          })
          .end((err, res) => {
            if (err || res.body.error)
              this.props.App._alert('Could not save changes');
            else
              save(index + 1);
          });
      }
      else {
        const next = () => this.props.App._alert('Changes saved');
        downloadPresets([{ id: this.props.params.preset }])
          .then(next).catch(next);
      }
    };

    save(0);
  }

  /**
   * Saves the changes to the `localpreset_${id}` local storage key.
   */
  _saveLocalChanges() {
    const buttons = this.state.buttons.slice();
    const preset = { buttons: [] };

    preset.buttons = buttons.map(button => {
      let styles = {};

      // The only local style accepted is fontSize
      if (button.styles.fontSize)
        styles.fontSize = button.styles.fontSize;
      
      return {
        id: button.id, size: button.size, position: button.position,
        styles: JSON.stringify(styles)
      };
    });

    chrome.storage.local.set({
      ['localpreset_' + this.props.params.preset]: preset
    }, () => {
      this.props.App._alert('Changes saved');
    });
  }

  render() {
    return (
      <Tabs
        type={2}
        base={'#/presets/' + this.props.params.preset}
        isCreator={this.state.isCreator}
        activeTabIndex={this.state.isCreator ? 4 : 2}
      >
        <Paper zDepth={1} className='place-buttons-in-preset'>
          <p>
            Click and drag elements to move them around.
            <br />
            Clicking a button selects it and allows you to change its sizes.
            <br />
            Right-clicking anywhere closes the overlay.
          </p>

          <div className='controls'>
            <Button
              raised primary
              label='Show Buttons'
              onClick={() => this.setState({ showOverlay: true })}
            >pageview</Button>

            <Button
              raised secondary
              label='Save Changes'
              onClick={() => this.onSaveChanges()}
            >save</Button>
          </div>

          <Gateway into='gateway'>
            <div
              onContextMenu={e => this.onHideOverlay(e)}
              className='xyfir-buttons-container overlay'
              onMouseUp={e => this.onMouseUp(e)}
              style={{ display: this.state.showOverlay ? 'initial' : 'none' }}
            >
              <div
                onMouseDown={e => this.onMouseDown(e)}
                className='controls'
                style={this.state.controls}
              >
                <div>
                  <label>Size</label>
                  <Button
                    flat
                    onClick={() => this.onChangeSize('+')}
                  >add_circle</Button>
                  <Button
                    flat
                    onClick={() => this.onChangeSize('-')}
                  >remove_circle</Button>
                </div>

                <div>
                  <label>Font Size</label>
                  <Button
                    flat
                    onClick={() => this.onChangeFontSize('+')}
                  >add_circle</Button>
                  <Button
                    flat
                    onClick={() => this.onChangeFontSize('-')}
                  >remove_circle</Button>
                </div>
              </div>

              {this.state.buttons.map((button, i) =>
                <button
                  onMouseDown={e => this.onMouseDown(e, i)}
                  onMouseUp={e => this.onMouseUp(e, i)}
                  onClick={() => this.setState({ selectedButton: i })}
                  title={button.tooltip}
                  style={button.styles}
                  key={button.id}
                >{decodeURIComponent(button.content)}</button>
              )}
            </div>
          </Gateway>
        </Paper>
      </Tabs>
    );
  }

}