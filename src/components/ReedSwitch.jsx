import React, { useState, useEffect } from 'react';
import ROSLIB from 'roslib';

function ReedSwitch({ros, namespace}) {
    const [reedSwitchState, setReedSwitchState] = useState(['Off', 'Off', 'Off', 'Off','Off', 'Off', 'Off', 'Off']);

    const ReedSwitchAddr = {
        1: 0x6060,
        2: 0x6061,
        3: 0x6062,
        4: 0x6063,
        5: 0x6064,
        6: 0x6065,
        7: 0x6066,
        8: 0x6067,
    };

    useEffect(() => {
        if (!ros) {
          return;
        }
    
        const intervals = Object.values(ReedSwitchAddr).map((address, index) => {
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
              setReedSwitchState((prevState) => {
                const updatedState = [...prevState];
                updatedState[index] = newState; 
                return updatedState;
              });
            });
          }, 2000);
        });
    
        return () => {
          intervals.forEach(clearInterval);
        };
      }, [ros, namespace]);

    return (
        <div className='outContainer'>
            <h3>Reed Switch:</h3>
            <table className='valueTable'>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>State</th>
                </tr>
                </thead>
                <tbody>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((valve) => (
                    <tr key={valve}>
                        <td>{valve}</td>
                        <td>{reedSwitchState[valve - 1]}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
    );
}

export default ReedSwitch;