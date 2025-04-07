const createPrescription = (data, patientName, date) => {
    console.log('data', data);
    console.log(patientName);
    console.log(date);

    let tableRows = '';
    for (let i = 0; i < data.medicines.length; i++) {
        tableRows +=         
        `
            <tr>
                <td>${data.medicines[i]}</td>
                <td>${data.capacity[i]}</td>
                <td>${data.dosage[i]}</td>
                <td>${data.before_meal[i] ? 'true' : 'false'}</td>
                <td>${data.after_meal[i] ? 'true' : 'false'}</td>
            </tr>
        `;
    }

    return `
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                padding: 0;
            }
            .prescription-header {
                text-align: center;
                margin-bottom: 20px;
            }
            .details {
                margin-bottom: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                border: 1px solid #ccc;
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #f4f4f4;
            }
        </style>
        <body>
            <div class="prescription-header">
                <h1>Medical Prescription</h1>
            </div>
            <div class="details">
                <p><strong>Patient Name:</strong> ${patientName}</p>
                <p><strong>Date:</strong> ${date}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Medicine</th>
                        <th>Capacity</th>
                        <th>Dosage</th>
                        <th>Before Meal</th>
                        <th>After Meal</th>
                    </tr>
                    
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </body>
        </html>
    `;
};

export { createPrescription };
