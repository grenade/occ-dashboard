import React from 'react';
import BuildSummary from './BuildSummary';

import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import './App.css';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      builds: []
    };
    this.queryTaskcluster = this.queryTaskcluster.bind(this);
  }
  
  componentDidMount() {
    this.queryTaskcluster();
  }
  
  queryTaskcluster() {
    fetch('https://firefox-ci-tc.services.mozilla.com/api/index/v1/tasks/project.releng.opencloudconfig.v1.revision.latest')
      .then(response => response.json())
      .then(container => {
        this.setState(x => { x.builds = container.tasks.map(t => ({
          worker: t.namespace.split('.')[6],
          task: t.taskId
        })); return x; });
      });
  }
  render() {
    return (
      <Container>
        <Row>
          <h2>ami builds</h2>
        </Row>
        <Accordion defaultActiveKey="0">
        {
          this.state.builds.map(build => (
            <BuildSummary build={build} key={build.worker} />
          ))
        }
        </Accordion>
      </Container>
    );
  }
}

export default App;
