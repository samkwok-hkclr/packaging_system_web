import React, { useState, useEffect } from 'react';
import ROSLIB from 'roslib';

function ConBeltControl({ ros, namespace }) {
  const [speed, setSpeed] = useState(1000);
  const [dir, setDir] = useState(0);
  const [stop, setStop] = useState(0);
  const [state, setState] = useState(999);
  const [sdoWriter, setSdoWriter] = useState(null);

  const conBeltAddr = {
    1: 0x6088
  }

  useEffect(() => {
    if (!ros) {
      return;
    }

    const intervals = Object.values(conBeltAddr).map((address, index) => {
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
          if (index === 0)
            setState(result.data);

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
      <h3>Conveyor Belt Control (1號電機):</h3>
      <div className="borderContainer">
        <table>
          <tbody>
            <tr>
              <td>Speed:</td>
              <td>
                <input type="text" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} />
              </td>
              <td>
                <div className="btn" onClick={() => sendSDO(0x6080, 0, speed)}>Set</div>
              </td>
            </tr>
            <tr>
              <td>Stop by Ph:</td>
              <td style={{ display: "flex" }}>
                <div className="btn" onClick={() => sendSDO(0x6081, 0, 0)}>0</div>
                <div className="btn" onClick={() => sendSDO(0x6081, 0, 1)}>1</div>
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
                  sendSDO(0x6082, 0, 0);
                  sendSDO(0x6089, 0, 1);
                }}>Fwd</div>
                <div className="btn" onClick={() => {
                  sendSDO(0x6082, 0, 1);
                  sendSDO(0x6089, 0, 1);
                }}>Rev</div>
              </td>
              <td colSpan={2}>
                <div className="btn bg-red" onClick={() => sendSDO(0x6089, 0, 0)}>Stop</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ConBeltControl;