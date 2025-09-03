const width = document.body.scrollWidth
const height = document.body.scrollHeight
window.api.resizeWindow(width, height)
document.addEventListener('DOMContentLoaded', async () => {
    const textData = await window.api.readTextFile(); 
    const nextbtn = document.getElementById('next')
    const prevBtn = document.getElementById('prev')
    const pokemonImage = document.getElementById('imageContainer')
    const boxCount = document.getElementById('boxCount')
    const imageURL = textData.trim().split('\n').map(line => JSON.parse(line))
    let index = 0
    showImage()
    function showImage() {
    const url = imageURL[index].images.small
        pokemonImage.setAttribute('href', url) 
    }
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
                    index = boxInput - 1
                    showImage()
                } else {
                    alert(`Please enter a number between 1 and ${imageURL.length}`)
                }
            } else {
                alert('Please enter a valid integer')
            }
            
            boxCount.value = ''
        }       
    })
})