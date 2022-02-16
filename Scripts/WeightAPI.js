require('dotenv').config()
const { SerialPort } = require('serialport')
const express = require('express')
const app = express()
const port = 3333
let serialPort = null
let current = 0
let server = null

class WeightAPI {
    constructor(serialPath = 'COM1') {
        this.serialPath = serialPath
        serialPort = new SerialPort({
            path: this.serialPath,
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
                        if (process.env.NODE_ENV == 'development') {
                            console.log(current)
                        }
                    }
                }
            }
        })

        app.get('/', (req, res) => {
            return process.env.NODE_ENV == 'development'
                ? res.json({ weight: (Math.random() * 10).toFixed(2) })
                : res.json({ weight: current })
        })

        server = app.listen(port, () => {
            if (process.env.NODE_ENV == 'development') {
                console.log(`Starting serial read on ${serialPath}`)
                console.log(`Live on http://localhost:${port}`)
            }
        })
    }

    async getPorts() {
        return await SerialPort.list()
    }

    getWeight() {
        return process.env.NODE_ENV == 'development' ? (Math.random() * 10).toFixed(2) : current
    }

    //function to stop the server and close the serial port
    stop() {
        server.close()
        serialPort.close()
    }
}

module.exports = WeightAPI
