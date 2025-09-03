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
    const nextbtn = document.getElementById('next')
    const prevBtn = document.getElementById('prev')
    const pokemonImage = document.getElementById('imageContainer')
    const boxCount = document.getElementById('boxCount')
    const textData = await window.api.readTextFile(); 
    const imageURL = textData.trim().split('\n').map(line => JSON.parse(line))
    let index = 0
    function showImage() {
        const url = imageURL[index].images.small
        pokemonImage.setAttribute('href', url) 
    }
    showImage()
    nextbtn.addEventListener('click', () => {
        index = (index + 1) % imageURL.length
        showImage()
    })
    prevBtn.addEventListener('click', () => {
        index = (index - 1 + imageURL.length) % imageURL.length
        showImage()
    })
    boxCount.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const boxInput = Number(boxCount.value.trim());

            if (!isNaN(boxInput) && Number.isInteger(boxInput)) {
                if (boxInput >= 1 && boxInput <= imageURL.length) {
                    index = boxInput - 1; // adjust for 0-indexed array
                    showImage();
                } else {
                    alert(`Please enter a number between 1 and ${imageURL.length}`);
                }
            } else {
                alert('Please enter a valid integer');
            }

            boxCount.value = ''; // clear input after Enter
        }       
    });
})