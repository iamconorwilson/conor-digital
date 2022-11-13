function replaceAt(str,index,replace) {
    if (index > str.length - 1 || index < 0) return str;
    return str.substring(0, index) + replace + str.substring(index + 1);
}

document.addEventListener('DOMContentLoaded', async () => {
    const responseText = document.getElementById('listen')
    const response = await fetch('.netlify/functions/spotify').then(res => res.json())
    let artistName = replaceAt(response.artist, response.artist.lastIndexOf(" "), "&nbsp;");
    responseText.innerHTML = artistName;
    responseText.href = response.url;
})