import React, { useEffect, useState } from 'react';
import ROSLIB from 'roslib';

const Temperature = ({ros, namespace}) => {
  const [temperature, setTemperature] = useState(999);

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
      switch (msg.index)
      {
        case 0x6001:
          setTemperature(msg.data);
          break;
      }
      // rpdo.unsubscribe();
    })

  }, []);

  return (
    <div className='outContainer'>
      <h3>Heater:</h3>
      <div className="borderContainer">
        <h4>Temperature : {temperature} / 125 </h4>
      </div>
    </div>
  )
}

export default Temperature