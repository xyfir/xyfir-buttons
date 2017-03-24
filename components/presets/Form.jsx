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
      urlMatch: this.refs.urlMatch._field.getValue(),
      domains: this.refs.domains._field.getValue(),
      isListed: document.getElementById('cb--is-listed').checked,
      description: this.refs.description._field.getValue(),
    };

    const preset = Object.assign({}, data);

    // Validate data
    try {
      if (!preset.name)
        throw 'Preset must have a name';
      if (preset.name.length > 100)
        throw 'Preset name limited to 100 characters';
      if (!preset.urlMatch)
        throw 'URL match does not exist';
      if (preset.urlMatch.length > 1000)
        throw 'URL match value limited to 1000 characters';
      if (preset.domains && preset.domains.length > 250)
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
      <form onSubmit={(e) => this.onValidate(e)}>
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

        <h2>Optional Public Data</h2>

        <Checkbox
          id='cb--is-listed'
          name='cb--is-listed'
          label='List Publicly'
          defaultChecked={!!p.isListed}
        />

        <TextField
          id='textarea--description'
          ref='description'
          rows={10}
          type='text'
          label='Description'
          helpText='Let others know what your preset does if its public'
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
  onSuccess: React.PropTypes.func.isRequired,
  /**
   * Preset object containing the properties of variables that xyButtons'
   * preset creation or modification API controller will expect.
   */
  preset: React.PropTypes.object
};

PresetForm.defaultProps = {
  preset: {
    name: '', urlMatch: '.*', description: '', domains: '*', isListed: false
  }
};

export default PresetForm;