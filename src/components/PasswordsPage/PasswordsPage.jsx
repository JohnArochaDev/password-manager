import { useState } from "react";
import { Container} from 'react-bootstrap';
import UserData from "../UserData/UserData"
import Card from 'react-bootstrap/Card'

export default function PasswordsPage({ secureData }) { // import all the passwords from a specific user and map over them
    const [clicked, setClicked] = useState(false)
    console.log(secureData)

    
    return (
        <>
            {/* Add a map over data from a specific user */}
            <Container onClick={() => setClicked(!clicked)}> 
                {clicked ? (
                    <Card className="rounded-3 p-3 shadow-sm mx-1 my-2" style={{ backgroundColor: '#344955', width: '90vw', borderColor: '#50727B', borderWidth: '1px', borderStyle: 'solid' }}>
                        <UserData secureData={secureData} />
                    </Card>
                ) : (
                    <Card className="rounded-3 p-3 shadow-sm mx-1 my-2 text-white d-flex justify-content-center align-items-center" style={{ backgroundColor: '#344955', width: '90vw', height: '100%', borderColor: '#50727B', borderWidth: '1px', borderStyle: 'solid' }}>
                        <p>{secureData.website}</p>
                    </Card>
                )}
            </Container>
        </>
    )
}