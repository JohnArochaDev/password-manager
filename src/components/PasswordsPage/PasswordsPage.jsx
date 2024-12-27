import { useState, useEffect, useRef } from "react"
import { Container } from 'react-bootstrap'
import { FaExclamationCircle } from 'react-icons/fa';
import checkForCompromise from '../../utils/checkForCompromise';
import UserData from "../UserData/UserData"
import Card from 'react-bootstrap/Card'

import "./passwordPage.css"

export default function PasswordsPage({ secureData, setDarkMode, darkMode, setSearchArray, dataArray, setDataArray, keepRendering, setSearchOptions, showCompromisedPasswords, setShowCompromisedPasswords, anyCompromised, setAnyCompromised }) {
    const [credentials, setCredentials] = useState([])

    const [redIcon, setRedIcon] = useState(false)

    const isInitialRender = useRef(true);

    useEffect(() => {
        if (secureData) {

            if (keepRendering.current) {
                if (isInitialRender.current) {
                    isInitialRender.current = false;
                    setSearchArray((prevSearchArray) => [...prevSearchArray, secureData])
                }
            }

            checkForCompromise(secureData.password).then(isCompromised => {
                if (isCompromised) {
                    setAnyCompromised((prevAnyCompromised) => [...prevAnyCompromised, secureData])
                    setRedIcon(true)
                } else {
                    setAnyCompromised(prevDataArray => prevDataArray.filter(data => data.id !== secureData.id))
                    setRedIcon(false)
                }
            })

            setCredentials(secureData)
        }
    }, [secureData])

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