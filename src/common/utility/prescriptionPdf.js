import puppeteer from "puppeteer";
import {createPrescription} from '../utility/createPrescription.js';

const generatePdf = async (data, patientName, formattedAppointmentDate, age, gender, doctorName, specialization, formattedBirthDate) => {
    const browser = await puppeteer.launch({
        headless: true, 
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (request) => {
        request.continue();
    });

    const prescriptionHTML = createPrescription(data, patientName, formattedAppointmentDate, age, gender, doctorName, specialization, formattedBirthDate);
    await page.setContent(prescriptionHTML);

    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    return pdfBuffer; 
};
export {generatePdf};