const chars = [
    'abcdefghijklmnopqrstuvwxyz'.split(''),
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    '0123456789'.split(''),
    '!@#$%^&*()_+[]{}|;:,.<>?'.split('')
]

export default function generatePassword() {
    let newPass = ''

    while (newPass.length < 15) {
        let randomArr = chars[Math.floor(Math.random() * chars.length)]
        let randomChar = randomArr[Math.floor(Math.random() * randomArr.length)]

        newPass += randomChar
    }
    return newPass
}