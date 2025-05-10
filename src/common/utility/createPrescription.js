



const createPrescription = (data, patientName, appointmentDate, age, gender, doctorName, specialization, birthDate) => {
    let tableRows = '';

    for (let i = 0; i < data.medicines.length; i++) {
        const morningTiming = data.morning[i] || 'No';
        const afternoonTiming = data.afternoon[i] || 'No';
        const eveningTiming = data.evening[i] || 'No';
        const notesText = data.notes[i] !== "" ? data.notes[i] : "No additional notes";
        const capacityText = data.capacity[i] || "Not specified";
        const courseDurationText = data.courseDuration[i] || "Not specified";

        const dosageData = data.dosage[i] || {};
        const morningDosage = dosageData.morning || 'Not specified';
        const afternoonDosage = dosageData.afternoon || 'Not specified';
        const eveningDosage = dosageData.evening || 'Not specified';

        tableRows += `
            <tr>
                <td>${data.medicines[i]}</td>
                <td>${capacityText}</td>
                <td>${courseDurationText}</td>
                <td>${morningTiming} - ${morningDosage}</td>
                <td>${afternoonTiming} - ${afternoonDosage}</td>
                <td>${eveningTiming !== '' ? eveningTiming : 'No'} - ${eveningDosage}</td>
                <td>${notesText}</td>
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
                        <th>Capacity (mg)</th>
                        <th>Course Duration (days)</th>
                        <th>Morning (dosage)</th>
                        <th>Afternoon (dosage)</th>
                        <th>Evening (dosage)</th>
                        <th>Notes</th>
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
