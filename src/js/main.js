

async function spotifyLoad() {
    const responseText = document.getElementById('listen');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 500);

    try {
        const res = await fetch('.netlify/functions/spotify', { signal: controller.signal });
        clearTimeout(timeoutId);
        const response = await res.json();
        responseText.innerHTML = response.artist;
        responseText.href = response.url;
    } catch (err) {
        clearTimeout(timeoutId);
        console.log(err);
        responseText.innerHTML = 'Radiohead';
        responseText.href = 'https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb';
    }
    responseText.classList.add('loaded');
}

async function bgLoad() {
    const script = document.createElement('script');
    script.src = '/js/pocoloco.js';
    script.onload = () => {
        let gradient = new Gradient();
        gradient.initGradient("#canvas");
        document.getElementById('canvas').classList.add('loaded');
    };
    script.onerror = () => {
        document.getElementsByClassName('bg')[0].classList.add('fallback');
    };
    document.body.appendChild(script);
}


document.addEventListener('DOMContentLoaded', async () => {
    spotifyLoad();
    bgLoad();
    console.log("%cWhat are you looking at? 👀", "font-weight: bold; font-size: 24px; font-family: Arial;");
});