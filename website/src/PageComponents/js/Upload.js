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
import { CheckIcon, ChevronUpDownIcon, PeoplePicker } from '@heroicons/react/20/solid'


const people = [
    { id: 0, name: 'Choose Patient'},
    { id: 1, name: 'Wade Cooper' },
    { id: 2, name: 'Arlene Mccoy' },
    { id: 3, name: 'Devon Webb' },
    { id: 4, name: 'Tom Cook' },
    { id: 5, name: 'Tanya Fox' },
    { id: 6, name: 'Hellen Schmidt' },
  ]

const Upload = () => {
    const [uploaded, setUploaded] = useState(false)
    const [tab, setTab] = useState(2);

    const manageTab = (tab) => {
        for(var i = 0; i < 3; ++i) {
            document.getElementById('tab' + (i + 1) + 'id').classList.remove('tab-active')
        }
        document.getElementById('tab' + tab + 'id').classList.add('tab-active')
        setTab(tab)
    }

    const [file, setFile] = useState(null);
  
    const handleUpload = (event) => {
      const uploadedFile = event.target.files[0];
      if (uploadedFile) {
        setFile(uploadedFile);
      }
    };
  
    const deleteFile = () => {
      setFile(null);
    };
  
    const uploadInputStyle = {
      display: 'none',
    };
  
    const boxStyle = {
      width: '200px',
      height: '250px',
      backgroundColor: 'rgb(229, 231, 235)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      margin: '0 auto', // Centers the box horizontally
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '5px',
    };
  
    const textStyle = {
      textAlign: 'center',
      color: 'black',
    };
  
    const buttonStyle = {
      display: file ? 'block' : 'none', // Only show the button if a file has been uploaded
      margin: '10px auto',
      cursor: 'pointer',
    };

    let rows = ['microevent_id'	,'subject_id'	,'hadm_id',	'micro_specimen_id',	'order_provider_id',	'chartdate',	'charttime',	'spec_itemid',	'spec_type_desc',	'test_seq',	'storedate',	'storetime',	'test_itemid',	'test_name', '	org_itemid', 	'org_name',	'isolate_num',	'quantity',	'ab_itemid',	'ab_name',	'dilution_text',	'dilution_comparison',	'dilution_value',	'interpretation',	'comments']

    function titleCase(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        // Directly return the joined string
        return splitStr.join(' '); 
     }

    return (
        <div className="upload-wrapper">
            <div className="max-contentwrapper">
                <div className="content ptop20">
                    <button className="btn btn-neutral textwhite fs125 mtop10 btnhovermovearrow mtop20" onClick={() => {window.location.href = '/Dashboard'}}><WestIcon /> Back</button>
                    <div className="fs400 fw900">Upload Patient Data</div>
                    <div className="uploadfullwrapper">
                        <div className="centervertwrapper">
                            <div className="mtop200 maxwidth">
                                <Example />
                                <div className="centerwrapper mtop10 mbottom50 fs150">Choose an existing patient to view and edit</div>
                                
                            

                                <div className="centerwrapper mtop200 fs150" >Upload New Patient Data to Begin</div>
                                <button className="btn btn-primary textwhite fs125 mtop10 btnhovermovearrow mtop20 maxwidth" onClick={()=>document.getElementById('my_modal_3').showModal()}>Upload Data</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                <dialog id="my_modal_3" className="modal">
                <div className="modal-box modal-box w-11/12 max-w-5xl">
                    <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Choose Upload Method</h3>

                    <div role="tablist" className="tabs tabs-boxed mtop20">
                        <a role="tab" id="tab1id" className="tab" onClick={() => manageTab(1)}>Audio Upload</a>
                        <a role="tab" id="tab2id" className="tab tab-active" onClick={() => manageTab(2)}>CSV Upload</a>
                        <a role="tab" id="tab3id" className="tab" onClick={() => manageTab(3)}>Manual Upload</a>
                    </div>
                    { tab === 1 &&
                    <div role="tabpanel" id="tab1" className="tabpanel">
                        <div className="mtop20">
                            <div className="centerwrapper flexdown">
                                <div className="fs150">Upload an audio file to begin</div>
                                <div className="fs100">Accepted files are .mp4, .mp3, .mov, .flac, .wav.</div>
                            </div>
                            <div className="mtop20">
                                <div>
                                <div style={boxStyle} onClick={() => document.getElementById('fileInput').click()}>
                                    <input
                                    id="fileInput"
                                    type="file"
                                    style={uploadInputStyle}
                                    onChange={handleUpload}
                                    accept="audio/*"
                                    />
                                    {file ? (
                                    <div style={textStyle}>
                                        🎵 {file.name}
                                    </div>
                                    ) : (
                                    <div style={textStyle}>Choose file</div>
                                    )}
                                </div>
                                <div className="centerwrapper">
                                    <div style={buttonStyle} onClick={deleteFile}>Delete file</div>
                                </div>
                                </div>
                            </div>
                           { file && <div className="centerwrapper">
                                <button className="btn btn-primary textwhite fs125 mtop10 btnhovermovearrow mtop20" onClick={ () => window.location.href="/Compare"}>Upload Data</button>
                            </div>}
                        </div>
                    </div>
                    }

                    { tab === 2 &&
                    <div role="tabpanel" id="tab1" className="tabpanel">
                        <div className="mtop20">
                            <div className="centerwrapper flexdown">
                                <div className="fs150">Upload an .csv file to begin</div>
                            </div>
                            <div className="mtop20">
                                <div>
                                <div style={boxStyle} onClick={() => document.getElementById('fileInput').click()}>
                                    <input
                                    id="fileInput"
                                    type="file"
                                    style={uploadInputStyle}
                                    onChange={handleUpload}
                                    accept=".csv"
                                    />
                                    {file ? (
                                    <div style={textStyle}>
                                        📄 {file.name}
                                    </div>
                                    ) : (
                                    <div style={textStyle}>Choose file</div>
                                    )}
                                </div>
                                <div className="centerwrapper">
                                    <div style={buttonStyle} onClick={deleteFile}>Delete file</div>
                                </div>
                                </div>
                            </div>
                           { file && <div className="centerwrapper">
                                <button className="btn btn-primary textwhite fs125 mtop10 btnhovermovearrow mtop20" onClick={() => window.location.href="/Compare"}>Upload Data</button>
                            </div>}
                        </div>
                    </div>
                    }

                    { tab === 3 &&
                    <div role="tabpanel" id="tab1" className="tabpanel">
                        <div className="mtop20">
                            <div className="centerwrapper flexdown">
                                <div className="fs150">Enter Patient Details Below</div>
                            </div>
                            <div className="mtop20">
                                <div>
                                <div className="centerwrapper">
                                    <label className="form-control w-full max-w-xs">
                                        {rows.map((row, index) => {
                                            return (
                                                <div className="mtop10">
                                                    <div className="label"><span className="label-text">{titleCase(rows[index].replaceAll('_', ' ').replaceAll('id', 'ID'))}</span></div>
                                                    <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                                                </div>
                                            )})
                                        }
                                    </label>
                                </div>
                                </div>
                            </div>
                            <div className="centerwrapper">
                                <button className="btn btn-primary textwhite fs125 mtop10 btnhovermovearrow mtop20" onClick={() => window.location.href="/Compare"}>Upload Data</button>
                            </div>
                        </div>
                    </div>
                    }


                    

                </div>
                </dialog>
        </div>
    )
}
  function Example() {
    const [selected, setSelected] = useState(people[0])
    const [query, setQuery] = useState('')
  
    const filteredPeople =
      query === ''
        ? people
        : people.filter((person) =>
            person.name
              .toLowerCase()
              .replace(/\s+/g, '')
              .includes(query.toLowerCase().replace(/\s+/g, ''))
          )
  
    return (

        <Combobox value={selected} onChange={setSelected}>
          <div className="relative mt-1">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
              <Combobox.Input
                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 maxwidth bgwhite focus:ring-0"
                displayValue={(person) => person.name}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery('')}
            >
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                {filteredPeople.length === 0 && query !== '' ? (
                  <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filteredPeople.map((person) => (
                    <Combobox.Option
                      key={person.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-teal-600 text-white' : 'text-gray-900'
                        }`
                      }
                      value={person}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {person.name}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-white' : 'text-teal-600'
                              }`}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
    )
  }


export default Upload;
