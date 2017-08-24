import PropTypes from 'prop-types';
import React from 'react';

// react-md
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import Button from 'react-md/lib/Buttons/Button';

class PresetForm extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Validate the provided data. If data is valid call this.props.onSuccess().
   * @param {Event} [e]
   */
  onValidate(e) {
    e && e.preventDefault();
    
    const data = {
      name: this.refs.name._field.getValue(),
      buttons: [],
      domains: this.refs.domains._field.getValue(),
      urlMatch: this.refs.urlMatch._field.getValue(),
      description: this.refs.description._field.getValue()
    };

    // Validate data
    try {
      if (!data.name)
        throw 'Preset must have a name';
      if (data.name.length > 100)
        throw 'Preset name limited to 100 characters';
      if (!data.urlMatch)
        throw 'URL match does not exist';
      if (data.urlMatch.length > 1000)
        throw 'URL match value limited to 1000 characters';
      if (data.domains && data.domains.length > 250)
        throw 'Domains list limited to 250 characters';
    }
    catch (e) {
      this.props.App._alert(e);
    }

    this.props.onSuccess(data);
  }

  render() {
    const p = this.props.preset;

    return (
      <form onSubmit={e => this.onValidate(e)}>
        <h2>Required Data</h2>
        
        <TextField
          id='text--name'
          ref='name'
          type='text'
          label='Preset Name'
          className='md-cell'
          defaultValue={p.name}
        />

        <TextField
          id='text--url-match'
          ref='urlMatch'
          type='text'
          label='URL Match Expression'
          helpText='Your preset will only be injected if the url matches'
          className='md-cell'
          defaultValue={p.urlMatch}
        />
      
        <hr className='divider' />

        <TextField
          id='textarea--description'
          ref='description'
          rows={10}
          type='text'
          label='Description'
          maxRows={20}
          className='md-cell'
          defaultValue={p.description}
          lineDirection='right'
        />

        <TextField
          id='text--domains'
          ref='domains'
          type='text'
          label='Domains'
          helpText={
            'Domains that your preset works on. Has no effect on preset'
            + ' behavior. Use * for global or ** for too many sites to'
            + ' list.'
          }
          className='md-cell'
          defaultValue={p.domains}
        />

        <hr className='divider' />

        <Button
          raised primary
          label='Submit'
          onClick={() => this.onValidate()}
        />
      </form>
    );
  }

}

PresetForm.propTypes = {
  /**
   * Called when provided data is valid. Passes preset data object.
   */
  onSuccess: PropTypes.func.isRequired,
  /**
   * Preset object.
   */
  preset: PropTypes.object
};

PresetForm.defaultProps = {
  preset: {
    name: '', urlMatch: '.*', description: '', domains: '*'
  }
};

export default PresetForm;