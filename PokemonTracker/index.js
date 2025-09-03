import {google} from 'googleapis'
import secrets from './secrets.json' assert {type: 'json'}
import API from './fetchUserAPI.js'
import getAuth from './auth.js'
import fs from 'fs'

class TCGSet{
    #cardArray = []
    #setId
    constructor() { 
        this.tcgHashMap = new Map()
    } 
    async getCardsSetID(setId) {
        try {
            const filePath = `../Scripts/pokemonVisual/textFiles/${setId}.txt`
            this.#setId = setId
            if(fs.existsSync(filePath)) {
                return await this.readFromLocalFile(filePath)
            }
            const response = await API.fetchCardsSetID(setId)
            const data = await response.json()
            return await this.makeCardObject(data)
        } catch (err){
            console.log(`Error happened couldn't get card set ${err}`)
        }
    }
    async readFromLocalFile(filePath) {
        try {
            const response = fs.readFileSync(filePath, 'utf8')
            const responseData = response.split('\n').map(line => JSON.parse(line))
            return await this.makeCardObject({data: responseData})
        } catch (error) {
            console.error(`Error reading file ${filePath}:`, error)
        }
    }
    async makeCardObject(data) {
        data.data.forEach(cardData =>{
            let num = Number(cardData.number)
            cardData.number = num
            cardData.frequency = 0
            this.#addCardToArray(cardData)
        })
        this.#cardArray = this.#mergeUnorganizedArray(this.#cardArray)
        this.#cardArray.forEach(card => { 
            console.log(`${card.name}`)
            return;
        })
        this.#addCardToMap()    
        this.#editSpreedSheet()
    }
    async #editSpreedSheet() {
        const authClient = await getAuth.getGoogleAuth()
        const googleSheets = google.sheets({version: "v4", auth: authClient})
        const spreadsheetId = secrets.spreedsheetId
        const response = await googleSheets.spreadsheets.values.get({
            spreadsheetId,
            range: "Sheet1!A:E",
            valueRenderOption: "FORMATTED_VALUE"
        })
        if (!response.data.values) {
            await this.#appendToSheet()    
        } else {
            response.data.values.forEach(row => {
                const key = Number(row[0])
                const addFrequency = Number(row[4])
                const oldFrequency = Number(row[2])
        
                if (this.tcgHashMap.has(key)){
                    let card = this.tcgHashMap.get(key)
                    card.frequency = addFrequency + oldFrequency
                }
            }) 
            await this.#appendToSheet()
            await googleSheets.spreadsheets.values.clear({
                spreadsheetId,
                range: "Sheet1!E:E"
            })
        }
    }
    #addCardToMap() {
        this.#cardArray.forEach(card => {
            this.tcgHashMap.set(card.number, card)
        }) 
        return this.tcgHashMap
    }
    #addCardToArray(card) {
        this.#cardArray.push(card)
        return
    }
    #mergeUnorganizedArray(unorganizedCardArray) {
        if (unorganizedCardArray.length <= 1) {
            return unorganizedCardArray
        }
        const mid = Math.floor(unorganizedCardArray.length / 2)
        const left = this.#mergeUnorganizedArray(unorganizedCardArray.slice(0, mid))
        const right = this.#mergeUnorganizedArray(unorganizedCardArray.slice(mid))
        return this.#mergeCoupledArray(left, right)
    }
    #mergeCoupledArray(leftArray, rightArray) {
        let sortedArray = []
        let indexLeft = 0
        let indexRight = 0
        while(indexLeft < leftArray.length && indexRight < rightArray.length) {
            if (leftArray[indexLeft].number < rightArray[indexRight].number) {
                sortedArray.push(leftArray[indexLeft++])
            } else {
                sortedArray.push(rightArray[indexRight++])
            }
        }
        return sortedArray.concat(leftArray.slice(indexLeft)).concat(rightArray.slice(indexRight))
    } 
    async #appendToSheet() {
        const authClient = await getAuth.getGoogleAuth()
        const googleSheets = google.sheets({version: "v4", auth: authClient})
        const spreadsheetId = secrets.spreedsheetId
        const folder = `../Scripts/pokemonVisual/textFiles`
        const filePath = `${folder}/${this.#setId}.txt`
        await googleSheets.spreadsheets.values.update({
            spreadsheetId,
            range: "Sheet1!A:E",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: Array.from(this.tcgHashMap.values()).map(card => [
                    card.number,
                    card.name,
                    card.frequency,
                    card.rarity
                ])
            }
        })
        try {
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(folder, { recursive: true })
                const data = this.#cardArray.map(card => JSON.stringify(card)).join('\n')
                fs.writeFile(filePath, data, (err) => {
                    if (err) throw err
                    console.log('File Created and written successfully!')
                })
            } else if (fs.existsSync(filePath)) {
                let jsonTxt = fs.readFileSync(filePath, 'utf8')
                let parseJson = jsonTxt.trim().split('\n').map(txt => JSON.parse(txt))
                let index = 0
                const response = await googleSheets.spreadsheets.values.get({
                    spreadsheetId,
                    range: 'Sheet1!C:C'
                })
                const responseFrequency = response.data.values
                parseJson.forEach(objectVariable => {
                    objectVariable.frequency = Number(responseFrequency[index++]?.[0] || 0)
                })
                jsonTxt = parseJson.map(objects => JSON.stringify(objects)).join('\n')
                fs.writeFile(filePath, jsonTxt, (err) => {
                    if(err) throw err
                })
            }
        } catch (error) {
            console.error(`Error creating folder or file: ${error.message}`) 
            return
        }
    }
}
API.fetchAllSets()
const prismatcSet = new TCGSet()
prismatcSet.getCardsSetID('sv8pt5')