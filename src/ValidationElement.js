import React from 'react';


class ValidationElement extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    switch (this.props.validationType) {
      case 'ServiceStatus':
        return (
          <li>ServiceStatus
          </li>);
        break;
      case 'CommandsReturn':
        return (
          <li>
            `
            <pre style={{display: 'inline'}}>
              {this.props.value.Command}
            </pre>&nbsp;
            {Array.isArray(this.props.value.Arguments) && this.props.value.Arguments.map(a => (
              <pre style={{display: 'inline'}}>{a}</pre>
            ))}
            `
            &nbsp;
            <em>{('Match' in this.props.value) ? '==' : ('Like' in this.props.value) ? '=~' : '???'}</em>&nbsp;
            {
              ('Match' in this.props.value)
                ? <pre style={{display: 'inline'}}>'{this.props.value.Match}'</pre>
                : ('Like' in this.props.value)
                  ? <pre style={{display: 'inline'}}>'{this.props.value.Like}'</pre>
                  : '???'
            }
          </li>);
        break;
      default:
        return (
          <li>
            {(typeof this.props.value === 'string' || this.props.value instanceof String)
                ? <pre style={{display: 'inline'}}>{this.props.value}</pre>
                : ''
            }
          </li>);
        break;
    }
  }
}

export default ValidationElement;