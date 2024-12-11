import { useState } from "react";
import { Container} from 'react-bootstrap';
import UserData from "../UserData/UserData"
import Card from 'react-bootstrap/Card'
import "./passwordPage.css"

export default function PasswordsPage({ secureData }) { // import all the passwords from a specific user and map over them
    const [clicked, setClicked] = useState(false)
    console.log(secureData)

    
    return (
        <>
            {/* Add a map over data from a specific user */}
            <Container onClick={() => setClicked(!clicked)}> 
                {clicked ? (
                    <Card className="rounded-3 p-3 shadow-sm mx-1 my-2 card-hover">
                        <UserData secureData={secureData} />
                    </Card>
                ) : (
                    <Card className="rounded-3 p-3 shadow-sm mx-1 my-2 text-white d-flex justify-content-center align-items-center card-hover">
                        <p>{secureData.website}</p>
                    </Card>
                )}
                {/* // Add a card here with a big plus that would allow a user to add a new credential */}
            </Container>
        </>
    )
}