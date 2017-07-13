import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import Loader from './Loader';

const VALIDATE_URL = process.env.REACT_APP_VALIDATE_URL;

const TARGET_URL_PLACEHOLDER = 'http://code.jquery.com/jquery-1.9.1.min.js';

function Example(props) {
  let {name, url, version, onClick} = props;
  return (
    <li>
      <a href={url} onClick={onClick}>
        {name} ({version})
      </a>
    </li>
  );
}

const EXAMPLES = [
  {
    name: 'Underscore.js',
    version: '1.8.3',
    url: 'http://underscorejs.org/underscore-min.js'
  },
  {
    name: 'Bootstrap.js',
    version: '3.3.7',
    url: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'
  },
  {
    name: 'Raven.js',
    version: '3.17.0',
    url: 'https://cdn.ravenjs.com/3.17.0/raven.min.js'
  },
  {
    name: 'AngularJS',
    version: '1.5.6',
    url: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.min.js'
  }
];

class Home extends Component {
  constructor() {
    super();
    this.state = {
      targetUrl: '',
      loading: false
    };
  }

  handleSubmit(evt) {
    evt.preventDefault();

    const url = this.state.targetUrl || TARGET_URL_PLACEHOLDER;
    const {history} = this.props;

    this.setState({loading: true});

    fetch(`${VALIDATE_URL}?url=${encodeURIComponent(url)}`, {
      method: 'POST'
    }).then(response => {
      response.text().then(reportUrl => {
        history.push(`/report?reportUrl=${encodeURIComponent(reportUrl)}`);
      });
    });
  }

  handleExampleClick(evt, url) {
    evt.preventDefault();

    this.setState({targetUrl: url}, () => {
      this.handleSubmit(evt);
    });
  }

  render() {
    return this.state.loading
      ? <Loader />
      : <div>
          <div className="row">
            <form action="/validate" onSubmit={evt => this.handleSubmit(evt)}>
              <div className="col-md-10 form-group">
                <input
                  type="text"
                  className="form-control"
                  name="url"
                  value={this.state.targetUrl}
                  onChange={evt => this.setState({targetUrl: evt.target.value})}
                  placeholder={TARGET_URL_PLACEHOLDER}
                />
              </div>
              <div className="col-md-2">
                <button className="btn btn-default">Validate</button>
              </div>
            </form>
          </div>
          <h2>Examples</h2>
          <ul>
            {EXAMPLES.map(ex =>
              <Example {...ex} onClick={(evt) => this.handleExampleClick(evt, ex.url)} />
            )}
          </ul>
        </div>;
  }
}

export default withRouter(Home);