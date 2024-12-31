import CryptoJS from 'crypto-js';


export default async function checkForCompromise(password) {
    const hashedPass = shaHash(password)
    const prefix = hashedPass.substring(0, 5)
    const suffix = hashedPass.substring(5).toUpperCase()

    try {
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
            method: 'GET'
        })
        const data = await response.text()
        const hashes = data.split('\n')

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        for (const line of hashes) {
            const [hashSuffix, count] = line.split(':');
            if (hashSuffix === suffix) {
                return true; // compromised
            }
        }
        return false // safe
    } catch (error) {
        console.error('Ran into an issue while checking if the password is compromised: ', error)
        return false
    }
}

function shaHash(password) {
    return CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex).toUpperCase();
}