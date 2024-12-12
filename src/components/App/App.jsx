import { useEffect, useState, useRef } from 'react';
import PasswordsPage from "../PasswordsPage/PasswordsPage";
import {Card, Container} from 'react-bootstrap';

import "./App.css";

function useBackgroundData(reload) {
    const [data, setData] = useState(null); // Use state instead of context
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isInitialRender = useRef(true);

    function newCredential() {
        
    }

    // Tells the background.js script to fetch the data
    const fetchDataFromBackground = () => {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ action: 'fetchData' }, (response) => {
                if (response.status === 'success') {
                    resolve(response);
                } else {
                    console.error('Failed to fetch data:', response.message);
                    reject(new Error(response.message || 'Failed to fetch data'));
                }
            });
        });
    };

    const fetchData = async () => {
        try {
            await fetchDataFromBackground();
            chrome.storage.local.get('usersData', (result) => {
                if (result.usersData && JSON.stringify(result.usersData) !== JSON.stringify(data)) {
                    setData(result.usersData);
                } else {
                    setError('No data found.');
                }
                setLoading(false);
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setError('Failed to fetch data');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            fetchData();
        }
    }, [reload]); // Ensure the useEffect hook runs when reload changes

    return { data, loading, error };
}

// Main App component
export default function App({ reload, setDarkMode, darkMode }) {
    const { data, loading, error } = useBackgroundData(reload);

    const headerStyle = {
        marginBottom: '2vh',
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
    };

    return (
        <>
            <h1 style={headerStyle} className="doto-title">SafePass</h1>
            <hr style={{ width: '90%', borderColor: '#37383a' }} />
            {loading ? (
                "Loading...."
            ) : error ? (
                <p>{error}</p>
            ) : (
                Array.isArray(data?.loginCredentials) && data.loginCredentials.map((secureData, idx) => (
                    <PasswordsPage key={idx} secureData={secureData} setDarkMode={setDarkMode} darkMode={darkMode} className="mb-2" />
                ))
            )}
            <Container >
                <Card className="rounded-3 p-3 shadow-sm mx-1 my-2 text-white d-flex justify-content-center align-items-center card-hover" onClick={() => newCredential} >
                    <h1>+</h1>
                </Card>
            </Container>
        </>
    );
}