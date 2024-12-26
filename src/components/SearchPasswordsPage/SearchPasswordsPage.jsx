import { useState, useEffect, useRef } from "react"
import { Container } from 'react-bootstrap'
import UserData from "../UserData/UserData"
import Card from 'react-bootstrap/Card'

import decryptData from '../../utils/decryption.js'
import "./searchPasswordPage.css"

export default function SearchPasswordsPage({ secureData, setDarkMode, darkMode, setSearchArray, searchArray }) {
    const [credentials, setCredentials] = useState([])

    const isInitialRender = useRef(true);

    useEffect(() => {
        if (secureData) {
            // console.log("SECURE DATA", secureData)

            setCredentials(secureData)
        }
    }, [secureData])

    const [clicked, setClicked] = useState(null)

    function handleDelete(id) {
        setCredentials((prevCredentials) => prevCredentials.filter((credential) => credential.id !== id))
    }

    return (
        <>
            <Container>
                {credentials.map((data) => {
                    return (
                        <div key={data.id}>
                            {clicked === data.id ? (
                                <Card className={darkMode ? "rounded-3 p-3 shadow-sm mx-1 my-2 text-white d-flex justify-content-center align-items-center card-hover" : "rounded-3 p-3 shadow-sm mx-1 my-2 text-black d-flex justify-content-center align-items-center light-mode-card-hover"}>
                                    <UserData
                                        secureData={data}
                                        setClicked={setClicked}
                                        setDarkMode={setDarkMode}
                                        darkMode={darkMode}
                                        handleDelete={() => handleDelete(data.id)}
                                        credentials={credentials}
                                        setCredentials={setCredentials}
                                    />
                                </Card>
                            ) : (
                                <Card
                                    className={darkMode ? "rounded-3 p-3 shadow-sm mx-1 my-2 text-white d-flex justify-content-center align-items-center card-hover" : "rounded-3 p-3 shadow-sm mx-1 my-2 text-black d-flex justify-content-center align-items-center light-mode-card-hover"}
                                    onClick={() => setClicked(data.id)}
                                >
                                    {data.website.length >= 25 ? (
                                        <p>{data.website.substring(0, 25)}...</p>
                                    ) : (
                                        <p>{data.website}</p>
                                    )}
                                </Card>
                            )}
                        </div>
                    );
                })}
            </Container>
        </>
    );
}