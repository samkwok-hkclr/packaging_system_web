import React, { useState, useEffect } from 'react';
import ROSLIB from 'roslib';

function PkgLenMotor({ ros, namespace }) {
  const [steps, setSteps] = useState(1);
  const [speed, setSpeed] = useState(100);
  const [targetMode, setTargetMode] = useState(0);
  const [currSteps, setCurrSteps] = useState(999);
  const [mode, setMode] = useState(999);
  const [state, setState] = useState(999);
  const [sdoWriter, setSdoWriter] = useState(null);

  const PkgLenrAddr = {
    0: 0x6043,
    1: 0x6047,
    2: 0x6048
  }

  useEffect(() => {
    if (!ros) {
      return;
    }

    const intervals = Object.values(PkgLenrAddr).map((address, index) => {
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
      <h3>Packaging Length Control (6號電機):</h3>
      <div className="borderContainer">
        <table>
          <tbody>
            <tr>
              <td>Steps:</td>
              <td>
                <input type="text" value={steps} onChange={(e) => setSteps(parseInt(e.target.value))} />
              </td>
              <td>
                <div className="btn" onClick={() => sendSDO(0x6040, 0, steps)}>Set</div>
              </td>
            </tr>
            <tr>
              <td>Speed:</td>
              <td>
                <input type="text" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} />
              </td>
              <td>
                <div className="btn" onClick={() => sendSDO(0x6041, 0, speed)}>Set</div>
              </td>
            </tr>
            <tr>
              <td>Mode:</td>
              <td style={{ display: "flex" }}>
                <div className="btn" onClick={() => sendSDO(0x6047, 0, 0)}>0</div>
                <div className="btn" onClick={() => sendSDO(0x6047, 0, 1)}>1</div>
                {/* <div className="btn" onClick={() => sendSDO(0x6047, 0, 2)}>2</div> */}
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
                  sendSDO(0x6042, 0, 0);
                  sendSDO(0x6049, 0, 1);
                }}>Fwd</div>
                <div className="btn" onClick={() => {
                  sendSDO(0x6042, 0, 1);
                  sendSDO(0x6049, 0, 1);
                }}>Rev</div>
              </td>
              <td colSpan={2}>
                <div className="btn bg-red" onClick={() => sendSDO(0x6049, 0, 0)}>Stop</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PkgLenMotor;