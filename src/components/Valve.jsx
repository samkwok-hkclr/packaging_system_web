import React, { useEffect, useState } from 'react';
import ROSLIB from 'roslib';

const Valve = ({ros, namespace}) => {
  const [valveState, setValveState] = useState(['Off', 'Off', 'Off', 'Off']);
  const [sdoWriter, setSdoWriter] = useState(null);

  const valveCtrlAddr = {
    1: 0x6050,
    2: 0x6051,
    3: 0x6052,
    4: 0x6053,
  };

  const valveStateAddr = {
    1: 0x6054,
    2: 0x6055,
    3: 0x6056,
    4: 0x6057,
  };

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

  useEffect(() => {
    if (!ros) {
      return;
    }

    const intervals = Object.values(valveStateAddr).map((address, index) => {
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
          const newState = result.data ? 'On' : 'Off';
          setValveState((prevState) => {
            const updatedState = [...prevState];
            updatedState[index] = newState; 
            return updatedState;
          });
        });
      }, 1000);
    });

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [ros, namespace]);

  const sendSDO = ((index, subindex, data)=> {
    
    const request = new ROSLIB.ServiceRequest({
      index: index,
      subindex: subindex,
      data:data
    });
    
    sdoWriter.callService(request, (result) => {
    });
  })

  return (
    <div className='outContainer'>
      <h3>Solenoid Value:</h3>
      <table className='valueTable'>
        <thead>
          <tr>
            <th>ID</th>
            <th>State</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4].map((valve) => (
            <tr key={valve}>
              <td>{valve}</td>
              <td>{valveState[valve - 1]}</td>
              <td>
                <button
                  onClick={() => sendSDO(valveCtrlAddr[valve], 0, 1)}
                  className={`btn ${valveState[valve - 1]==='On'?'chosen':''}`}
                >
                  On
                </button>
                <button
                  onClick={() => sendSDO(valveCtrlAddr[valve], 0, 0)}
                  className={`btn ${valveState[valve - 1]==='Off'?'chosen':''}`}
                >
                  Off
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Valve