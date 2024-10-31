import React, { useState, useEffect } from 'react';
import ROSLIB from 'roslib';

function PkgDisMotor({ros, namespace}) {
    const [pulses, setPulses] = useState(800);
    const [currPulses, setCurrPulses] = useState(999);
    const [state, setState] = useState(999);
    const [sdoWriter, setSdoWriter] = useState(null);

    const pkgDisAddr = {
        0: 0x6014,
        1: 0x6018
    }

    useEffect(() => {
        if (!ros) {
          return;
        }
    
        const intervals = Object.values(pkgDisAddr).map((address, index) => {
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
                if (index === 0)
                    setCurrPulses(result.data);
                else
                    setState(result.data);
            });
          }, 1000);
        });
    
        return () => {
          intervals.forEach(clearInterval);
        };
    }, [ros, namespace]);

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

    const sendSDO = ((index, subindex, data)=> {
        const request = new ROSLIB.ServiceRequest({
          index: index,
          subindex: subindex,
          data:data
        });
        
        sdoWriter.callService(request, (result) => {
            console.log(result.success);
        });
    })

    return (
        <div className="outContainer">
            <h3>Package Dispenser Control (4號電機):</h3>
            <div className="borderContainer">
                <table>
                    <tbody>
                        <tr>
                            <td>Pulses:</td>
                            <td>
                                <input type="text" value={pulses} onChange={(e)=>setPulses(parseInt(e.target.value))}/>
                            </td>
                            <td>
                                <div className="btn" onClick={() => sendSDO(0x6011, 0, pulses)}>Set</div>
                            </td>
                        </tr>
                        <tr>
                            <td>Directions:</td>
                            <td style={{display:"flex"}}>
                                <div className="btn" onClick={() => sendSDO(0x6012, 0, 1)}>1</div>
                                <div className="btn" onClick={() => sendSDO(0x6012, 0, 0)}>0</div>
                            </td>
                        </tr>
                        <tr>
                            <td>Enable:</td>
                            <td style={{display:"flex"}}>
                                <div className="btn">Enable</div>
                                <div className="btn">Disable</div>
                            </td>
                        </tr>
                        <tr>
                            <td>Current Pulse:</td>
                            <td>
                                {currPulses}
                            </td>
                        </tr>
                        <tr>
                            <td>State:</td>
                            <td>
                                {state}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="btn" onClick={() => sendSDO(0x6019, 0, 1)}>Start</div>
                            </td>
                            {/* <td colSpan={2}>
                                <div className="btn bg-red">Emergency Stop</div>
                            </td> */}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PkgDisMotor;