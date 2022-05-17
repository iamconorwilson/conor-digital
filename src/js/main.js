document.addEventListener('DOMContentLoaded', async () => {
    const responseText = document.getElementById('listen')
    const response = await fetch('.netlify/functions/spotify').then(res => res.json())
    responseText.innerText = response.artist;
    responseText.href = response.url;
})