import { useState } from "react";
import { Container} from 'react-bootstrap';
import UserData from "../UserData/UserData"
import Card from 'react-bootstrap/Card'

export default function PasswordsPage({ secureData, arr }) { // import all the passwords from a specific user and map over them
    const [clicked, setClicked] = useState(false)
    
    return (
        <>
            {/* Add a map over data from a specific user */}
            <Container onClick={() => setClicked(!clicked)}> 
                {clicked ? (
                    <Card className="border-primary rounded-3 p-3 shadow-sm mx-1" style={{ backgroundColor: '#1f1f1f', width: '90vw' }}>
                        <UserData secureData={secureData} />
                    </Card>
                ) : (
                    <Card className="border-primary rounded-3 p-3 shadow-sm mx-1" style={{ backgroundColor: '#1f1f1f', width: '90vw' }}>
                        <p>https://www.myurl.com/something</p>
                    </Card>
                )}
            </Container>
        </>
    )
}