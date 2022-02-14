const { SerialPort } = require('serialport')
const express = require('express')
const app = express()
const port = 3333
let current = 0

class WeightAPI {
    constructor() {
        const serialPort = new SerialPort({
            path: 'COM1',
            baudRate: 2400
        })

        serialPort.on('error', function (err) {
            console.log('Error: ', err.message)
        })

        serialPort.on('data', function (data) {
            let value = data.toString().replace(/[^0-9.,]+/, '')
            if (value != '\r') {
                let number = parseFloat(value).toFixed(2)
                if (!isNaN(number)) {
                    if (current != number) {
                        current = number
                        // console.log(current)
                    }
                }
            }
        })

        app.get('/', (req, res) => {
            // return res.json({ weight: (Math.random() * 10).toFixed(2) })
            return res.json({ weight: current.toFixed(2) })
        })

        app.listen(port, () => {
            console.log(`Live on http://localhost:${port}`)
        })
    }
}

module.exports = WeightAPI
