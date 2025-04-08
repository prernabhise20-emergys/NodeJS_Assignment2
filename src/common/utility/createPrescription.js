const createPrescription = (data, patientName, date, age, gender, doctorName, specialization, birthDate) => {
    console.log('data', data);
    console.log('Patient Name:', patientName);
    console.log('Date:', date);
    console.log(doctorName);

    let tableRows = '';
    for (let i = 0; i < data.medicines.length; i++) {
        tableRows += `
            <tr>
                <td>${data.medicines[i]}</td>
                <td>${data.capacity[i]}</td>
                <td>${data.dosage[i]}</td>
                <td>${data.frequency[i]}</td>
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
                .date{
                float:right;
                }
            .footer {
                margin-top: 40px;
                text-align: center;
                font-size: 14px;
                float:right;
            }
        </style>
        <body>
            <div class="prescription-header">
                <h1>Medical Prescription</h1>
                <p class="date">Date: ${date}</p>
                <p><strong> City Care Medical Center </strong></p>
            </div>
        
            <div class="details">
                <p><strong>Patient Name:</strong> ${patientName}</p>
                <p><strong>Date Of Birth:</strong> ${birthDate}</p>
                <p><strong>Age:</strong> ${age} year</p>
                <p><strong>Gender:</strong> ${gender}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Medicine</th>
                        <th>Capacity</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
            <div class="footer">
            <p>${doctorName}
                <p>${specialization}</p>
            </div>
        </body>
        </html>
    `;
};

export { createPrescription };
