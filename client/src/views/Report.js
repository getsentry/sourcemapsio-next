import React, {Component} from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import Loader from './Loader';

function Entry(props, index) {
  const {name, message, resolutions} = props;

  const htmlMessage = message.replace(/(https?\S+)/g, '<a href="$1">$1</a>');
  return (
    <li key={index}>
      <h4>
        {name}
      </h4>
      <p dangerouslySetInnerHTML={{__html: htmlMessage}} />
      {resolutions &&
        <div>
          <h5>Resolutions</h5>
          <ul>
            {resolutions.map((res, i) =>
              <li key={i} dangerouslySetInnerHTML={{__html: res}} />
            )}
          </ul>
        </div>}
      {'column' in props &&
        'line' in props &&
        <div>
          <div>
            {props.source}, Line {props.line}, Column {props.column}
          </div>
          <div>
            Expected <code>{props.expected}</code>
          </div>
          <div>
            Got <code>{props.token}</code>
          </div>
        </div>}
    </li>
  );
}

Entry.propTypes = {
  name: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  resolutions: PropTypes.array,
  source: PropTypes.string,
  column: PropTypes.number,
  line: PropTypes.line,
  expected: PropTypes.string,
  token: PropTypes.string
};

class Report extends Component {
  constructor(props) {
    super(props);
    const {reportUrl} = queryString.parse(props.location.search);
    this.state = {reportUrl, report: null};
  }

  componentDidMount() {
    fetch(this.state.reportUrl).then((response) => {
      response.json().then((report) => {
        this.setState({report});
      });
    });
  }

  renderAlert() {
    const {report} = this.state;
    if (!report) return null;

    return report.errors.length === 0
      ? <div className="alert alert-success"><strong>Bingo.</strong> Everything looks good.</div>
      : <div className="alert alert-danger"><strong>Ouch.</strong> Check the errors below.</div>;
  }

  render() {
    const {report} = this.state;

    return !report
      ? <Loader />
      : <div>
        {this.renderAlert()}
        <h1>Report</h1>
        {report &&
            <div>
              <p>
                <a href={report.url}>
                  {report.url}
                </a>
              </p>
              <h3>Sources</h3>
              <ul>
                {report.sources.map(src =>
                  <li key={src}>
                    {src}
                  </li>
                )}
              </ul>
              <h3>Errors</h3>
              <ul>
                {report.errors.length ? report.errors.map(Entry) : <span>No errors</span>}
              </ul>
              <h3>Warnings</h3>
              <ul>
                {report.warnings.length
                  ? report.warnings.map(Entry)
                  : <span>No warnings</span>}
              </ul>
            </div>}
      </div>;
  }
}

Report.propTypes = {
  location: PropTypes.object
};

export default Report;
