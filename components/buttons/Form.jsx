import React from 'react';

// react-md
import { ExpansionList, ExpansionPanel } from 'react-md/lib/ExpansionPanels';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import Button from 'react-md/lib/Buttons/Button';

// Components
import ScriptEditor from 'components/editors/Script';
import StylesEditor from 'components/editors/Styles';
import IconEditor from 'components/editors/Icon';

class CreateOrEditButtonForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      scriptSource: 'Remote', toasts: [], optionalData1: false,
      optionalData2: false
    }
  }

  /**
   * Validate the provided data. If data is valid call this.props.onSuccess().
   */
  onValidate() {
    const data = {
      name: this.refs.name.value,
      urlMatch: this.refs.urlMatch.value,
      repository: (
        this.state.scriptSource == 'Remote'
          ? this.refs.repository.value : ''
      ), script: (
        this.state.scriptSource == 'Local'
          ? this.refs.scriptEditor.value : ''
      ),
    };
    
    if (this.state.optionalData1) {
      data.domains = this.refs.domains.value,
      data.isListed = this.refs.isListed.checked,
      data.description = this.refs.description.value;
    }

    if (this.state.optionalData2) {
      data.icon = this.refs.iconEditor.value,
      data.styles = this.refs.stylesEditor.value,
      data.tooltip = this.refs.tooltip.value;
    }

    const button = Object.assign({}, data);

    // Validate data
    try {
      if (!button.name)
        throw 'Button must have a name';
      if (button.name.length > 50)
        throw 'Button name limited to 50 characters';
      if (!button.uriMatch)
        throw 'URI match does not exist';
      if (button.uriMatch.length > 500)
        throw 'URI match value limited to 500 characters';
      if (!button.script && !button.repository)
        throw 'No script file or repository link provided';
      if (button.domains && button.length > 100)
        throw 'Domains list limited to 100 characters';
      
      if (button.script) {
        try {
          button.script = JSON.parse(button.script);
        }
        catch (e) {
          throw 'Invalid button script';
        }

        if (!button.script['main.js'])
          throw 'Button script must have a non-empty main.js file';
      }

      if (button.styles) {
        try {
          button.styles = JSON.parse(button.styles);
        }
        catch (e) {
          throw 'Invalid button styles';
        }
      }

      if (button.tooltip && button.tooltip.length > 255)
        throw 'Tooltip cannot be longer than 255 characters';
    }
    catch (e) {
      this.props.App.onAlert(e);
    }

    this.props.onSuccess(data);
  }

  render() {
    const b = this.props.button;

    return (
      <form onSubmit={(e) => this.onValidate(e)}>
        <TextField
            id='text--name'
            ref='name'
            type='text'
            label='Button Name'
            className='md-cell'
            defaultValue={b.name}
        />

        <TextField
            id='text--url-match'
            ref='urlMatch'
            type='text'
            label='URL Match Expression'
            helpText='Your button will only be injected if the url matches'
            className='md-cell'
            defaultValue={b.urlMatch}
        />

        <Divider />

        <SelectField
            id='select--script-source'
            label='Script Source'
            value={this.state.scriptSource}
            menuItems={[
                'Remote', 'Local'
            ]}
            onChange={v => this.setState({ scriptSource: v })}
            className='md-cell'
        />

        {this.state.scriptSource == 'remote' ? (
          <TextField
            id='text--repository'
            ref='repository'
            type='text'
            label='Repository'
            helpText='A GitHub gist repo to pull the button script from'
            className='md-cell'
            defaultValue={b.repository}
          />
        ) : (
          <ScriptEditor
            ref='scriptEditor'
            value={b.script}
            onError={this.props.App.onAlert}
          />
        )}

        <ExpansionList>
          <ExpansionPanel
            label='Optional Public Data'
            onExpandToggle={v => this.setState({ optionalData1: v })}
          >
            <Checkbox
              id='cb--is-listed'
              ref='isListed'
              name='cb--is-listed'
              label='Listed Publicly'
              defaultChecked={!!b.isListed}
            />

            <TextField
              id='textarea--description'
              ref='description'
              rows={10}
              type='text'
              label='Description'
              helpText='Let others know what your button does if its public'
              className='md-cell'
              defaultValue={b.description}
              lineDirection='right'
            />

            <TextField
              id='text--domains'
              ref='domains'
              type='text'
              label='Domains'
              helpText={
                'Domains that your button works on. Has no effect on button'
                + ' behavior. Use * for global or ** for too many sites to'
                + ' list.'
              }
              className='md-cell'
              defaultValue={b.domains}
            />
          </ExpansionPanel>

          <ExpansionPanel
            label='Optional Button Data'
            onExpandToggle={v => this.setState({ optionalData2: v })}
          >
            <TextField
              id='text--tooltip'
              ref='tooltip'
              type='text'
              label='Tooltip'
              helpText={
                'Text that is shown when the user hovers over your button'
              }
              className='md-cell'
              defaultValue={b.tooltip}
            />

            <StylesEditor ref='stylesEditor' value={b.styles} />
            <IconEditor ref='iconEditor' value={b.icon} />
          </ExpansionPanel>
        </ExpansionList>

        <Button raised label='Submit' onClick={() => this.onValidate()} />
      </form>
    );
  }

}

CreateOrEditButtonForm.propTypes = {
  /**
   * Called when provided data is valid. Passes button data object.
   */
  onSuccess: React.PropTypes.func.isRequired,
  /**
   * Button object containing the properties of variables that xyButtons'
   * button creation or modification API controller will expect.
   */
  button: React.PropTypes.object
};

CreateOrEditButtonForm.defaultProps = {
  button: {
    name: '', uriMatch: '.*', script: '', repository: '', description: '',
    domains: '*', isListed: false, tooltip: '', icon: '', styles: ''
  }
};

export default CreateOrEditButtonForm;