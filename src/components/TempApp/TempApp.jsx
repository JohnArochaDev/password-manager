import PasswordsPage from "../PasswordsPage/PasswordsPage"
import Card from 'react-bootstrap/Card'

// Will need to copy all styling and information over to the real app, but need to work here for now because 'chrome' is not accessable from a tab but it is from a extension

export default function TempApp() {

    const headerStyle = {
        marginTop: '20vh',
        marginBottom: '7vh',
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
    };

    const cardBackground = {
        backgroundColor : '#1f1f1f'
    }

    return (
        <>
            <h1 style={headerStyle} >Password Manager</h1>
            {/* put a line under this that goes almost all the way across in a dark but ligher blue for a proper seperation  */}
            <Card className="border-primary rounded-3 p-3 shadow-sm" style={cardBackground}>
                {/* This will be a small wide rounded boox with a url and its coresponding icon than once clicked shows what is below  */}
                <PasswordsPage />
            </Card>
        </>
    )
}