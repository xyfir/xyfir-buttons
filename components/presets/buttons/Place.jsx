import { Gateway } from 'react-gateway';
import React from 'react';

// react-md
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';

// Components
import Tabs from 'components/misc/Tabs';

// Modules
import savePreset from 'lib/shared/presets/save';

export default class PlacePresetButtons extends React.Component {

  constructor(props) {
    super(props);

    const preset = this.props.storage[
      'preset_' + this.props.params.preset
    ],
    buttons = [];
    
    preset.buttons.forEach(_b1 => {
      // !! Must use Object.assign() to prevent app state form being changed
      // b1 from preset_${id}.buttons[]
      const b1 = Object.assign({}, _b1);
      // b2 from button_${id}
      const b2 = Object.assign({}, this.props.storage['button_' + b1.id]);

      b2.unparsedStyles = b2.styles;

      b2.styles = JSON.parse(b2.styles),
      b1.styles = JSON.parse(b1.styles);

      const positions = b1.position.split(',');
      const size = b1.size;
      
      const style = {
        top: positions[0], left: positions[1],
        height: size, width: size
      };

      // Position / size -> preset styles -> button styles
      Object.assign(b2.styles, b1.styles, style);

      b2.size = b1.size, b2.position = b1.position;
      buttons.push(b2);
    });

    this.state = {
      buttons, selectedButton: -1, controls: { top: '25%', left: '25%' },
      url: '', showOverlay: false
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
   * Update preset.
   */
  onSaveChanges() {
    const buttons = this.state.buttons.slice();
    const preset = this.props.storage[
      'preset_' + this.props.params.preset
    ];

    preset.buttons = buttons.map(button => {
      let styles = {};

      if (button.styles.fontSize) styles.fontSize = button.styles.fontSize;
      
      return {
        id: button.id, size: button.size, position: button.position,
        styles: JSON.stringify(styles)
      };
    });

    savePreset(preset).then(() => this.props.App._alert('Changes saved'));
  }

  /**
   * Hides .xybuttons.overlay.
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

  render() {
    return (
      <Tabs
        type={2}
        base={'#/presets/' + this.props.params.preset}
        activeTabIndex={4}
      >
        <Paper zDepth={1} className='place-buttons-in-preset'>
          <p>
            Click and drag elements to move them around.
            <br />
            Clicking a button selects it and allows you to change its sizes.
            <br />
            Right-clicking anywhere closes the overlay.
          </p>

          <TextField
            id='textarea--url'
            type='text'
            label='URL'
            value={this.state.url}
            onChange={url => this.setState({ url })}
            helpText='Only buttons that match the URL will be rendered'
            className='md-cell'
          />

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
              className='xybuttons overlay'
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
                  style={
                    Object.assign({}, button.styles, {
                      display: new RegExp(button.urlMatch).test(this.state.url)
                        ? 'initial' : 'none'
                    })
                  }
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