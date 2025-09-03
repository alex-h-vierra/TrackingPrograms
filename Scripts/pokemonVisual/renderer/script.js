// document.addEventListener('DOMContentLoaded', () => {
//     const nextbtn = document.getElementById('next')
//     const prevBtn = document.getElementById('prev')
    const width = document.body.scrollWidth
    const height = document.body.scrollHeight
    window.api.resizeWindow(width, height)
//     const pokemonImage = document.getElementById('imageContainer')
//     const imageURL = window.api.readTextFile().trim().split('\n').map(line => JSON.parse(line))
//     let index = 0
//     function showImage() {
//         pokemonImage.setAttribute('href', imageURL[index].images.small)
//     }
//     nextbtn.addEventListener('click', () => {
//         index = (index + 1 ) % imageURL.length
//         showImage()
//     })
//     prevBtn.addEventListener('click', () => {
//         index = (index - 1 + imageURL.length) % imageURL.length
//         showImage()
//     })
//     showImage()
// })

document.addEventListener('DOMContentLoaded', async () => {
    const nextbtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const pokemonImage = document.getElementById('imageContainer');

    // Read and parse image URLs from text file
    const textData = await window.api.readTextFile(); // must return string
    const imageURL = textData.trim().split('\n').map(line => JSON.parse(line));

    let index = 0;

    function showImage() {
        const url = imageURL[index].images.small;
        pokemonImage.setAttribute('href', url); // or setAttributeNS for compatibility
    }

    nextbtn.addEventListener('click', () => {
        index = (index + 1) % imageURL.length;
        showImage();
    });

    prevBtn.addEventListener('click', () => {
        index = (index - 1 + imageURL.length) % imageURL.length;
        showImage();
    });

    showImage();
});