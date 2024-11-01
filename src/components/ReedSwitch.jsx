import React, { useState, useEffect } from 'react';
import ROSLIB from 'roslib';

function ReedSwitch({ ros, namespace }) {
  const [reedSwitchState, setReedSwitchState] = useState(Array(8).fill('Off'));

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
        case 0x6068:
          const newStates = Array.from({ length: 8 }, (_, index) =>
            (msg.data & (1 << index)) ? 'On' : 'Off'
          );
          setReedSwitchState(newStates.reverse());
          break;
      }
    });

    return () => {
      rpdo.unsubscribe();
    };

  }, []);

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