import React from 'react';

function PkgDisMotor(props) {
    return (
        <div className="outContainer">
            <h3>Package Dispenser Control (4號電機):</h3>
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
                            <td>Directions:</td>
                            <td>
                                <input type="text" value={1} onChange={()=>{}}/>
                            </td>
                            <td>
                                <div className="btn">Set</div>
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
    );
}

export default PkgDisMotor;