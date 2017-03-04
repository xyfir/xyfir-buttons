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
import downloadButtons from 'lib/app/buttons/download';

export default class ForkButton extends React.Component {

  constructor(props) {
    super(props);

    this.state = { loading: true };
  }

  /**
   * Check if button exists and set state.isCreator.
   */
  componentWillMount() {
    request
      .get(XYBUTTONS_URL + 'api/buttons/' + this.props.params.button)
      .end((err, res) => {
        if (err || res.body.id == -1) {
          location.hash = '#/buttons';
        }
        else {
          this.setState({
            loading: false,
            isCreator: (
              res.body.creator.id == this.props.storage.account.uid
              && res.body.creator.id != 0
            )
          });
        }
      });
  }

  /**
   * Create a fork of the button and download the copy.
   */
  onFork() {
    const id = this.props.params.button;

    request
      .post(`${XYBUTTONS_URL}api/buttons/${id}/fork`)
      .end((err, res) => {
        if (err || res.body.error) {
          this.props.App._alert('Could not fork button');
        }
        else {
          const next = () => location.hash = '#/buttons/' + res.body.id;
          downloadButtons([{ id: res.body.id }]).then(next).catch(next);
        }
      });
  }

  render() {
    if (this.state.loading) return <div />;

    return (
      <Tabs
        base={'#/buttons/' + this.props.params.button}
        isCreator={this.state.isCreator}
        activeTabIndex={1}
      >
        <Paper zDepth={1} className='fork-button'>
          <p>
            Are you sure you want to fork this button?
            <br />
            A copy of this button will be created under your account. Only the button's data, and not its download stats, comments, votes, etc will be copied.
          </p>
          <Button
            raised primary
            label='Fork Button'
            onClick={() => this.onFork()}
          >call_split</Button>
        </Paper>
      </Tabs>
    );
  }

}