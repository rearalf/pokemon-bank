export const getUsers = () => JSON.parse(localStorage.getItem('users')) || []

export const setUsers = (users) => {
    const user = getUsers()
    user.push(users)
    localStorage.setItem('users', JSON.stringify([...user]))
}