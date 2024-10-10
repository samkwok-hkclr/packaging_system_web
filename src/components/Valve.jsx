import React, { useEffect, useState } from 'react';
import ROSLIB from 'roslib';

import { Button, Form, Table } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

const Valve = ({ros, namespace}) => {
  const [valveStatus, setValveStatus] = useState(['Off', 'Off', 'Off', 'Off']);
  const [sdoWriter, setSdoWriter] = useState(null);

  const valveCtrlAddr = {
    1: 0x6050,
    2: 0x6051,
    3: 0x6052,
    4: 0x6053,
  };

  const valveStatusAddr = {
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

    const intervals = Object.values(valveStatusAddr).map((address, index) => {
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
          const newStatus = result.data ? 'On' : 'Off';
          setValveStatus((prevStatus) => {
            const updatedStatus = [...prevStatus];
            updatedStatus[index] = newStatus; 
            return updatedStatus;
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
              <td>{valveStatus[valve - 1]}</td>
              <td>
                <Button
                  variant="outline-secondary"
                  onClick={() => sendSDO(valveCtrlAddr[valve], 0, 1)}
                  style={{ marginLeft: '0.5rem' }}
                >
                  On
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => sendSDO(valveCtrlAddr[valve], 0, 0)}
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