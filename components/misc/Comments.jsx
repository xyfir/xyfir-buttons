import React, { PropTypes } from 'react';
import request from 'superagent';
import moment from 'moment';

// react-md
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers/Paper';

// Components
import Pagination from 'components/misc/Pagination';
import Creator from 'components/misc/Creator';
import Votes from 'components/misc/Votes';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

export default class Comments extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      comments: [], count: this.props.comments, editing: -1, show: false,
      lastId: (this.props.location.query.lastId || 0),
      order: 'created', direction: 'desc',
    };
  }

  /**
   * Make sure the query string's lastId variable matches this.state.lastId.
   */
  componentWillReceiveProps(props) {
    if (this.state.lastId != props.location.query.lastId) {
      this.setState({
        lastId: (props.location.query.lastId || 0)
      }, () => this._loadComments());
    }
  }

  /**
   * Updates this.state and calls this._loadComments().
   * @param {string} prop - The property name within this.state to set val to.
   * @param {any} val - The value to set to this.state at prop.
   */
  onFilter(prop, val) {
    this.setState({ [prop]: val }, () => this._loadComments());
  }

  /**
   * Set this.state.show and load initial comments.
   */
  onShowComments() {
    this.setState({ show: true });
    this._loadComments();
  }

  onCreate() {
    const { type, id } = this.props;

    request
      .post(`${XYBUTTONS_URL}api/comments/${type}/${id}`)
      .send({
        comment: this.refs.newComment._field.getValue()
      })
      .end((err, res) => {
        if (err || res.body.error)
          this.props.App._alert(res.body.message);
        else
          this._loadComments();
      });
  }

  /**
   * @param {number} id - The comment's id.
   */
  onDelete(id) {
    request
      .delete(`${XYBUTTONS_URL}api/comments/${id}`)
      .end((err, res) => {
        if (err || res.body.error)
          this.props.App._alert(res.body.message);
        else
          this._loadComments();
      });
  }

  /**
   * @param {number} id - The comment's id.
   */
  onEdit(id) {
    if (this.state.editing == id) {
      request
        .put(`${XYBUTTONS_URL}api/comments/${id}`)
        .send({
          comment: this.refs.editComment._field.getValue()
        })
        .end((err, res) => {
          this.setState({ editing: -1 });
          
          if (err || res.body.error)
            this.props.alert(res.body.message);
          else
            this._loadComments();
        });
    }
    else {
      this.setState({ editing: id });
    }
  }

  /**
   * Load comments based on properties of this.state.
   */
  _loadComments() {
    const { type, id } = this.props;

    request
      .get(`${XYBUTTONS_URL}api/comments/${type}/${id}`)
      .query({
        order: this.state.order, direction: this.state.direction,
        lastId: this.state.lastId
      })
      .end((err, res) => {
        if (!err && res.body.comments)
          this.setState({ comments: res.body.comments });
      });
  }

  _renderShowButton() {
    return (
      <Button
        raised
        label={`Show (${this.props.comments}) Comments`}
        onClick={() => this.onShowComments()}
      >comment</Button>
    )
  }

  _renderComments() {
    return (
      <Paper zDepth={1} className='comments'>
        <div className='add'>
          <TextField
            id='textarea--new-comment'
            ref='newComment'
            rows={10}
            type='text'
            label='Comment'
            className='md-cell create'
            lineDirection='right'
          />

          <Button
            raised
            label='Submit'
            onClick={() => this.onCreate()}
          >comment</Button>
        </div>

        <hr className='divider' />

        <div className='controls'>
          <SelectField
            id='select--order-by'
            label='Order By'
            value={this.state.order}
            menuItems={[
              { label: 'Votes', value: 'votes' },
              { label: 'Date Created', value: 'created' }
            ]}
            onChange={v => this.onFilter('order', v)}
            className='md-cell'
          />

          <SelectField
            id='select--order-direction'
            label='Order Direction'
            value={this.state.direction}
            menuItems={[
              { label: 'Ascending', value: 'asc' },
              { label: 'Descending', value: 'desc' }
            ]}
            onChange={v => this.onFilter('direction', v)}
            className='md-cell'
          />
        </div>

        <div className='comments-list'>{
          this.state.comments.map(c =>
            <Paper zDepth={2} className='comment' key={c.id}>
              {this.state.editing == c.id ? (
                <TextField
                  id='textarea--edit-comment'
                  ref='editComment'
                  rows={10}
                  type='text'
                  className='md-cell edit'
                  defaultValue={c.comment}
                  lineDirection='right'
                />
              ) : (
                <div className='content'>{c.comment}</div>
              )}

              <div className='info'>
                <span className='created' title={c.created}>{
                  moment(c.created).fromNow()
                }</span>

                <Creator {...c.creator} />

                <Votes
                  id={c.id} type={3} votes={c.votes}
                  alert={this.props.alert}
                />

                {this.props.storage.account.uid == c.creator.id
                && c.creator.id != 0 ? (
                  <div className='manage'>
                    <Button
                      flat
                      label={
                        this.state.editing == c.id ? 'Save' : 'Edit'
                      }
                      onClick={() => this.onEdit(c.id)}
                    >{
                      this.state.editing == c.id ? 'save' : 'mode_edit'
                    }</Button>

                    <Button
                      flat
                      label='Delete'
                      onClick={() => this.onDelete(c.id)}
                    >delete</Button>
                  </div>
                ) : <span />}
              </div>
            </Paper>
          )
        }</div>

        <Pagination
          lastId={(this.state.comments[24] || {}).id}
          onChange={id => this.setState({ lastId: id })}
          currentLastId={this.state.lastId}
        />
      </Paper>
    );
  }

  render() {
    return this.state.show ? this._renderComments() : this._renderShowButton();
  }

}

Comments.propTypes = {
  // ...this.props from parent
  id: PropTypes.number.isRequired,
  type: PropTypes.number.isRequired,
  alert: PropTypes.func.isRequired,
  comments: PropTypes.number.isRequired
};