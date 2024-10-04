import React, { useEffect, useState } from 'react';
import ROSLIB from 'roslib';

import { Button, Form, Table } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

const Temperature = ({ros, namespace}) => {
  const [tpdoPublisher, setTpdoPublisher] = useState(null);
  const [temperature, setTemperature] = useState(0);

  useEffect(() => {
    if (!ros) {
      return;
    }

    const tpdo = new ROSLIB.Topic({
      ros: ros,
      name: '/' + namespace + '/tpdo',
      messageType: 'canopen_interfaces/msg/COData',
    });

    setTpdoPublisher(tpdo);

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
    })

    return () => {
      tpdo.unadvertise();
      setTpdoPublisher(null);
    };
  }, [ros]);

  const sendTpdo = (index, subindex, data) => {
    const msg = new ROSLIB.Message({
      index: index,
      subindex: subindex,
      data: data,
    });
    console.log('ok')
    tpdoPublisher.publish(msg);
  };

  return (
    <Card className="mb-4" style={{ width: '48rem' }}>
      <Card.Body>
        Temperature: {temperature}/125 
      </Card.Body>
      <Button
          variant="outline-secondary"
          onClick={() => sendTpdo(0x6003, 0, 1)}
          style={{ marginLeft: '0.5rem' }}
        >
        Heat On
      </Button>
      <Button
        variant="outline-secondary"
        onClick={() => sendTpdo(0x6003, 0, 0)}
        style={{ marginLeft: '0.5rem' }}
      >
        Heat Off
      </Button>
    </Card>
  )

}

export default Temperature