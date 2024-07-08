document.getElementById('add-patient-link').addEventListener('click', () => {
    document.getElementById('admin-section').innerHTML = `
        <form id="add-patient-form">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
            <label for="age">Age:</label>
            <input type="number" id="age" name="age" required>
            <label for="medical_history">Medical History:</label>
            <textarea id="medical_history" name="medical_history" required></textarea>
            <button type="submit">Add Patient</button>
        </form>
    `;

    document.getElementById('add-patient-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        const response = await fetch('/add-patient', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Patient added successfully');
        } else {
            alert('Error adding patient');
        }
    });
});

document.getElementById('remove-patient-link').addEventListener('click', () => {
    document.getElementById('admin-section').innerHTML = `
        <form id="remove-patient-form">
            <label for="id">Patient ID:</label>
            <input type="number" id="id" name="id" required>
            <button type="submit">Remove Patient</button>
        </form>
    `;

    document.getElementById('remove-patient-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        const response = await fetch('/remove-patient', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Patient removed successfully');
        } else {
            alert('Error removing patient');
        }
    });
});

document.getElementById('search-patient-link').addEventListener('click', () => {
    document.getElementById('admin-section').innerHTML = `
        <form id="search-patient-form">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
            <button type="submit">Search Patient</button>
        </form>
        <div id="search-results"></div>
    `;

    document.getElementById('search-patient-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        const response = await fetch(`/search-patient?name=${formData.get('name')}`);

        if (response.ok) {
            const patients = await response.json();
            const resultsDiv = document.getElementById('search-results');
            resultsDiv.innerHTML = patients.map(patient => `
                <div>
                    <p>ID: ${patient.id}</p>
                    <p>Name: ${patient.name}</p>
                    <p>Age: ${patient.age}</p>
                    <p>Medical History: ${patient.medical_history}</p>
                </div>
            `).join('');
        } else {
            alert('Error searching patients');
        }
    });
});

document.getElementById('diagnose-patient-link').addEventListener('click', () => {
    document.getElementById('admin-section').innerHTML = `
        <form id="diagnose-patient-form">
            <label for="patient_id">Patient ID:</label>
            <input type="number" id="patient_id" name="patient_id" required>
            <label for="diagnosis">Diagnosis:</label>
            <textarea id="diagnosis" name="diagnosis" required></textarea>
            <button type="submit">Add Diagnosis</button>
        </form>
    `;

    document.getElementById('diagnose-patient-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        const response = await fetch('/diagnose-patient', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Diagnosis added successfully');
        } else {
            alert('Error adding diagnosis');
        }
    });
});

document.getElementById('view-patients-link').addEventListener('click', async () => {
    const response = await fetch('/view-patients');
    if (response.ok) {
        const patients = await response.json();
        const adminSection = document.getElementById('admin-section');
        adminSection.innerHTML = patients.map(patient => `
            <div>
                <p>ID: ${patient.id}</p>
                <p>Name: ${patient.name}</p>
                <p>Age: ${patient.age}</p>
                <p>Medical History: ${patient.medical_history}</p>
            </div>
        `).join('');
    } else {
        alert('Error fetching patients');
    }
});

document.getElementById('view-diagnoses-link').addEventListener('click', async () => {
    const response = await fetch('/view-diagnoses');
    if (response.ok) {
        const diagnoses = await response.json();
        const adminSection = document.getElementById('admin-section');
        adminSection.innerHTML = diagnoses.map(diagnosis => `
            <div>
                <p>Patient Name: ${diagnosis.name}</p>
                <p>Diagnosis: ${diagnosis.diagnosis}</p>
            </div>
        `).join('');
    } else {
        alert('Error fetching diagnoses');
    }
});

document.getElementById('print-link').addEventListener('click', () => {
    window.print();
});

