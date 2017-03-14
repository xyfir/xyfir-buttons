import React from 'react';
import request from 'superagent';

// react-md
import Button from 'react-md/lib/Buttons/Button';

// Components
import ButtonList from 'components/buttons/List';
import Tabs from 'components/misc/Tabs';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

export default class ViewPresetButtons extends React.Component {

  constructor(props) {
    super(props);

    this.state = { buttons: [] };
  }

  componentWillMount() {
    const query = {
      order: 'updated', direction: 'desc', searchType: 'preset',
      searchQuery: this.props.params.preset, noLimit: true
    };

    request
      .get(XYBUTTONS_URL + 'api/buttons')
      .query(query)
      .end((err, res) => {
        if (!err && res.body.buttons)
          this.setState({ buttons: res.body.buttons });
      });
  }

  render() {
    if (!this.state.buttons) return <div />;

    return (
      <Tabs
        type={2}
        base={'#/presets/' + this.props.params.preset}
        isCreator={true}
        activeTabIndex={4}
      >
        <div className='buttons-in-preset'>
          <div className='controls'>
            <Button
              raised primary
              label='Add Button'
              onClick={() => location.hash += '/add'}
            >add</Button>

            <Button
              raised secondary
              label='Place Buttons'
              onClick={() => location.hash += '/place'}
            >open_with</Button>
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