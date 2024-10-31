import React,{useState, useEffect} from 'react';

function ReedSwitch(props) {

    const [valveStatus, setValveStatus] = useState(['Off', 'Off', 'Off', 'Off','Off', 'Off', 'Off', 'Off']);

    useEffect(()=>{

    },[])

    return (
        <div className='outContainer'>
            <h3>Solenoid Value:</h3>
            <table className='valueTable'>
                <thead>
                <tr>
                    <th>Valve ID</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((valve) => (
                    <tr key={valve}>
                        <td>{valve}</td>
                        <td>{valveStatus[valve - 1]}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
    );
}

export default ReedSwitch;