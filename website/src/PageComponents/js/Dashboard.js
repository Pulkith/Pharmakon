import React from 'react';
import '../css/dashboard.scss'
import '../css/global.scss'

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EastIcon from '@mui/icons-material/East';
import { useState } from 'react';
import { Navigate } from 'react-router';
import {TextWithDividers, TextWithDividersEqual, PersonPicker} from './UtilComponents.js'
import Database from './Database.js';

const Dashboard = () => {

    const rotate = (log) => {
        window.location.href = '/Compare';
    }

    return (
        <div className="dashboard-wrapper">
            <div className="max-contentwrapper">
                <div className="content ptop20">
                    <div className="fs400 fw900">Dashboard</div>
                    
                    <div className="comparewrapper">
                        <div className="fullend">
                            <div className="rightend">
                                <TextWithDividers text="Explore"></TextWithDividers>
                                <Database />
                            </div>
                            <div className="leftend">
                                <TextWithDividers text="Compare"></TextWithDividers>
                                <div className="centervertwrapper">
                                    <div className="mtop200 maxwidth">
                                        <PersonPicker onC={rotate}/>
                                        <div className="centerwrapper mtop10 mbottom50">Choose an existing patient to view and edit</div>
                                        
                                        <TextWithDividersEqual text="OR"></TextWithDividersEqual>

                                        <div className="centerwrapper mtop50">Upload New Patient Data</div>
                                        <button className="btn btn-primary textwhite fs125 mtop10 btnhovermovearrow mtop20 maxwidth" onClick={() => {window.location.href = '/Upload'}}>Upload Portal <EastIcon className="movearrowright" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Dashboard;
