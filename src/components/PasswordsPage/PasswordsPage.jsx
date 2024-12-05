import { Container} from 'react-bootstrap';
import UserData from "../UserData/UserData"

export default function PasswordsPage() { // import all the passwords from a specific user and map over them
    
    return (
        <>
            {/* Add a map over data from a specific user */}
            <Container>
                <UserData />
            </Container>
        </>
    )
}