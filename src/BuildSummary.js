import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ManifestComponentElement from './ManifestComponentElement';


class BuildSummary extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      amis: [],
      task: null,
      run: null,
      components: []
    };
    this.queryTaskcluster = this.queryTaskcluster.bind(this);
  }
  
  componentDidMount() {
    this.queryTaskcluster();
  }
  
  queryTaskcluster() {
    fetch('https://firefox-ci-tc.services.mozilla.com/api/queue/v1/task/' + this.props.build.task + '/status')
      .then(response => response.json())
      .then(container => {
        let lastRun = container.status.runs[container.status.runs.length - 1];
        if (lastRun.state === 'completed') {
          fetch('https://firefox-ci-tc.services.mozilla.com/api/queue/v1/task/' + this.props.build.task + '/runs/' + lastRun.runId + '/artifacts/public/ami-list.json')
            .then(response => response.json())
            .then(amis => {
              let task, run;
              [task, run] = amis['us-west-2'][0].build.split('/');
              this.setState(x => {
                x.amis = amis;
                x.task = task;
                x.run = run;
                return x;
              });
              fetch('https://raw.githubusercontent.com/mozilla-releng/OpenCloudConfig/' + amis['us-west-2'][0].revision + '/userdata/Manifest/' + this.props.build.worker + '.json')
                .then(response => response.json())
                .then(manifest => {
                  manifest.Components.sort((a, b) => {
                    return (a.ComponentType + a.ComponentName < b.ComponentType + b.ComponentName) ? -1 : 1;
                  });
                  this.setState(x => {
                    x.components = manifest.Components;
                    return x;
                  });
                });
            });
        }
      });
  }
  render() {
    return (
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey={this.props.build.worker}>
              <strong style={{fontSize: 'larger'}}>{this.props.build.worker}</strong>
            </Accordion.Toggle>
            <div className="float-right text-right muted">
              <small>
                occ revision:&nbsp;
                <a href={'https://github.com/mozilla-releng/OpenCloudConfig/commit/' + (this.state.amis['us-west-2'] && this.state.amis['us-west-2'][0].revision)}>
                  {this.state.amis['us-west-2'] && this.state.amis['us-west-2'][0].revision}
                </a>
                <br />
                tc build:&nbsp;
                <a href={'https://firefox-ci-tc.services.mozilla.com/tasks/' + this.state.task}>
                  {this.state.task}
                </a>
                <br />
                last update: {this.state.amis['us-west-2'] && (new Date(this.state.amis['us-west-2'][0].created)).toLocaleDateString()}
              </small>
            </div>
          </Card.Header>
          <Accordion.Collapse eventKey={this.props.build.worker}>
            <Card.Body>
              <ul>
                <dt>
                  latest occ build trigger commits:
                </dt>
                <dd>
                  <ul>
                  {this.state.amis['us-west-2'] && this.state.amis['us-west-2'].map(uswest2ami => (
                    <li key={uswest2ami.revision}>
                      <a href={'https://github.com/mozilla-releng/OpenCloudConfig/commit/' + (uswest2ami.revision)}>
                        {uswest2ami.revision}
                      </a> {(new Date(uswest2ami.created)).toLocaleDateString()}
                    </li>
                  ))}
                  </ul>
                </dd>
                <dt>
                  last taskcluster ami build task:
                </dt>
                <dd>
                  <a href={'https://firefox-ci-tc.services.mozilla.com/tasks/' + this.state.task}>
                    {this.state.task}
                  </a>
                </dd>
                <dt>
                  last ec2 ami deployments ({this.state.amis['us-west-2'] && (new Date(this.state.amis['us-west-2'][0].created)).toLocaleDateString()}):
                </dt>
                <dd>
                  <ul>
                    {Object.keys(this.state.amis).map(region => (
                      <li key={this.state.amis[region][0].id}>
                        {region} /&nbsp;
                        <a href={'https://' + region + '.console.aws.amazon.com/ec2/v2/home?region=' + region + '#Images:imageId=' + this.state.amis[region][0].id}>
                          {this.state.amis[region] && this.state.amis[region][0].id}
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
                <dt>
                  image bootstrap components&nbsp;
                  (
                    <a href={'https://github.com/mozilla-releng/OpenCloudConfig/blob/' + (this.state.amis['us-west-2'] && this.state.amis['us-west-2'][0].revision) + '/userdata/Manifest/' + this.props.build.worker + '.json'}>
                      manifest/{this.props.build.worker}.json
                    </a>
                  ):
                </dt>
                <dd>
                  <Accordion>
                    {
                      this.state.components.map(c => c.ComponentType).filter((v, i, s) => s.indexOf(v) === i).map(ct => (
                        <Card key={ct}>
                          <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey={this.props.build.worker + '_' + ct}>
                              {ct}
                            </Accordion.Toggle> ({this.state.components.filter(c => c.ComponentType === ct).length} components)
                          </Card.Header>
                          <Accordion.Collapse eventKey={this.props.build.worker + '_' + ct}>
                            <ul>
                              {this.state.components.filter(c => c.ComponentType === ct).map(component => (
                                <li key={component.ComponentType + '_' + component.ComponentName}>
                                  {component.ComponentName}
                                  <ul>
                                    {Object.keys(component).filter(k => k !== 'ComponentType' && k !== 'ComponentName').map(key => (
                                      <ManifestComponentElement name={key} value={component[key]} key={key} />
                                    ))}
                                  </ul>
                                </li>
                              ))}
                            </ul>
                          </Accordion.Collapse>
                        </Card>
                      ))
                    }
                  </Accordion>
                </dd>
              </ul>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
    );
  }
}

export default BuildSummary;
