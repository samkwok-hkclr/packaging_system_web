import React from 'react';

function ConBeltControl(props) {
    return (
        <div className="outContainer">
            <h3>Conveyor Belt Control (1號電機):</h3>
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
                            <td>Stop by Ph:</td>
                            <td>
                                <input type="text" value={1} onChange={()=>{}}/>
                            </td>
                            <td>
                                <div className="btn">Set</div>
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
    );
}

export default ConBeltControl;