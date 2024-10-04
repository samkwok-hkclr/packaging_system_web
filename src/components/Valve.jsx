import React, { useEffect, useState } from 'react';
import ROSLIB from 'roslib';

import { Button, Form, Table } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

const Valve = ({ros, namespace}) => {
  const [tpdoPublisher, setTpdoPublisher] = useState(null);
  const [valve1Status, setValve1Status] = useState('Off');
  const [valve2Status, setValve2Status] = useState('Off');
  const [valve3Status, setValve3Status] = useState('Off');
  const [valve4Status, setValve4Status] = useState('Off');

  const valveAddresses = {
    1: 0x6050,
    2: 0x6051,
    3: 0x6052,
    4: 0x6053,
  };

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
        case 0x6054:
          setValve1Status(msg.data ? 'On' : 'Off');
          break;
        case 0x6055:
          setValve2Status(msg.data ? 'On' : 'Off');
          break;
        case 0x6056:
          setValve3Status(msg.data ? 'On' : 'Off');
          break;
        case 0x6057:
          setValve4Status(msg.data ? 'On' : 'Off');
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

    tpdoPublisher.publish(msg);
  };

  return (
    <Card className="mb-4" style={{ width: '48rem' }}>
    <Card.Body>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Valve</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4].map((valve) => (
            <tr key={valve}>
              <td>{valve}</td>
              <td>{eval(`valve${valve}Status`)}</td>
              <td>
                <Button
                  variant="outline-secondary"
                  onClick={() => sendTpdo(valveAddresses[valve], 0, 1)}
                  style={{ marginLeft: '0.5rem' }}
                >
                  On
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => sendTpdo(valveAddresses[valve], 0, 0)}
                  style={{ marginLeft: '0.5rem' }}
                >
                  Off
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
  )
}

export default Valve