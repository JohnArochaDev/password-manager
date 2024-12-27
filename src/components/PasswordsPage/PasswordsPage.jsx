import { useState, useEffect, useRef } from "react"
import { Container } from 'react-bootstrap'
import UserData from "../UserData/UserData"
import Card from 'react-bootstrap/Card'

import "./passwordPage.css"

export default function PasswordsPage({ secureData, setDarkMode, darkMode, setSearchArray, dataArray, setDataArray, keepRendering, setSearchOptions, showCompromisedPasswords, setShowCompromisedPasswords }) {
    const [credentials, setCredentials] = useState([])

    const isInitialRender = useRef(true);

    useEffect(() => {
        if (secureData) {

            if (keepRendering.current) {
                if (isInitialRender.current) {
                    isInitialRender.current = false;
                    setSearchArray((prevSearchArray) => [...prevSearchArray, secureData]);
                }
            }

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
                                setShowCompromisedPasswords={setShowCompromisedPasswords} 
                                showCompromisedPasswords={showCompromisedPasswords}
                            />
                        </Card>
                    ) : (
                        <Card
                            className={darkMode ? "rounded-3 p-3 shadow-sm mx-1 my-2 text-white d-flex justify-content-center align-items-center card-hover" : "rounded-3 p-3 shadow-sm mx-1 my-2 text-black d-flex justify-content-center align-items-center light-mode-card-hover"}
                            onClick={() => setClicked(credentials?.id)}
                        >
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