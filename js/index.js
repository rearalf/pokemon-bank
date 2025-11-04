import { getUsers, setUsers } from "./storage.js";


document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault()
    const pinInput = document.getElementById('pin');
    const pinError = document.getElementById('pin-error');

    const users = [...getUsers()]

    const formData = { pin: pin.value };

    // Definimos las restricciones
    const constraints = {
        pin: {
            presence: { allowEmpty: false, message: "es obligatorio" },
            numericality: {
                onlyInteger: true,
                message: "debe contener solo números"
            },
            length: {
                minimum: 4,
                maximum: 6,
                message: "debe tener entre 4 y 6 dígitos"
            }
        }
    };

    const errors = validate(formData, constraints);

    pinError.textContent = "";
    pinInput.classList.remove('is-invalid');
    pinInput.classList.add('is-valid');

    if (errors) {
        pinError.textContent = errors.pin ? errors.pin[0] : "Error de validación";
        pinInput.classList.add('is-invalid');
        return;
    }

    const user = users.find(item => item.pin === pinInput.value.trim());

    if (user) {
        swal("Bienvenido", `Hola ${user.name || "Usuario"}`, "success");
        window.location.href = 'dashboard.html';
    } else {
        swal("Error", "PIN incorrecto o usuario no encontrado", "error");
        pinInput.classList.add('is-invalid');
        pinError.textContent = 'PIN incorrecto o usuario no encontrado'
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const users = getUsers()
    if (users.length === 0) {
        setUsers({
            name: 'Ash Ketchum',
            pin: '1234',
            cuanta: '0987654321',
            balance: 500
        })
    }
})