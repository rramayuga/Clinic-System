document.getElementById('admin-link').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('login-form').action = '/admin-login';
});

document.getElementById('patient-link').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('login-form').action = '/patient-login';
});

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const response = await fetch(form.action, {
        method: 'POST',
        body: new URLSearchParams(formData)
    });

    if (response.ok) {
        const redirectUrl = await response.text();
        window.location.href = redirectUrl;
    } else {
        alert('Login failed');
    }
});
