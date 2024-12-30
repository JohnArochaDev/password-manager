import { useState, useEffect, useRef } from "react"
import { Container } from 'react-bootstrap'
import { FaExclamationCircle } from 'react-icons/fa'
import checkForCompromise from '../../utils/checkForCompromise'
import checkForWeakPassword from "../../utils/checkForWeakPassword"
import UserData from "../UserData/UserData"
import Card from 'react-bootstrap/Card'

import "./passwordPage.css"

export default function PasswordsPage({ secureData, setDarkMode, darkMode, setSearchArray, dataArray, setDataArray, keepRendering, setSearchOptions, showCompromisedPasswords, setShowCompromisedPasswords, anyCompromised, setAnyCompromised, setAnyWeak, anyWeak }) {
    const [credentials, setCredentials] = useState([])

    const [redIcon, setRedIcon] = useState(false)

    const isInitialRender = useRef(true);

    useEffect(() => {
        if (secureData) {
            if (keepRendering.current) {
                if (isInitialRender.current) {
                    isInitialRender.current = false;
    
                    setSearchArray((prevSearchArray) => { //this prevents the data from doubling every time the home page is rendered
                        const exists = prevSearchArray.find(object => 
                            object.website === secureData.website &&
                            object.username === secureData.username &&
                            object.password === secureData.password
                        );
                        if (!exists) {
                            return [...prevSearchArray, secureData];
                        }
                        return prevSearchArray;
                    });
                }
            }
    
            checkForCompromise(secureData.password).then(isCompromised => {
                if (isCompromised) {
                    new Promise((resolve) => {
                        setAnyCompromised((prevAnyCompromised) => {
                            console.log("ADDING TO COMPROMISED ARRAY");
                            const exists = prevAnyCompromised.find(object => 
                                object.website === secureData.website &&
                                object.username === secureData.username &&
                                object.password === secureData.password
                            );
                            if (!exists) {
                                const updatedCompromised = [...prevAnyCompromised, secureData];
                                resolve(updatedCompromised);
                                return updatedCompromised;
                            }
                            resolve(prevAnyCompromised);
                            return prevAnyCompromised;
                        });
                    }).then((updatedCompromised) => {
                        if (secureData.website === "www.test.com") {
                            console.log("HITTTTTTTTTTTTT");
                        }
                        setRedIcon(true);
                        if (secureData.website === "www.test.com") {
                            console.log("RED ICON SET TRUE IN COMPROMISE CHECK", secureData);
                        }
    
                        // Check for weak password after updating anyCompromised
                        const responseObject = checkForWeakPassword(secureData.password);
                        if (secureData.website === "www.test.com") {
                            console.log("RESPONSE DATA", responseObject);
                        }
                        if (responseObject.weak === true) {
                            if (secureData.website === "www.test.com") {
                                console.log("HIT");
                            }
                            if (!anyWeak.find(object => 
                                object.website === secureData.website &&
                                object.username === secureData.username &&
                                object.password === secureData.password
                            )) {
                                setAnyWeak((prevAnyWeak) => [...prevAnyWeak, secureData]);
                                if (secureData.website === "www.test.com") {
                                    console.log("ADDED TO WEAK");
                                }
                            }
                            setRedIcon(true);
                            if (secureData.website === "www.test.com") {
                                console.log('RED ICON TRUE FOR WEAK PASS', secureData);
                            }
                        } else {
                            setAnyWeak(prevDataArray => prevDataArray.filter(data => data.id !== secureData.id));
                            if (!updatedCompromised.find(object => 
                                object.website === secureData.website &&
                                object.username === secureData.username &&
                                object.password === secureData.password
                            )) {
                                setRedIcon(false);
                                if (secureData.website === "www.test.com") {
                                    console.log('RED ICON FALSE FOR WEAK PASS', secureData);
                                }
                            }
                        }
                    });
                } else {
                    new Promise((resolve) => {
                        setAnyCompromised((prevDataArray) => {
                            console.log("REMOVING FROM COMPROMISED ARRAY");
                            const updatedCompromised = prevDataArray.filter(data => data.id !== secureData.id);
                            resolve(updatedCompromised);
                            return updatedCompromised;
                        });
                    }).then((updatedCompromised) => {
                        if (!anyWeak.find(object => 
                            object.website === secureData.website &&
                            object.username === secureData.username &&
                            object.password === secureData.password
                        )) {
                            setRedIcon(false);
                            if (secureData.website === "www.test.com") {
                                console.log("RED ICON SET FALSE IN COMPROMISE CHECK", secureData);
                            }
                        }
    
                        // Check for weak password after updating anyCompromised
                        const responseObject = checkForWeakPassword(secureData.password);
                        if (responseObject.weak === true) {
                            if (!anyWeak.find(object => 
                                object.website === secureData.website &&
                                object.username === secureData.username &&
                                object.password === secureData.password
                            )) {
                                setAnyWeak((prevAnyWeak) => [...prevAnyWeak, secureData]);
                            }
                            setRedIcon(true);
                            if (secureData.website === "www.test.com") {
                                console.log('RED ICON TRUE FOR WEAK PASS', secureData);
                            }
                        } else {
                            setAnyWeak(prevDataArray => prevDataArray.filter(data => data.id !== secureData.id));
                            if (!updatedCompromised.find(object => 
                                object.website === secureData.website &&
                                object.username === secureData.username &&
                                object.password === secureData.password
                            )) {
                                setRedIcon(false);
                                if (secureData.website === "www.test.com") {
                                    console.log('RED ICON FALSE FOR WEAK PASS', secureData);
                                }
                            }
                        }
                    });
                }
            });
    
            setCredentials(secureData);
        }
    }, [secureData]);

        // useEffect(()=>{
        //     if (secureData.website === "www.test.com") {
        //         console.log("RED ICON : \n", redIcon)
        //     }
        // },[redIcon]) // may use in the future

        useEffect(()=>{console.log("WEAK ARRAY : \n", anyWeak)},[anyWeak]) // may use in the future


    const [clicked, setClicked] = useState(null)

    function handleDelete(id) {
        setCredentials()
        setDataArray((prevDataArray) => prevDataArray.filter((credential) => credential.id !== id))
        setSearchArray((prevSearchArray) => prevSearchArray.filter((credential) => credential.id !== id))

    }

    return (
        <>
            {credentials ? (<Container>
                <div key={credentials?.id}>
                    {clicked === credentials?.id ? (
                        <Card className={darkMode ? "rounded-3 p-3 shadow-sm mx-1 my-2 text-white d-flex justify-content-center align-items-center card-hover" : "rounded-3 p-3 shadow-sm mx-1 my-2 text-black d-flex justify-content-center align-items-center light-mode-card-hover"}>
                            <UserData
                                id={credentials.id}
                                secureData={credentials}
                                setClicked={setClicked}
                                setDarkMode={setDarkMode}
                                darkMode={darkMode}
                                handleDelete={() => handleDelete(credentials?.id)}
                                credentials={credentials}
                                setCredentials={setCredentials}
                                setDataArray={setDataArray}
                                dataArray={dataArray}
                                setSearchArray={setSearchArray}
                                setSearchOptions={setSearchOptions}
                                setAnyCompromised={setAnyCompromised}
                                anyCompromised={anyCompromised}
                                setShowCompromisedPasswords={setShowCompromisedPasswords} 
                                showCompromisedPasswords={showCompromisedPasswords}
                                setAnyWeak={setAnyWeak}
                                anyWeak={anyWeak}
                            />
                        </Card>
                    ) : (
                        <Card
                            className={darkMode ? "rounded-3 p-3 shadow-sm mx-1 my-2 text-white d-flex justify-content-center align-items-center card-hover" : "rounded-3 p-3 shadow-sm mx-1 my-2 text-black d-flex justify-content-center align-items-center light-mode-card-hover"}
                            onClick={() => setClicked(credentials?.id)}
                        >
                            {redIcon && showCompromisedPasswords ? (<div style={{ position: 'absolute', top: '5px', left: '10px', color: 'red' }}>
                                <FaExclamationCircle size={15} />
                            </div>) : ''}
                            {credentials?.website && credentials?.website.length >= 25 ? (
                                <p>{credentials?.website.substring(0, 25)}...</p>
                            ) : (
                                <p>{credentials?.website}</p>
                            )}
                        </Card>
                    )}
                </div>
            </Container>) : ''}
        </>
    );
}