// utils/sendToSheet.ts
export const sendToSheet = async (data: {
    name: string;
    email?: string; // email is now optional
    phone: string;
    prize: string;
}) => {
    const url = 'https://script.google.com/macros/s/AKfycbwTeSQcM2FeBToD1V50GUtkptjeGCWIqQF97dJ95LHx-NiY8xt4JpneupsHQIKnk37R/exec';

    const formData = new URLSearchParams();
    formData.append('Name', data.name);
    formData.append('Email', data.email || ''); // use empty string if undefined
    formData.append('Phone', data.phone);
    formData.append('Prize', data.prize);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        const result = await response.text();
        console.log('✅ Sent to Google Sheets:', result);
    } catch (error) {
        console.error('❌ Error sending to Google Sheets:', error);
    }
};
