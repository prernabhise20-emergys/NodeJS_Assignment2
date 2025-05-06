const createPrescription = (data, patientName, appointmentDate, age, gender, doctorName, specialization, birthDate) => {
    let tableRows = '';

    for (let i = 0; i < data.medicines.length; i++) {
        const morningTiming = data.morning[i] === 'both'
            ? 'before and after meal'
            : (data.morning[i] === false
                ? 'no'
                : (data.morning[i]
                    ? 'before meal'
                    : 'after meal'));

        const afternoonTiming = data.afternoon[i] === 'both'
            ? 'before and after meal'
            : (data.afternoon[i] === false
                ? 'no' :
                (data.afternoon[i]
                    ? 'before meal'
                    : 'after meal'));

        const eveningTiming = data.evening[i] === 'both'
            ? 'before and after meal'
            : (data.evening[i] === false
                ? 'no' :


                (data.evening[i]
                    ? 'before meal'
                    : 'after meal'));

        tableRows += `
            <tr>
                <td>${data.medicines[i]}</td>
                <td>${data.capacity[i]}</td>
                <td>${data.courseDuration[i]}</td>
                <td>${morningTiming}</td>
                <td>${afternoonTiming}</td>
                <td>${eveningTiming}</td>
                <td>${data.frequency[i]}</td>

            </tr>
        `;
    }

    return `
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                background-color: #b9cdd7;
            }
            .prescription-header {
                text-align: center;
                margin-bottom: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
            }
            th {
                background-color: #f4f4f4;
            }
            .date {
                float: right;
            }
            .details {
                margin-bottom: 20px;
            }
                .duration{
                float:left
                }
            .footer {
                margin-top: 40px;
                text-align: center;
                font-size: 14px;
                float: right;
            }
        </style>
        <body>
            <div class="prescription-header">
                <h1>City Care Medical Center</h1>
                <p><strong>Address:</strong> Sonchafa Colony, Bolhegaon Phata, Ahilyanagar</p>
                <p class="date">Date: ${appointmentDate}</p>
            </div>
            <div class="details">
                <p><strong>Patient Name:</strong> ${patientName}</p>
                <p><strong>Date of Birth:</strong> ${birthDate}</p>
                <p><strong>Age:</strong> ${age} years</p>
                <p><strong>Gender:</strong> ${gender}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Medicine</th>
                        <th>Capacity</th>
                        <th>Course Duration</th>
                        <th>Morning</th>
                        <th>Afternoon</th>
                        <th>Evening</th>
                        <th>Frequency</th>

                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
            <div class="footer">
                <p>________________________</p>
                <p>${doctorName}</p>
                <p>${specialization}</p>
            </div>
        </body>
    `;
};
export { createPrescription };
