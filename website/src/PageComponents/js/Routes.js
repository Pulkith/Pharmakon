import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login.js'
import Dashboard from './Dashboard.js';
import Database from './Database.js';
import Upload from './Upload.js'
import Compare from './Compare.js'
const RouterComp = () => {
    return (<div className="App">
        <Routes>
            <Route exact path='/' element={<Login/>} ></Route>
			<Route exact path='/Login' element={<Login/>}></Route>
            <Route exact path='/Dashboard' element={<Dashboard/>}></Route>
            <Route exact path='/Database' element={<Database/>}></Route>
            <Route exact path='/Upload' element={<Upload/>}></Route>
            <Route exact path='/Compare' element={<Compare/>}></Route>
        </Routes>
    </div>)
}

export default RouterComp;