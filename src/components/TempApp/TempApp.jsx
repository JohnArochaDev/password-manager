import PasswordsPage from "../PasswordsPage/PasswordsPage"
import Card from 'react-bootstrap/Card'

// Will need to copy all styling and information over to the real app, but need to work here for now because 'chrome' is not accessable from a tab but it is from a extension


export default function TempApp() {
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
            <hr style={{ width: '90%', borderColor: '#1e90ff' }} /> {/* Add a horizontal line */}
            <Card className="border-primary rounded-3 p-3 shadow-sm mx-1" style={{ backgroundColor: '#1f1f1f', width: '90vw' }}>
                <PasswordsPage />
            </Card>
        </>
    );
}