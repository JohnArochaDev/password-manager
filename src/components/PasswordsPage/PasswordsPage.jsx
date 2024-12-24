import { useState, useEffect } from "react";
import { Container } from 'react-bootstrap';
import UserData from "../UserData/UserData";
import Card from 'react-bootstrap/Card';

import decryptData from '../../utils/decryption.js'
import "./passwordPage.css";

export default function PasswordsPage({ secureData, setDarkMode, darkMode }) {
    const [credentials, setCredentials] = useState([]);
    const base64Key = "cHNj27eIEIyw/y0RMex69iuLcEnXRwYoWlfTAWhwCEc="

    useEffect(() => {
        console.log("SECURE DATA" + secureData)
        // Decrypt here
        if (secureData) {
            const decryptedDataArray = secureData.map(dataObj => {
                const decryptedDataObj = { ...dataObj };
                for (const key in decryptedDataObj) {
                    if (key !== 'id' && decryptedDataObj.hasOwnProperty(key)) {
                        decryptedDataObj[key] = decryptData(decryptedDataObj[key], base64Key);
                    }
                }
                return decryptedDataObj;
            });

            setCredentials(decryptedDataArray);
            console.log(decryptedDataArray);
        }
    }, [secureData]);

    const [clicked, setClicked] = useState(null);

    function handleDelete(id) {
        setCredentials((prevCredentials) => prevCredentials.filter((credential) => credential.id !== id));
    };
    console.log("CREDENTIALS ARRAY : " + credentials)
    return (
        <>
            <Container>
                {credentials.map((data) => {
                    console.log('Rendering card for data:', data);
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