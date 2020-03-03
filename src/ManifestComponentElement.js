import React from 'react';
import ValidationElement from './ValidationElement';


class ManifestComponentElement extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    switch (this.props.name) {
      case 'Arguments':
        return (
          <li>
            Arguments:&nbsp;
            {Array.isArray(this.props.value) && this.props.value.map(a => (
              <pre style={{display: 'inline'}}>{a}&nbsp;</pre>
            ))}
          </li>);
        break;
      case 'Command':
      case 'ValueData':
      case 'Key':
      case 'ProductId':
      case 'Target':
      case 'Link':
        return (
          <li>
            {this.props.name}: <pre style={{display: 'inline'}}>{this.props.value}</pre>
          </li>);
        break;
      case 'DependsOn':
        return (
          <li>
            dependencies:
            <ul>
              {this.props.value.map(d => (
                <li>{d.ComponentType} / {d.ComponentName}</li>
              ))}
            </ul>
          </li>);
        break;
      case 'Validate':
        return (
          <li>
            Validate:
            <ul>
              {Object.keys(this.props.value).map(validationType => (
                <li>
                  {validationType}:
                  <ul>
                    {this.props.value[validationType].map((v, i) => (
                      <ValidationElement validationType={validationType} value={v} key={i} />
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>);
        break;
      default:
        return (
          <li>
            {this.props.name}: {(typeof this.props.value === 'string' || this.props.value instanceof String) ? this.props.value : ''}
          </li>);
        break;
    }
  }
}

export default ManifestComponentElement;