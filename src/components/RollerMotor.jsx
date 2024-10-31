import React, { useEffect, useState } from 'react';
import ROSLIB from 'roslib';

const RollerMotor = ({ros, namespace}) => {
  const [steps, setSteps] = useState(0);
  const [tpdoPublisher, setTpdoPublisher] = useState(null);

  const sendTpdo = (index, subindex, data) => {
    const msg = new ROSLIB.Message({
      index: index,
      subindex: subindex,
      data: data,
    });

    tpdoPublisher.publish(msg);
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

    return () => {
      tpdo.unadvertise();
      setTpdoPublisher(null);
    };
  }, [ros]);

  return (
    <div className="outContainer">
            <h3>Roller Control (5號電機):</h3>
            <div className="borderContainer">
                <table>
                    <tbody>
                        <tr>
                            <td>Pulses:</td>
                            <td>
                                <input type="text" value={1600} onChange={()=>{}}/>
                            </td>
                            <td>
                                <div className="btn">Set</div>
                            </td>
                        </tr>
                        <tr>
                            <td>Speed:</td>
                            <td>
                                <input type="text" value={1} onChange={()=>{}}/>
                            </td>
                            <td>
                                <div className="btn">Set</div>
                            </td>
                        </tr>
                        <tr>
                            <td>Direction:</td>
                            <td>
                                <input type="text" value={1} onChange={()=>{}}/>
                            </td>
                            <td>
                                <div className="btn">Set</div>
                            </td>
                        </tr>
                        <tr>
                            <td>Current Steps:</td>
                            <td>
                                XXXX
                            </td>
                        </tr>
                        <tr>
                            <td>Mode:</td>
                            <td>
                                XXXX
                            </td>
                        </tr>
                        <tr>
                            <td>State:</td>
                            <td>
                                XXXX
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="btn">Start</div>
                            </td>
                            <td colSpan={2}>
                                <div className="btn bg-red">Emergency Stop</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
  )
}

export default RollerMotor