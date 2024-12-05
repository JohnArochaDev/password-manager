import PasswordsPage from "../PasswordsPage/PasswordsPage"
import Card from 'react-bootstrap/Card'

// Will need to copy all styling and information over to the real app, but need to work here for now because 'chrome' is not accessable from a tab but it is from a extension


export default function TempApp() {
    let arr = [0, 1, 2, 3, 4, 5, 6, 7]

    const headerStyle = {
        paddingTop: '7vh',
        marginBottom: '7vh',
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
    };

    return (
        <>
            <h1 style={headerStyle}>Password Manager</h1>
            <hr style={{ width: '90%', borderColor: '#1e90ff' }} />
            {arr.map((secureData) => (
                <PasswordsPage secureData={secureData} arr={arr} className="mb-2" />
            ))}
        </>
    );
}