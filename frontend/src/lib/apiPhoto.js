export default async function apiPhoto(listingId, file, order) {
    const formData = new FormData();

    formData.append('uploaded_file', file);
    formData.append('listingId', listingId);
    formData.append('order', order);

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/photos`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to upload photo: ${response.statusText}`);
    }

    return await response.json();
}