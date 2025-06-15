function replaceAt(str,index,replace) {
    if (index > str.length - 1 || index < 0) return str;
    return str.substring(0, index) + replace + str.substring(index + 1);
}

const spotifyLoad = async () => {
    const responseText = document.getElementById('listen');
    const response = await fetch('.netlify/functions/spotify')
    .then(res => res.json())
    .catch(err => {
        console.log(err);
        return {
            artist: 'Radiohead',
            url: 'https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb'
        }
    });

    let artistName = replaceAt(response.artist, response.artist.lastIndexOf(" "), "&nbsp;");
    responseText.innerHTML = artistName;
    responseText.href = response.url;
    responseText.classList.add('loaded');
}

const bgLoad = async () => {
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