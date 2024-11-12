import React, { useEffect, useState } from 'react';
import ROSLIB from 'roslib';

const Temperature = ({ ros, namespace }) => {
  const [temperature, setTemperature] = useState(999);
  const [control, setControl] = useState(999);
  const [sdoWriter, setSdoWriter] = useState(null);

  useEffect(() => {
    if (!ros) {
      return;
    }

    const rpdo = new ROSLIB.Topic({
      ros: ros,
      name: '/' + namespace + '/rpdo',
      messageType: 'canopen_interfaces/msg/COData',
    });

    rpdo.subscribe((msg) => {
      switch (msg.index) {
        case 0x6001:
          setTemperature(msg.data);
          break;
        case 0x6008:
          setControl(msg.data);
          break;
      }
      // rpdo.unsubscribe();
    })

    return () => {
      rpdo.unsubscribe();
    };
  }, []);

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
    <div className='outContainer'>
      <h3>Heater:</h3>
      <div className="borderContainer">
        <table>
          <tbody>
            <tr>
              <td>
                <div className="borderContainer">
                  <h4>Temperature : {temperature} / 125 </h4>
                  <h4>Control : {control} / 2000 </h4>
                </div>
              </td>
              <td style={{ display: "flex" }}>
                <div className="btn" onClick={() => sendSDO(0x6003, 0, 1)}>On</div>
                <div className="btn" onClick={() => sendSDO(0x6003, 0, 0)}>Off</div>
              </td>
            </tr>


          </tbody>
        </table>
      </div>


    </div>
  )
}

export default Temperature