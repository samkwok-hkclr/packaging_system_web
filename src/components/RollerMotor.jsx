import React, { useEffect, useState } from 'react';
import ROSLIB from 'roslib';

import { Button, Form, Table } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

const RollerMotor = ({ros, namespace}) => {
  const [tpdoPublisher, setTpdoPublisher] = useState(null);

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
        case 0x6033:
          setValve1Status(msg.data ? 'On' : 'Off');
          break;
        case 0x6038:
          setValve2Status(msg.data ? 'On' : 'Off');
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


}

export default RollerMotor