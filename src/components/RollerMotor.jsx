import React, { useEffect, useState } from 'react';
import ROSLIB from 'roslib';

const RollerMotor = ({ ros, namespace }) => {
  const [steps, setSteps] = useState(1);
  const [speed, setSpeed] = useState(100);
  const [currSteps, setCurrSteps] = useState(999);
  const [mode, setMode] = useState(999);
  const [state, setState] = useState(999);
  const [sdoWriter, setSdoWriter] = useState(null);

  const rollerAddr = {
    0: 0x6033,
    1: 0x6037,
    2: 0x6038
  }

  useEffect(() => {
    if (!ros) {
      return;
    }

    const intervals = Object.values(rollerAddr).map((address, index) => {
      return setInterval(() => {
        const sdoRead = new ROSLIB.Service({
          ros: ros,
          name: '/' + namespace + '/sdo_read',
          serviceType: 'canopen_interfaces/srv/CORead',
        });

        const request = new ROSLIB.ServiceRequest({
          index: address,
          subindex: 0,
        });

        sdoRead.callService(request, (result) => {
          switch (index) {
            case 0:
              setCurrSteps(result.data);
              break;
            case 1:
              setMode(result.data);
              break;
            case 2:
              setState(result.data);
              break;
          }
        });
      }, 1000);
    });

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [ros, namespace]);

  useEffect(() => {
    if (!ros) {
      return;
    }

    const sdoWrite = new ROSLIB.Service({
      ros: ros,
      name: '/' + namespace + '/sdo_write',
      serviceType: 'canopen_interfaces/srv/COWrite',
    });

    setSdoWriter(sdoWrite);

    return () => {
    };
  }, [ros, namespace]);

  const sendSDO = ((index, subindex, data) => {
    const request = new ROSLIB.ServiceRequest({
      index: index,
      subindex: subindex,
      data: data
    });

    sdoWriter.callService(request, (result) => {
      console.log(result.success);
    });
  })

  return (
    <div className="outContainer">
      <h3>Roller Control (5號電機):</h3>
      <div className="borderContainer">
        <table>
          <tbody>
            <tr>
              <td>Steps:</td>
              <td>
                {/* <input type="text" value={steps} onChange={(e) => setSteps(parseInt(e.target.value))} /> */}
              </td>
              <td>
                {/* <div className="btn" onClick={() => sendSDO(0x6030, 0, steps)}>Set</div> */}
              </td>
            </tr>
            <tr>
              <td>Speed:</td>
              <td>
                {/* <input type="text" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} /> */}
              </td>
              <td>
                {/* <div className="btn" onClick={() => sendSDO(0x6031, 0, speed)}>Set</div> */}
              </td>
            </tr>
            <tr>
              <td>Current Steps:</td>
              <td>
                {currSteps}
              </td>
            </tr>
            <tr>
              <td>Mode:</td>
              <td>
                {mode}
              </td>
            </tr>
            <tr>
              <td>State:</td>
              <td>
                {state}
              </td>
            </tr>
            <tr>
              <td style={{ display: "flex" }}>
                <div className="btn" onClick={() => {
                  sendSDO(0x6030, 0, 1);
                  sendSDO(0x6032, 0, 0);
                  sendSDO(0x6037, 0, 0);
                  sendSDO(0x6039, 0, 1);
                }}>Move</div>
                {/* <div className="btn" onClick={() => {
                  sendSDO(0x6032, 0, 1);
                  sendSDO(0x6037, 0, 0);
                  sendSDO(0x6039, 0, 1);
                }}>Rev</div> */}
                <div className="btn" onClick={() => {
                  sendSDO(0x6030, 0, 1);
                  sendSDO(0x6032, 0, 0);
                  sendSDO(0x6037, 0, 1);
                  sendSDO(0x6039, 0, 1);
                }}>Home</div>
              </td>
              <td colSpan={2}>
                <div className="btn bg-red" onClick={() => sendSDO(0x6039, 0, 0)}>Stop</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RollerMotor