import { useState } from 'react'
import ROSLIB from 'roslib';
import Rosconnection from './components/RosConnection';
import TpdoPublisher from './components/TpdoPublisher';

import RollerMotor from './components/RollerMotor';
import Temperature from './components/Temperature';
import Valve from './components/Valve';
import ReedSwitch from './components/ReedSwitch';
import PkgDisMotor from './components/PkgDisMotor';
import PillGateMotor from './components/PillGateMotor';
import PkgSquControl from './components/PkgSquControl';
import ConBeltControl from './components/ConBeltControl';
import PkgLenMotor from './components/PkgLenMotor';

import './css/App.css'

function App() {
  const [ros, setRos] = useState(null);

  return (
    <>
      <Rosconnection rosUrl="ws://192.168.9.13:9090" rosDomainId="1" setRos={setRos} />

      <div className="outContainer">
        <h3>ROS Connection:</h3>
        <div className='borderContainer'>
          <h4>ROS bridge IP: <input type="text" value="192.168.9.13" onChange={() => { }} /> </h4>
          <h4>Connection: <span id="status">N/A </span></h4>
        </div>
      </div>

      {
        ros &&
        <>
          <Temperature
            ros={ros}
            namespace={"packaging_machine_1"}
          />
          <Valve
            ros={ros}
            namespace={"packaging_machine_1"}
          />
          <ReedSwitch
            ros={ros}
            namespace={"packaging_machine_1"}
          />
          <PkgDisMotor
            ros={ros}
            namespace={"packaging_machine_1"}
          />
          <PillGateMotor
            ros={ros}
            namespace={"packaging_machine_1"}
          />
          <PkgSquControl
            ros={ros}
            namespace={"packaging_machine_1"}
          />
          <ConBeltControl
            ros={ros}
            namespace={"packaging_machine_1"}
          />
          <RollerMotor
            ros={ros}
            namespace={"packaging_machine_1"}
          />
          <PkgLenMotor
            ros={ros}
            namespace={"packaging_machine_1"}
          />
        </>
      }
    </>
  )
}

export default App
