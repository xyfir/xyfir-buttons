import React from 'react';
import request from 'superagent';

// react-md
import ListItem from 'react-md/lib/Lists/ListItem';
import Paper from 'react-md/lib/Papers';
import List from 'react-md/lib/Lists/List';

// Constants
import { XYDOCS_URL } from 'constants/config';

export default class DocumentationList extends React.Component {

  constructor(props) {
    super(props);

    this.state = { files: [] };
  }

  componentDidMount() {
    request
      .get(XYDOCS_URL + 'projects.json')
      .end((err, res) => {
        if (err) return;

        const files = [], docs = JSON.parse(window.atob(res.body.content))
          ['xyfir-buttons'].documentation;

        Object.keys(docs).forEach(file => {
          if (file == 'legal') return;

          files.push(docs[file]);
        });

        this.setState({ files });
      });
  }

  render() {
    const files = this.state.files;
    
    if (!files.length) return <div />;

    return (
      <Paper zDepth={1} className='documentation-list'>
        <List>{
          files.map(file =>
            <ListItem
              key={file.location}
              onClick={() => location.hash += '/view?file=' + file.location}
              primaryText={file.name}
              secondaryText={file.description}
            />
          )
        }</List>
      </Paper>
    );
  }

}