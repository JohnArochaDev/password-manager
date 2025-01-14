import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap'
import { useState, useEffect, useRef } from 'react'
import { FaCopy } from 'react-icons/fa'
import checkForCompromise from '../../utils/checkForCompromise'
import checkForWeakPassword from "../../utils/checkForWeakPassword"
import './UserData.css'

export default function UserData({ secureData, setClicked, setDarkMode, darkMode, handleDelete, credentials, setCredentials, setDataArray, dataArray, setSearchArray, setSearchOptions, showCompromisedPasswords, setShowCompromisedPasswords, anyCompromised, setAnyCompromised, setAnyWeak, anyWeak }) {
    const [passShow, setPassShow] = useState(false)
    const [buttonSwitch, setButtonSwitch] = useState(false)

    const [compromised, setCompromised] = useState(false)
    const [weak, setWeak] = useState(false)

    const [credentialId, setCredentialId] = useState('')
    const [userToken, setUserToken] = useState('')

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const isInitialRender = useRef(true)

    const [responseObject, setResponseObject] = useState({})

    function showPass() {
        if (!buttonSwitch) {
            setPassShow(!passShow)
        }
    }

    useEffect(() => {
        if (isInitialRender.current) { // prevents data from being overwritten, and only writes on the every first load
            isInitialRender.current = false
            setUsername(secureData.username)
            setPassword(secureData.password)
            
            checkForCompromise(secureData.password).then(isCompromised => {
                if (isCompromised) {
                    setCompromised(true)
                } else {
                    if (!anyWeak.find(object => 
                        object.website === secureData.website &&
                        object.username === secureData.username &&
                        object.password === secureData.password
                    )) {
                        setCompromised(false)
                    }    
                }

                const responseObject = checkForWeakPassword(secureData.password)
                setResponseObject(responseObject)

                if (responseObject.weak === true) {
                    setCompromised(true)
                    setWeak(true)    
                } else {
                    if (!anyCompromised.find(object => 
                        object.website === secureData.website &&
                        object.username === secureData.username &&
                        object.password === secureData.password
                    )) {
                        setCompromised(false)
                    }    
                    setWeak(false)
                }
            })
        }
    }, [])
    
    async function handleDeleteClick() {
        try {
            const response = await fetch(`http://localhost:8080/credentials/${credentialId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                },
            })
            if (response.ok) {
                handleDelete()
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    async function handleEdit(e) {
        e.preventDefault()
        setPassShow(false)
        setButtonSwitch(true)
    
        let updatedData = {
            id: secureData.id,
            username: username,
            password: password,
            website: secureData.website
        }
    
        try {
            const response = await fetch(`http://localhost:8080/credentials/${credentialId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            })
            if (response.ok) {
                setButtonSwitch(false)
                setDataArray((prevDataArray) => prevDataArray.map((credential) => { // updates the original array
                    if (credential.id === updatedData.id) {
                        return updatedData
                    }
                    return credential
                }))
                setSearchArray((prevSearchArray) => prevSearchArray.map((credential) => { // updates the clones decrypted array
                    if (credential.id === updatedData.id) {
                        return updatedData
                    }
                    return credential
                }))
                setSearchOptions((prevSearchOptions) => prevSearchOptions.map((credential) => { // updates the clone array thats filtered
                    if (credential.id === updatedData.id) {
                        return updatedData
                    }
                    return credential
                }))
            }
    
            await checkForCompromise(updatedData.password).then(isCompromised => {
                if (isCompromised) {
                    new Promise((resolve) => {
                        setAnyCompromised((prevAnyCompromised) => {
                            const updatedCompromised = [...prevAnyCompromised, updatedData]
                            resolve(updatedCompromised)
                            return updatedCompromised
                        })
                    }).then((updatedCompromised) => {
                        setCompromised(true)
    
                        // Check for weak password after updating anyCompromised
                        const responseObject = checkForWeakPassword(updatedData.password)
                        setResponseObject(responseObject)
                        if (responseObject.weak === true) {
                            setAnyWeak((prevAnyWeak) => [...prevAnyWeak, updatedData])
                            setCompromised(true)
                            setWeak(true)
                        } else {
                            setAnyWeak(prevDataArray => prevDataArray.filter(data => data.id !== updatedData.id))
                            setWeak(false)
                            if (!updatedCompromised.find(object => 
                                object.website === updatedData.website &&
                                object.username === updatedData.username &&
                                object.password === updatedData.password
                            )) {
                                setCompromised(false)
                            }
                        }
                    })
                } else {
                    new Promise((resolve) => {
                        setAnyCompromised((prevDataArray) => {
                            const updatedCompromised = prevDataArray.filter(data => data.id !== updatedData.id)
                            resolve(updatedCompromised)
                            return updatedCompromised
                        })
                    }).then((updatedCompromised) => {
                        if (!anyWeak.find(object => 
                            object.website === updatedData.website &&
                            object.username === updatedData.username &&
                            object.password === updatedData.password
                        )) {
                            setCompromised(false)
                        }
    
                        // Check for weak password after updating anyCompromised
                        const responseObject = checkForWeakPassword(updatedData.password)
                        setResponseObject(responseObject)
                        if (responseObject.weak === true) {
                            setAnyWeak((prevAnyWeak) => [...prevAnyWeak, updatedData])
                            setCompromised(true)
                            setWeak(true)
                        } else {
                            setAnyWeak(prevDataArray => prevDataArray.filter(data => data.id !== updatedData.id))
                            setWeak(false)
                            if (!updatedCompromised.find(object => 
                                object.website === updatedData.website &&
                                object.username === updatedData.username &&
                                object.password === updatedData.password
                            )) {
                                setCompromised(false)
                            }
                        }
                    })
                }
            })
    
        } catch (error) {
            console.error('Error:', error)
        }
    }
    
    useEffect(() => { // grabs the users token every time the card opens
        setCredentialId(secureData.id)

        chrome.storage.local.get(['jwtToken', 'userId'], function(result) {
            setUserToken(result.jwtToken)
        })
    }, [secureData.id])

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
        }).catch(err => {
            console.error('Failed to copy:', err)
        })
    }

    return (
        <Container className="w-100 d-flex flex-column justify-content-between align-items-center text-white">
            <Form onSubmit={handleEdit} className="w-100">
                <Button className={darkMode ? "x-button no-padding no-margin mb-3" : "light-mode-x-button no-padding no-margin mb-3"} onClick={() => setClicked(null)} style={{ position: 'absolute', top: '10px', right: '10px' }}>X</Button>                
                <Row className="w-100 m-0 p-0">
                    <Col className="d-flex justify-content-center">
                        {secureData.website.length >= 25 ? (
                                <p className={darkMode ? "text-white" : "text-black"}>{secureData.website.substring(0, 25)}...</p>
                            ) : (
                                <p className={darkMode ? "text-white" : "text-black"}>{secureData.website}</p>
                            )
                        }
                    </Col>
                </Row>
                <Row className="mb-4 mt-3">
                    <Col xs={4} className="text-start pt-2">
                        <p className={darkMode ? "field text-white" : "field text-black"}>Username:</p>
                    </Col>
                    <Col xs={8} className="text-end">
                        <InputGroup>
                            <Form.Control
                                id="username" 
                                name="username"                         
                                type="text"
                                value={username}
                                readOnly={!buttonSwitch}
                                className={darkMode ? "form-control dark-input field" : "form-control light-input field"}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <Button variant="secondary" onClick={() => copyToClipboard(username)} className="copy-button">
                                <FaCopy />
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col xs={4} className='pt-2' >
                        <p className={darkMode ? "field text-white" : "field text-black"}>Password:</p>
                    </Col>
                    <Col xs={8}>
                        <InputGroup>
                            <Form.Control
                                id="password" 
                                name="password" 
                                type={buttonSwitch || passShow ? "text" : "password"}
                                value={password}
                                readOnly={!buttonSwitch}
                                className={darkMode ? `form-control dark-input field ${compromised && showCompromisedPasswords ? 'compromised' : ''}` : `form-control light-input field ${compromised && showCompromisedPasswords ? 'compromised' : ''}`}
                                onChange={(e) => setPassword(e.target.value)}
                                onClick={() => showPass()}
                            />
                            <Button variant="secondary" onClick={() => copyToClipboard(password)} className="copy-button">
                                <FaCopy />
                            </Button>
                        </InputGroup>
                        {weak ? (
                            showCompromisedPasswords && (
                                <div className="popup">
                                    {responseObject?.reason ? responseObject.reason : 'working on it'}
                                </div>
                            )
                        ) : (
                            compromised && showCompromisedPasswords && (
                                <div className="popup">
                                    Your password has been found in a data breach
                                </div>
                            )
                        )}
                    </Col>
                </Row>
                <Row className="w-100 d-flex justify-content-between align-items-center" style={{ marginLeft: '0px' }}> {/* this is needed to overwrite something in boostrap that forces an uneven margin */}
                    <Col xs="auto">
                        {buttonSwitch ? 
                            <Button className={darkMode ? `text-white ${compromised && showCompromisedPasswords ? 'compromised-bigger' : 'card-button'}` : `text-black ${compromised && showCompromisedPasswords ? 'compromised-bigger-light' : 'light-card-button'}`} style={{ width: `100px` }} onClick={() => {setButtonSwitch(false); setPassShow(false)}}>Cancel</Button> :
                            <Button className={darkMode ? `text-white ${compromised && showCompromisedPasswords ? 'compromised-bigger' : 'card-button'}` : `text-black ${compromised && showCompromisedPasswords ? 'compromised-bigger-light' : 'light-card-button'}`} style={{ width: `100px` }} onClick={() => {setButtonSwitch(true); setPassShow(false)}}>Edit</Button>
                        }
                    </Col>
                    <Col xs="auto">
                        {buttonSwitch ? 
                            <Button className={darkMode ? `text-white ${compromised && showCompromisedPasswords ? 'compromised-bigger' : 'card-button'}` : `text-black ${compromised && showCompromisedPasswords ? 'compromised-bigger-light' : 'light-card-button'}`} type="submit" style={{ width: `100px` }}>Confirm</Button> : 
                            <Button className={darkMode ? `text-white ${compromised && showCompromisedPasswords ? 'compromised-bigger' : 'card-button'}` : `text-black ${compromised && showCompromisedPasswords ? 'compromised-bigger-light' : 'light-card-button'}`} style={{ width: `100px` }} onClick={handleDeleteClick}>Delete</Button>
                        }
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}