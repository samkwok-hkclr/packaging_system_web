import React, { useState, useEffect } from 'react';
import ROSLIB from 'roslib';

function PkgSquControl({ros, namespace}) {
    const [speed, setSpeed] = useState(1000);
    const [state, setState] = useState(999);
    const [sdoWriter, setSdoWriter] = useState(null);

    const pkgSquAddr = {
        1: 0x6078
    }

    useEffect(() => {
        if (!ros) {
          return;
        }
    
        const intervals = Object.values(pkgSquAddr).map((address, index) => {
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
            <h3>Package Squeezer Control (2號電機):</h3>
            <div className="borderContainer">
                <table>
                    <tbody>
                        <tr>
                            <td>Pulses:</td>
                            <td>
                                <input type="text" value={500} onChange={()=>{}}/>
                            </td>
                            <td>
                                <div className="btn">Set</div>
                            </td>
                        </tr>
                        {/* <tr>
                            <td>Directions:</td>
                            <td>
                                <input type="text" value={1} onChange={()=>{}}/>
                            </td>
                            <td>
                                <div className="btn">Set</div>
                            </td>
                        </tr> */}
                        <tr>
                            <td>State:</td>
                            <td>
                                {state}
                            </td>
                        </tr>
                        <tr>
                            <td style={{display:"flex"}}>
                                <div className="btn" onClick={() => {
                                    sendSDO(0x6072, 0, 1);
                                    sendSDO(0x6079, 0, 1);
                                }}>Push</div>
                                <div className="btn" onClick={() => {
                                    sendSDO(0x6072, 0, 0);
                                    sendSDO(0x6079, 0, 1);
                                }}>Pull</div>
                            </td>
                            <td colSpan={2}>
                                <div className="btn bg-red" onClick={() => sendSDO(0x6079, 0, 0)}>Emergency Stop</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PkgSquControl;