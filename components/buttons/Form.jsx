import PropTypes from 'prop-types';
import request from 'superagent';
import React from 'react';

// react-md
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import Button from 'react-md/lib/Buttons/Button';

// Components
import ScriptEditor from 'components/editors/Script';
import StylesEditor from 'components/editors/Styles';

// Modules
import buildFromRepo from 'lib/shared/buttons/build-from-repo';
import buildFromGist from 'lib/shared/buttons/build-from-gist';

export default class ButtonForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scriptSource: this.props.button.name
        ? this.props.button.repository
          ? 'Remote'
          : 'Local'
        : 'Remote'
    };
  }

  /**
   * Validate the provided data. If data is valid call this.props.onSuccess().
   * @param {Event} [e]
   */
  async onValidate(e) {
    e && e.preventDefault();

    const data = {
      icon: '',
      name: this.refs.name._field.getValue(),
      styles: this.refs.stylesEditor.value || '{}',
      script:
        this.state.scriptSource == 'Local' ? this.refs.scriptEditor.value : '',
      tooltip: this.refs.tooltip._field.getValue(),
      domains: this.refs.domains._field.getValue(),
      content: encodeURIComponent(this.refs.content._field.getValue()),
      urlMatch: this.refs.urlMatch._field.getValue(),
      repository:
        this.state.scriptSource == 'Remote'
          ? this.refs.repository._field.getValue()
          : '',
      description: this.refs.description._field.getValue()
    };

    const button = Object.assign({}, data);

    // Validate data
    try {
      if (!button.repository) {
        if (!button.name) throw 'Button must have a name';
        if (button.name.length > 100)
          throw 'Button name limited to 100 characters';
        if (!button.urlMatch) throw 'URL match does not exist';
        if (button.urlMatch.length > 1000)
          throw 'URL match value limited to 1000 characters';
        if (!button.script) throw 'No script file or repository link provided';
        if (button.domains && button.domains.length > 250)
          throw 'Domains list limited to 250 characters';

        if (button.script) {
          try {
            button.script = JSON.parse(button.script);
          } catch (e) {
            throw 'Invalid button script';
          }

          if (!button.script['main.js'])
            throw 'Button script must have a non-empty main.js file';
        }

        if (button.tooltip && button.tooltip.length > 255)
          throw 'Tooltip cannot be longer than 255 characters';
      }
      // Validate repo and code within it
      else {
        // $1 = not undefined if gist
        // $2 = user/repoId|gistId
        // $3 = user
        // $4 = repoId|gistId
        const regex = /^https:\/\/(gist\.)?github\.com\/((.+)\/(.+))/;
        const match = button.repository.match(regex);

        let url = 'https://api.github.com/',
          isGist = false;

        if (!match)
          throw 'Invalid repository link. Must be Github repo or Gist';
        else if (match[1] && match[4])
          (url += 'gists/' + match[4]), (isGist = true);
        else if (match[4]) url += 'repos/' + match[2] + '/contents';
        else throw 'Invalid Github repository or Gist link';

        const res = await request.get(url);

        if (isGist) data.script = buildFromGist(res.body);
        else Object.assign(data, await buildFromRepo(url, res.body));

        data.script = JSON.stringify(data.script);
      }

      this.props.onSuccess(data);
    } catch (e) {
      console.error('components/buttons/Form.jsx', e);
      this.props.App._alert(e.toString());
    }
  }

  render() {
    const b = this.props.button;

    return (
      <form onSubmit={e => this.onValidate(e)}>
        <h2>Required Data</h2>

        <TextField
          id="text--name"
          ref="name"
          type="text"
          label="Button Name"
          className="md-cell"
          defaultValue={b.name}
        />

        <TextField
          id="text--url-match"
          ref="urlMatch"
          type="text"
          label="URL Match Expression"
          helpText="Your button will only be injected if the url matches"
          className="md-cell"
          defaultValue={b.urlMatch}
        />

        <SelectField
          id="select--script-source"
          label="Script Source"
          value={this.state.scriptSource}
          menuItems={['Remote', 'Local']}
          onChange={v => this.setState({ scriptSource: v })}
          className="md-cell"
        />

        {this.state.scriptSource == 'Remote' ? (
          <TextField
            id="text--repository"
            ref="repository"
            type="text"
            label="Repository"
            helpText="A GitHub repo or Gist to pull the button script from"
            className="md-cell"
            defaultValue={b.repository}
          />
        ) : (
          <ScriptEditor
            ref="scriptEditor"
            value={b.script}
            onError={this.props.App._alert}
          />
        )}

        <hr className="divider" />

        <h2>Optional Data</h2>

        <TextField
          id="textarea--description"
          ref="description"
          rows={10}
          type="text"
          label="Description"
          maxRows={20}
          className="md-cell"
          defaultValue={b.description}
          lineDirection="right"
        />

        <TextField
          id="text--domains"
          ref="domains"
          type="text"
          label="Domains"
          helpText={
            'Domains that your button works on. Has no effect on button' +
            ' behavior. Use * for global or ** for too many sites to' +
            ' list.'
          }
          className="md-cell"
          defaultValue={b.domains}
        />

        <hr className="divider" />

        <TextField
          id="text--tooltip"
          ref="tooltip"
          type="text"
          label="Tooltip"
          helpText={'Text that is shown when the user hovers over your button'}
          className="md-cell"
          defaultValue={b.tooltip}
        />

        <TextField
          id="text--content"
          ref="content"
          type="text"
          label="Button Content"
          helpText={
            'The text content of the button; all characters / emojis accepted.' +
            'An image in base64 format is also accepted as an icon.'
          }
          className="md-cell"
          defaultValue={decodeURIComponent(b.content)}
        />

        <StylesEditor ref="stylesEditor" value={b.styles} />

        <hr className="divider" />

        <Button
          raised
          primary
          label="Submit"
          onClick={() => this.onValidate()}
        />
      </form>
    );
  }
}

ButtonForm.propTypes = {
  /**
   * Called when provided data is valid. Passes button data object.
   */
  onSuccess: PropTypes.func.isRequired,
  /**
   * Button object.
   */
  button: PropTypes.object
};

ButtonForm.defaultProps = {
  button: {
    name: '',
    urlMatch: '.*',
    script: '',
    repository: '',
    description: '',
    domains: '*',
    tooltip: '',
    content: '',
    styles: ''
  }
};
