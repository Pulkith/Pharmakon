import React from 'react';
import '../css/login.scss'
import '../css/global.scss'

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EastIcon from '@mui/icons-material/East';
import { useState } from 'react';
import { Navigate } from 'react-router';

const Login = () => {
    const [hospital, setHospital] = useState(null);
    const onHospChange = (event, value) => {
        if(value) {
            setHospital(value.label);
        } else {
            setHospital(null);
        }
    }

    const handleLogin = () => {
        window.location.href = '/Dashboard';
    }

    return (
        <div className="login-wrapper">
            <div className=" maxheight">
                <div className="content centervertwrapper">
                    <div className="centervertwrapperabs">
                        <div className="centerwrapper flexdown">
                            <div className="header textwhite fw900 fs350 gradtext centerchild">Welcome back</div>
                            <div className="details">
                                <div className="textwhite fs20">Please select your hospital system to continue</div>
                            </div>
                            <div className="loginform mtop20">
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={hospitalNames}
                                    sx={{ width: 350, style : {color: 'white'} }}
                                    onChange={(e, v) => onHospChange(e, v)}
                                    renderInput={(params) => <TextField {...params} label="Hospital System" />}
                                />

                                <div className='mtop50 extralogin flex flexdown' style={{'visibility': (hospital ? 'visible' : 'hidden')}}>
                                    <div className="details">
                                        <div className="textwhite fs20">Sign in with your system credentials</div>
                                    </div>
                                    <TextField id="outlined-basic" label="Key" variant="outlined" sx={{width:350}} className="mtop10" />
                                    <TextField id="outlined-basic" label="Password" variant="outlined" sx={{width:350}} className="mtop10" />
                                    <button className="btn btn-primary textwhite fs125 mtop10 btnhovermovearrow" onClick={() => handleLogin()}>Login <EastIcon className="movearrowright" /></button>'
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
const hospitalNames = [
    {label: "The University of Pennsylvania SOP"},
    {label: "Allstar Health Sciences"},
    {label: "Urgent Care Philadelphia"},
    {label: "McMallin Practice"},
    {label: "Everfront Hopsital of West Philadelphia"},
    {label: "Children's Hospital of Philadelphia"},
    {label: "The System of Crescent Pedetricians"},
    {label: "Penn Presbyterian Medical Center"},
    {label: "Drexel University College of Medicine"},
];

export default Login