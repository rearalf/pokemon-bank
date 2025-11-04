import { today } from "./constants.js"

export const getUsers = () => JSON.parse(localStorage.getItem('users')) || []

export const setUsers = (users) => {
    const user = getUsers()
    user.push(users)
    localStorage.setItem('users', JSON.stringify([...user]))
}

export const setSession = (user) =>
    localStorage.setItem('session', JSON.stringify(user))

export const getSession = () => localStorage.getItem('session')

export const deleteSession = () => localStorage.removeItem('session')

export const getBalance = () => {
    const userSession = getSession()
    if (userSession === null)
        window.location.href = 'index.html';
    return JSON.parse(userSession).balance
}

export const getHistory = () => {
    const userSession = getSession()
    if (userSession === null)
        window.location.href = 'index.html';
    const history = JSON.parse(userSession).history
    return history
}

export const setHistory = (type, service, amount) => {
    const userSession = getSession()
    if (userSession === null)
        window.location.href = 'index.html';

    const users = getUsers()
    const userIndex = users.findIndex(u => u.pin === JSON.parse(userSession).pin)
    if (userIndex === -1) window.location.href = 'index.html';

    const newHistory = {
        date: today(),
        type,
        amount,
        service
    }

    // deposit | withdrawal | payment
    if (type === 'deposit') {
        users[userIndex].balance = (users[userIndex].balance || 0) + amount
        users[userIndex].history = users[userIndex].history || []
        users[userIndex].history.push(newHistory)
    }
    else {
        users[userIndex].balance = (users[userIndex].balance || 0) - amount
        users[userIndex].history = users[userIndex].history || []
        users[userIndex].history.push(newHistory)
    }

    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('session', JSON.stringify(users[userIndex]))

    return users[userIndex]
}