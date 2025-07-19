// utils/sendToSheet.ts
export const sendToSheet = async (data: {
    name: string;
    email: string;
    phone: string;
    prize: string;
}) => {
    const url = 'https://script.google.com/macros/s/AKfycbymfjLtPy8QIWZLY5CABnJF0AmropaLQ4uWt7Cso7EwTQrBEB9IPkWFn2ZIy3QjhGyD/exec';

    const formData = new URLSearchParams();
    formData.append('Name', data.name);
    formData.append('Email', data.email);
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
