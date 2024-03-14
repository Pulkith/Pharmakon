import { Fragment } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useState, useEffect } from 'react';
import * as Papa from 'papaparse';

const TextWithDividers = ({ text }) => {
    return (
      <div className="divider-container">
        <div className="divider short-divider"></div>
        <div className="text">{text}</div>
        <div className="divider long-divider"></div>
      </div>
    );
  };

const TextWithDividersEqual = ({ text }) => {
return (
    <div className="mid-divider-container">
    <div className="divider"></div>
    <div className="text">{text}</div>
    <div className="divider"></div>
    </div>
);
};


function PersonPicker(props) {
  const [ patientData, setPatientData ] = useState(null);
  const [people, setPeople] = useState([])
  const [otherPeople, setOtherPeople] = useState(null);

  const [selected, setSelected] = useState(people[0])
  const [query, setQuery] = useState('')

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

  useEffect(() => {
    if(patientData) {
      var arr = []
    for(var i = 0; i < patientData.length; i++) {
        arr.push({id: i, name: patientData[i][0]})
    }
    setPeople(arr.splice(1));
    }
    
  }, [patientData]);
    
  useEffect(() => {
      if(patientData && patientData.length > 0 && selected) {
        setOtherPeople(patientData[parseInt(selected.id)]);
        if(props.onC) {
          props.onC(patientData[parseInt(selected.id)]);
        }
      }
  }, [selected, patientData]);

  const filteredPeople =
    query === '' || people.filter((person) =>
    person.name
      .toLowerCase()
      .replace(/\s+/g, '')
      .includes(query.toLowerCase().replace(/\s+/g, ''))
  ).length > 200
      ? []
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
                  Too Broad
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

export {TextWithDividers, TextWithDividersEqual, PersonPicker};