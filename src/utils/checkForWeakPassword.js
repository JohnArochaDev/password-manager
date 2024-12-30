export default function checkForWeakPassword(password) {

    let responseObject = {
        weak: false,
        reason: ''
    }

    if(password.length < 8) {
        responseObject.weak = true
        responseObject.reason = 'Password to short'
        return responseObject
    }

    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /[0-9]/.test(password)
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if(!hasUpperCase) {
        responseObject.weak = true
        responseObject.reason = 'Password should include capital letters'
        return responseObject 
    } else if (!hasLowerCase) {
        responseObject.weak = true
        responseObject.reason = 'Password should include lower case letters'
        return responseObject
    } else if (!hasNumbers) {
        responseObject.weak = true
        responseObject.reason = 'Password should include numbers'
        return responseObject
    } else if (!hasSpecialChars) {
        responseObject.weak = true
        responseObject.reason = 'Password should include special characters'
        return responseObject
    }

    if (/(\w)\1\1/.test(password)) {
        responseObject.weak = true
        responseObject.reason = 'Password contains repetitive characters'
        return responseObject
    }

    return responseObject
}