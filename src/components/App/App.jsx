import { useEffect, useState, useRef } from 'react'
import PasswordsPage from "../PasswordsPage/PasswordsPage"
import {Card, Container, Modal, Button, Form, Row, Col, FormControl, InputGroup, Toast} from 'react-bootstrap'
// import decryptData from '../../utils/decryption.js'
import generatePassword from '../../utils/passwordGenerator.js'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

import "./App.css"

function useBackgroundData(reload) { // grabs the data from the background.js script
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const isInitialRender = useRef(true)

    const fetchDataFromBackground = () => {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ action: 'fetchData' }, (response) => {
                if (response.status === 'success') {
                    resolve(response)
                } else {
                    console.error('Failed to fetch data:', response.message)
                    reject(new Error(response.message || 'Failed to fetch data'))
                }
            })
        })
    }

    const fetchData = async () => {
        try {
            await fetchDataFromBackground()
            chrome.storage.local.get('usersData', (result) => {
                if (result.usersData && JSON.stringify(result.usersData) !== JSON.stringify(data)) {
                    setData(result.usersData)
                } else {
                    setError('No data found.')
                }
                setLoading(false)
            })
        } catch (error) {
            console.error('Failed to fetch data:', error)
            setError('Failed to fetch data')
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false
            fetchData()
        } else {
            fetchData()
        }
    }, [reload])

    return { data, loading, error }
}



export default function App({ reload, setReload, setDarkMode, darkMode, search, setSearch, showCompromisedPasswords, setShowCompromisedPasswords, setSearchArray, searchArray }) {
    const base64Key = import.meta.env.VITE_SECRET_KEY // key for decryption

    const keepRendering = useRef(true)

    const { data, loading, error } = useBackgroundData(reload)
    const [dataArray, setDataArray] = useState([])

    const [userId, setUserId] = useState()
    const [userToken, setUserToken] = useState()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [website, setWebsite] = useState('')

    const [showModal, setShowModal] = useState(false)

    const [showRegisterPassword, setShowRegisterPassword] = useState(false) //shows ******** or password

    const [anyCompromised, setAnyCompromised] = useState([]) // an array of compromised passwords
    const [anyWeak, setAnyWeak] = useState([]) // array of weak passwords
    
    const [searchBar, setSearchBar] = useState('') // this is the search bar state
    const [searchOptions, setSearchOptions] = useState([]) // this is the filtered array from the options above

    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    let filteredCredentials = []

    useEffect(() => { // this prevents a re-render of passwords page when the necessary data has ben recieved
        if (searchArray.length >= data?.loginCredentials.length) { // if more are added it may show larger than the inital render
            keepRendering.current = false
        }
    }, [searchArray])

    useEffect(() => { // this grabs the filtered data and updates the state
        if (searchBar == '') {
            setSearchOptions(filteredCredentials)
        } else {
            filteredCredentials = searchArray.filter(credential => 
                credential.website.toLowerCase().includes(searchBar.toLowerCase())
            )
        }
        setSearchOptions(filteredCredentials)
    }, [searchBar])

    function toggleRegisterPasswordVisibility() {
        setShowRegisterPassword(!showRegisterPassword)
    }

    function handleShowModal() {
        setShowModal(true)
    }

    function handleCloseModal() {
        setShowModal(false)
    }

    const headerStyle = { // outdated, I should put this in css
        marginBottom: '2vh',
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
    }

    async function newCredential(e) { // adds a new credential to the 2 arrays, search array and the decrypted data array, then adds to the db
        e.preventDefault()

        let newCredentialForm = {
            username: username,
            password: password,
            website: website
        }

        chrome.storage.local.get(['jwtToken', 'userId'], async function(result) {
            const userToken = result.jwtToken
            const userId = result.userId

            if (!userToken || !userId) {
                console.error('User token or ID is missing')
                return
            }

            try {
                const response = await fetch(`http://localhost:8080/credentials/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newCredentialForm)
                })

                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }

                const responseData = await response.json()

                console.log("RESPONSE IN CREATE: \n", responseData)

                // for (const key in responseData) { // this decrypts the new data coming from the DB, we need to pull it to get the new generated UUID
                //     if (key !== 'id' && responseData.hasOwnProperty(key)) {
                //         responseData[key] = decryptData(responseData[key], base64Key)
                //     }
                // }

                setSearchArray((prevSearchArray) => [...prevSearchArray, responseData])
                handleCloseModal()
                setReload(!reload)
                setUsername('')
                setPassword('')
                setWebsite('')
            } catch (error) {
                console.error('Error:', error)
            }
        })
    }

    useEffect(() => {console.log("SEARCH ARRAY: \n", searchArray)}, [searchArray])

    function handleInvalid(e) { // ensures the correct format for url's
        if (!e.target.value.endsWith('.com') && !e.target.value.endsWith('.org') && !e.target.value.endsWith('.io')) {
            e.target.setCustomValidity('The website should end with ".com" or ".org"')
            setToastMessage('The website should end with ".com" or ".org"')
        } else if (e.target.value == '') {
            e.target.setCustomValidity('This field is required. Please enter a valid website.')
            setToastMessage('This field is required. Please enter a valid website.')
        }
        setShowToast(true)
    }

    useEffect(() => {
        if(data) {
            setDataArray(data?.loginCredentials)
        }
    }, [data])

    return (
        <>
            <h1 style={headerStyle} className={darkMode ? `${showCompromisedPasswords && (anyCompromised.length > 0 || anyWeak.length > 0) ? 'title-compromised' : 'doto-title'}` : `${showCompromisedPasswords && (anyCompromised.length > 0 || anyWeak.length > 0) ? 'title-compromised' : 'light-mode-doto-title'}`}>SafePass</h1>
            <hr style={{ width: '90%', borderColor: '#37383a' }} />
                <Container className="rounded-3 p-3 pb-2 pt-0 shadow-sm d-flex justify-content-center align-items-center">
                    <Form className="d-flex w-100">
                        <FormControl
                            id="search"
                            name="search"
                            type="search"
                            placeholder="Search"
                            className={darkMode ? " form-control w-100 search text-white" : " form-control w-100 light-search text-black"}
                            aria-label="Search"
                            value={searchBar}
                            onChange={(e) => setSearchBar(e.target.value)}
                        />
                    </Form>
                </Container>
            <div style={{overflowY: 'scroll', width: '100%', height: '390px'}} className="no-change" >
                {loading ? (
                    "Loading...."
                ) : error ? (
                    <p>{error}</p>
                ) : ( search && searchBar != '' ? (
                    (searchOptions.map((secureData, idx) => (
                        <PasswordsPage key={idx} secureData={secureData} setDarkMode={setDarkMode} darkMode={darkMode} setSearchArray={setSearchArray} searchArray={searchArray} keepRendering={keepRendering} dataArray={dataArray} setDataArray={setDataArray} setSearchOptions={setSearchOptions} setShowCompromisedPasswords={setShowCompromisedPasswords} showCompromisedPasswords={showCompromisedPasswords} anyCompromised={anyCompromised} setAnyCompromised={setAnyCompromised} setAnyWeak={setAnyWeak} anyWeak={anyWeak} className="mb-2" />
                    )))
                ) : (dataArray.map((secureData, idx) => (
                        <PasswordsPage key={idx} secureData={secureData} setDarkMode={setDarkMode} darkMode={darkMode} setSearchArray={setSearchArray} searchArray={searchArray} keepRendering={keepRendering} dataArray={dataArray} setDataArray={setDataArray} setSearchOptions={setSearchOptions} setShowCompromisedPasswords={setShowCompromisedPasswords} showCompromisedPasswords={showCompromisedPasswords} anyCompromised={anyCompromised} setAnyCompromised={setAnyCompromised} setAnyWeak={setAnyWeak} anyWeak={anyWeak} className="mb-2" />
                    ))
                ))}
                <Container >
                    <Card className={darkMode ? "rounded-3 p-3 shadow-sm mx-1 my-2 text-white d-flex justify-content-center align-items-center card-hover mb-3" : "rounded-3 p-3 shadow-sm mx-1 my-2 text-black d-flex justify-content-center align-items-center light-mode-card-hover mb-3"} onClick={handleShowModal}>
                        <h1>+</h1>
                    </Card>
                </Container>
                <Modal show={showModal} onHide={handleCloseModal} centered className={darkMode ? "custom-modal" : "light-custom-modal"}>
                    <Modal.Header closeButton>
                        <Modal.Title className={darkMode ? "field text-white" : "field text-black"}>Add New Credential</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={newCredential}>
                            <Form.Group controlId="formWebsite">
                                <Form.Label className={darkMode ? "field text-white" : "field text-black"}>Website</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter website"
                                    value={website}
                                    onChange={(e) => {e.target.setCustomValidity(''); setWebsite(e.target.value)}}
                                    onInvalid={handleInvalid}
                                    required
                                    pattern=".*\.(com|org|io)$"
                                    className={darkMode ? 'dark-input' : 'light-input'}
                                />
                            </Form.Group>
                            <Form.Group controlId="formUsername" className="mt-3">
                                <Form.Label className={darkMode ? "field text-white" : "field text-black"}>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className={darkMode ? 'dark-input' : 'light-input'}

                                />
                            </Form.Group>
                            <Form.Group controlId="formPassword" className="mt-3">
                            <Form.Label className={darkMode ? "field text-white" : "field text-black"}>Password</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showRegisterPassword ? "text" : "password"}
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className={darkMode ? 'dark-input' : 'light-input'}
                                    />
                                    <span className="password-toggle-icon-with-generate" onClick={toggleRegisterPasswordVisibility}>
                                        {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                    <Button variant="secondary" onClick={() => setPassword(generatePassword())}>
                                        Generate
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                            <Button variant="primary" type="submit" className={darkMode ? 'custom-form-button mt-4' : 'light-mode-custom-form-button mt-4'}>
                                Save
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </div>
        </>
    )
}