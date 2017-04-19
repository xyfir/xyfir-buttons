import React from 'react';
import request from 'superagent';

// react-md
import Paper from 'react-md/lib/Papers';
import Button from 'react-md/lib/Buttons/Button';

// Components
import Tabs from 'components/misc/Tabs';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

// Modules
import downloadPresets from 'lib/shared/presets/download';
import isCreator from 'lib/app/items/is-creator';

export default class ForkPreset extends React.Component {

  constructor(props) {
    super(props);

    this.state = { loading: true };
  }

  /**
   * Check if preset exists and set state.isCreator.
   */
  componentWillMount() {
    request
      .get(`${XYBUTTONS_URL}api/presets/${this.props.params.preset}`)
      .end((err, res) => {
        if (err || res.body.id == -1) {
          location.hash = '#/presets';
        }
        else {
          this.setState({
            loading: false,
            isCreator: isCreator(
              res.body.creator, this.props.storage, 'preset', res.body.id
            )
          });
        }
      });
  }

  /**
   * Create a fork of the preset and download the copy and its buttons.
   */
  onFork() {
    const id = this.props.params.preset;

    request
      .post(`${XYBUTTONS_URL}api/presets/${id}/fork`)
      .end((err, res) => {
        if (err || res.body.error) {
          this.props.App._alert('Could not fork preset');
        }
        else {
          const next = () => location.hash = '#/presets/' + res.body.id;
          downloadPresets([{ id: res.body.id }]).then(next).catch(next);
        }
      });
  }

  render() {
    if (this.state.loading) return <div />;

    return (
      <Tabs
        type={2}
        base={'#/presets/' + this.props.params.preset}
        isCreator={this.state.isCreator}
        activeTabIndex={1}
      >
        <Paper zDepth={1} className='fork-preset'>
          <p>
            Are you sure you want to fork this preset?
            <br />
            A copy of this preset will be created under your account. Only the preset's data, and not its download stats, comments, votes, etc will be copied.
          </p>
          <Button
            raised primary
            label='Fork Preset'
            onClick={() => this.onFork()}
          >call_split</Button>
        </Paper>
      </Tabs>
    );
  }

}