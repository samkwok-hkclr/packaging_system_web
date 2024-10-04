import React, { useEffect, useState } from 'react';
import ROSLIB from 'roslib';

const TpdoPublisher = ({ros, namespace, setTpdoPublisher}) => {
  
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

    return () => {
      tpdo.unadvertise();
      setTpdoPublisher(null);
    };
  }, [ros]);

  return (
    <>
    </>
  );
}

export default TpdoPublisher