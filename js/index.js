const btnLogIn = document.getElementById("btn-log-in");
btnLogIn.addEventListener('click', () => {
    const userLogIn = document.getElementById('userLogIn');
    const userPin = document.getElementById('userPin');

    if (!userLogIn || !userPin || userLogIn.value === '' || userPin.value === '' || userLogIn.value !== 'raro12' || userPin.value !== '1234') {
        swal("Campos vacíos", "Por favor ingresa tu usuario y pin", "warning");
    } else {
        swal("Bienvenido", `Hola ${userLogIn.value}`, "success");
        window.location.href = 'dashboard.html'
    }
});