import { useState } from 'react'

import ROSLIB from 'roslib';

import Rosconnection from './components/RosConnection';
import TpdoPublisher from './components/TpdoPublisher';

import Temperature from './components/Temperature';
import Valve from './components/Valve';

import { Row, Col } from 'react-bootstrap';

import './App.css'
import RollerMotor from './components/RollerMotor';

function App() {
  const [ros, setRos] = useState(null);

  return (
    <>
      <Rosconnection rosUrl="ws://192.168.0.106:9090" rosDomainId="1" setRos={setRos} />

      <div>
        <h4>ROS bridge: <input type="text" value="192.168.0.106" /> </h4>
      </div>
      <h4>Connection: <span id="status">N/A</span></h4>
      {
        ros &&
        <>
          <Row>
            <Temperature 
              ros={ros} 
              namespace={"packaging_machine_1"} 
            />
          </Row>
          <Row>
            <Valve 
              ros={ros} 
              namespace={"packaging_machine_1"}
            />
          </Row>
          {/* <Row>
            <RollerMotor 
              ros={ros} 
              namespace={"packaging_machine_1"}
            />
          </Row> */}
        </>
      }
    </>
  )
}

export default App
