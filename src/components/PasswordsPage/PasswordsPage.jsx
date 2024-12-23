import { useState, useEffect } from "react";
import { Container } from 'react-bootstrap';
import UserData from "../UserData/UserData";
import Card from 'react-bootstrap/Card';
import "./passwordPage.css";

export default function PasswordsPage({ secureData, setDarkMode, darkMode }) {
    const [credentials, setCredentials] = useState([]);

    useEffect(() => {
        if (secureData) {
            setCredentials([secureData]);
        }
    }, [secureData]);

    const [clicked, setClicked] = useState(null);

    function handleDelete(id) {
        setCredentials((prevCredentials) => prevCredentials.filter((credential) => credential.id !== id));
    };

    return (
        <>
            <Container>
                {credentials.map((data) => (
                    <div key={data.id} >
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
                                <p>{data.website}</p>
                            </Card>
                        )}
                    </div>
                ))}
            </Container>
        </>
    );
}