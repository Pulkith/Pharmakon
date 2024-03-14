import React from 'react';
import '../css/dashboard.scss'
import '../css/global.scss'

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import { useState } from 'react';
import { Navigate } from 'react-router';

import { Fragment } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

import {TextWithDividers, TextWithDividersEqual, PersonPicker} from './UtilComponents.js'
import {useEffect} from 'react';

import * as Papa from 'papaparse';
import { ViewCarousel } from '@mui/icons-material';

import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

import axios from 'axios';

var people = []


const Compare = () => {

    const [ patientData, setPatientData ] = useState(null);
    const [ top10Comps, settop10] = useState(null);

    const usepatient = 10;

    const [texts, setTexts] = useState([]);

    const load = function(){
        fetch( './patient_store.csv' )
            .then( response => response.text() )
            .then( responseText => {
                var data = Papa.parse(responseText);
                setPatientData(data.data);
        })
    };
    

    useEffect(() => {
        load();
    }, []);

    const newMessage = (msg, user) => {
        setTexts(texts => [...texts, {msg, user},])
    }

    const handleMsg = () => {
      newMessage(document.getElementById('txtinput').value, 'User')
        const data = { data: { query: document.getElementById('txtinput').value}}
        const query = document.getElementById('txtinput').value;
        axios.post('http://127.0.0.1:5000/receive-chatbot', {query}).then(r => {
          newMessage(r.data.answer, 'AI');
          newMessage("Similar patients are: " + r.data.similar_patients ,'AI')
        })
    }

    const handleSwitch = () => {
      console.log(texts)
      let text = texts[texts.length - 2].msg
      console.log(text)
      axios.post('http://127.0.0.1:5000/translate', {text}).then(r => {
        newMessage(r.data.response, 'AI')
      })
    }

    useEffect(() => {
        if(patientData) {
            var arr = []
            for(var i = 0; i < patientData.length; i++) {
                arr.push({id: i, name: patientData[i][0]})
            }
            people = arr
            getSimScore();
        }
        console.log(texts)
    }, [patientData])
    

    function ccs(arr1, arr2) {
        const isMostlyNumeric = (str) => {
          const numericCount = (str.match(/\d/g) || []).length;
          const letterCount = (str.match(/[a-zA-Z]/g) || []).length;
          return numericCount > letterCount;
        };

      
        const toVector = (arr) => {
          const vector = {};
          let numericAggregate = 0;
      
          arr.forEach((str) => {
            if (str === '') return; 
            if (isMostlyNumeric(str)) {
              numericAggregate += parseFloat(str) || 0;
            } else {
              vector[str] = (vector[str] || 0) + 1;
            }
          });
      
          vector["__numericAggregate__"] = numericAggregate;
          return vector;
        };
      
        const vec1 = toVector(arr1);
        const vec2 = toVector(arr2);
      
        let dotProduct = 0;
        let magnitude1 = 0;
        let magnitude2 = 0;
      
        for (const key in vec1) {
          if (vec2[key]) {
            dotProduct += vec1[key] * vec2[key];
          }
          magnitude1 += vec1[key] ** 2;
        }
        const magcheck = (Math.random() * 10 + 1);
      
        for (const key in vec2) {
          magnitude2 += vec2[key] ** 2;
        }
      
        magnitude1 = Math.sqrt(magnitude1);
        magnitude2 = Math.sqrt(magnitude2 * magcheck);
      

        const cs = dotProduct / (magnitude1 * magnitude2);
        return cs;
      }

      function preprocessArray(arr) {
        return arr.map(item => {
          const letters = item.replace(/[^a-zA-Z]/g, "").length;
          const digits = item.replace(/[^0-9]/g, "").length;
          if (digits > letters) {
            return parseFloat(item.replace(/[^0-9.]/g, ""), 10) || 0;
          } else {
            return item;
          }
        });
      }
      
      function vectorizeArrays(arr1, arr2) {
        const wordIndex = {};
        let index = 0;
      
        const incrementIndex = (item) => {
          if (wordIndex[item] === undefined) {
            wordIndex[item] = index++;
          }
        };
      
        arr1.forEach(incrementIndex);
        arr2.forEach(incrementIndex);
      
        const vector1 = new Array(index).fill(0);
        const vector2 = new Array(index).fill(0);
      
        arr1.forEach(item => {
          if (typeof item === 'number') {
            vector1[wordIndex[item]] += item;
          } else {
            vector1[wordIndex[item]] += 1;
          }
        });
      
        arr2.forEach(item => {
          if (typeof item === 'number') {
            vector2[wordIndex[item]] += item;
          } else {
            vector2[wordIndex[item]] += 1;
          }
        });
      
        return { vector1, vector2 };
      }
      
      function calculateCosineSimilarity(vec1, vec2) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
      
        for (let i = 0; i < vec1.length; i++) {
          dotProduct += vec1[i] * vec2[i];
          normA += vec1[i] ** 2;
          normB += vec2[i] ** 2;
        }
      
        normA = Math.sqrt(normA);
        normB = Math.sqrt(normB);
      
        if (normA === 0 || normB === 0) {
          return 0; // Avoid division by zero
        }
      
        return dotProduct / (normA * normB);
      }
      
      function process(arr1, arr2) {
        const preprocessedArr1 = preprocessArray(arr1);
        const preprocessedArr2 = preprocessArray(arr2);
        const { vector1, vector2 } = vectorizeArrays(preprocessedArr1, preprocessedArr2);
        return calculateCosineSimilarity(vector1, vector2);
      }
    const getSimScore =  () => {
        const maxrrows = 10;
        const pattouse = patientData[usepatient];
        console.log(pattouse);
        var tops = []
        loadComp().then((model) => {
            for(var i = 0; i < (patientData.length); i++) {
                if(i != usepatient) {
                    const diff = (ccs(patientData[i], pattouse));
                    tops.push({index: i, diff: diff});
                }
            }
            tops.sort((a, b) => {
                return a.diff - b.diff;
            });
            tops = tops.reverse();
            tops = tops.slice(0, maxrrows * 10 + 2);
            var top10 = []
            for(var i = 0; i < 10; i++) {
                top10.push(tops[i * 10+1]);
                settop10(top10);
            }
            
        });
    };

    const loadComp = async () => {
        const model = await use.load();
        return model;
    }

    const accComp = async (model, row1, row2) =>{
        var arr = []
        for(let data  in row1) {
            arr.push(data);
        }
        for(let data  in row2) {
            arr.push(data);
        }

        const embeddings = (await model.embed(arr)).unstack()
        var sum = 0
        for(var i = 0; i < arr.length / 2; i++) {
            const diff = parseFloat(tf.losses.cosineDistance(embeddings[i], embeddings[i+ arr.length / 2], 0).toString().split(" ")[4])
            sum += diff
        }
        return sum / (arr.length / 2)
    }

    const [comp, setComp] = useState(null);

    const postAndGetMessage = () => {
      
    }

    return (
        <div className="compare-wrapper">
            <div className="max-contentwrapper">
                <div className="content ptop20">
                    <button className="btn btn-neutral textwhite fs125 mtop10 btnhovermovearrow mtop20" onClick={() => {window.location.href = '/Upload'}}><WestIcon /> Back</button>
                    <div className="fs400 fw900">Compare Patients</div>
                    <div className="comparefullwrapper">
                        <TextWithDividers text="Explore Data"></TextWithDividers>
                        <div className="row maxwidth">
                            <div className="col-6 maxheight lefthalfcols" style={{width: "50%", display: 'inline-block'}}>
                                <div className="fs200">Patient 1</div>
                                <div className="fs125">ID: {patientData && <div className="" style={{display: "inline-block"}}> { patientData[usepatient][0]}</div>}</div>
                                {patientData && 
                                <table className="table tablex">

                                <thead>
                                <tr>
                                    <th></th>
                                    <th>Key</th>
                                    <th>Value</th>
                                </tr>
                                </thead>
                                <tbody >
                                {patientData[usepatient].map((item, index) => {
                                    return (<tr key={index}>
                                        <th>{index + 1}</th>
                                        <td>{patientData[0][index]}</td>
                                        <td>{patientData[usepatient][index]}</td>
                                    </tr>)
                                })}
                                </tbody>
                            </table>}
                                
                            </div>
                            <div className="col-6 maxheight righthalfcols" style={{width: "50%", display: 'inline-block'}}>
                                <div className="fs200">Patient 2</div>
                                <PersonPicker onC={setComp}></PersonPicker>
                                { comp && 
                                <table className="table tablex">

                                <thead>
                                <tr>
                                    <th></th>
                                    <th>Key</th>
                                    <th>Value</th>
                                </tr>
                                </thead>
                                <tbody >
                                {comp.map((item, index) => {
                                    return (<tr key={index}>
                                        <th>{index + 1}</th>
                                        <td>{patientData[0][index]}</td>
                                        <td>{patientData[usepatient][index]}</td>
                                    </tr>)
                                })}
                                </tbody>
                            </table>}
                                
                            </div>
                        </div>
                        <div className="mtop50">
                            <TextWithDividers text="Similar Patients"></TextWithDividers>
                            <div className='centerwrapper'>
                                {!top10Comps && <div className='fs300 nopat'>Processing</div> }
                                {top10Comps && <div className="row maxwidth">
                                <div className="overflow-x-auto">
                                <table className="table">
                                    {/* head */}
                                    <thead>
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Match Score</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {top10Comps.map((item, index) => {
                                        return (<tr key={index}>
                                            <th>{index + 1}</th>
                                            <td>{patientData[item.index][0]}</td>
                                            <td>{item.diff}</td>
                                        </tr>)
                                    })}
                                    </tbody>
                                </table>
                                </div>    
                                </div>}
                            </div>
                            <div className="mtop50"  style={{marginBottom: "50px"}}>
                            <TextWithDividers text="Chat"></TextWithDividers>
                            <div className=''>
                                <div className="ts150 ">Ask questions below:</div>
                                <div className="mtop20">
                                    <input type="text" id="txtinput" placeholder="Type here" className="input input-bordered w-full" style={{width: "94%", marginRight: "10px"}} /><button className="btn btn-success" onClick={handleMsg}>Send</button>
                                </div>
                                <button className="btn btn-secondary mtop10" onClick={handleSwitch}>Translate to Spanish</button>


                                <div className="ts150 mtop50 ">Chat Messages:</div>
                                <div className="texts mtop10" style={{paddingTop: "10px", paddingBottom: "20px"}}>
                                    {texts.map((item) => (
                                        <div className="textwrapper mtop20" style={{marginLeft: "20px", marginRight: "20px"}}>
                                            {(item.user == 'AI') && <div className="user fs125 aicolor">{item.user}:</div>}
                                            {(item.user == 'User') && <div className="user fs125 humancolor">{item.user}:</div>}
                                            <div className="msg">{item.msg}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mtop50" style={{minHeight: "20px"}}></div>
                            </div>
                        </div>
                        </div>
                    </div>      
                </div>
            </div>
        </div>
    )
}


export default Compare
