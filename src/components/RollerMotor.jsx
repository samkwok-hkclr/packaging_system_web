import React, { useEffect, useState } from 'react';
import ROSLIB from 'roslib';

import { Button, Form, Table } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

const RollerMotor = ({ros, namespace, sendTpdo}) => {
  const [steps, setSteps] = useState(0);

  return (
    <>
      <input
        type="text"
        // value={this.state.value}
        // onChange={setSteps()}
      />
      <Button
        variant="outline-secondary"
        onClick={() => sendTpdo(0x6030, 0, 1)}
        style={{ marginLeft: '0.5rem' }}
      >
        1
      </Button>
      <Button
        variant="outline-secondary"
        onClick={() => sendTpdo(0x6039, 0, 1)}
        style={{ marginLeft: '0.5rem' }}
      >
        Run
      </Button>
    </>
  )
}

export default RollerMotor