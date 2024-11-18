import React, { useState, useEffect } from 'react';
import ROSLIB from 'roslib';

function PillGateMotor({ ros, namespace }) {
  const [pulses, setPulses] = useState(2241);
  const [currPulses, setCurrPulses] = useState(0);
  const [mode, setMode] = useState(0);
  const [state, setState] = useState(0);
  const [sdoWriter, setSdoWriter] = useState(null);

  const pillGateAddr = {
    0: 0x6024,
    1: 0x6027,
    2: 0x6028
  }

  useEffect(() => {
    if (!ros) {
      return;
    }

    const intervals = Object.values(pillGateAddr).map((address, index) => {
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
              setCurrPulses(result.data);
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
      <h3>Pill Gate Control (3號電機):</h3>
      <div className="borderContainer">
        <table>
          <tbody>
            <tr>
              <td>Pulses:</td>
              <td>
                {/* <input type="text" value={pulses} onChange={(e) => setPulses(parseInt(e.target.value))} /> */}
              </td>
              <td>
                {/* <div className="btn" onClick={() => sendSDO(0x6021, 0, pulses)}>Set</div> */}
              </td>
            </tr>
            <tr>
              <td>Direction:</td>
              <td style={{ display: "flex" }}>
                {/* <div className="btn" onClick={() => sendSDO(0x6022, 0, 1)}>Release</div>
                <div className="btn" onClick={() => sendSDO(0x6022, 0, 0)}>Home Dir</div> */}
              </td>
            </tr>
            <tr>
              <td>Current Pulse:</td>
              <td>
                {currPulses}
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
              <td>Control:</td>
              <td style={{ display: "flex" }}>
                {/* <div className="btn" onClick={() => {
                  sendSDO(0x6029, 0, 1);
                }}>Start</div> */}
                <div className="btn" onClick={() => {
                  sendSDO(0x6021, 0, 2241)
                  sendSDO(0x6022, 0, 1)
                  sendSDO(0x6029, 0, 1);
                }}>Open</div>
                <div className="btn" onClick={() => {
                  sendSDO(0x6021, 0, 9143)
                  sendSDO(0x6022, 0, 0)
                  sendSDO(0x6029, 0, 1);
                }}>Close</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PillGateMotor;