const ewelink = require('ewelink-api')
const config = require('./config.json')

async function program() {
    const connection = new ewelink(config.ewelink)

    const devices = await connection.getDevices()

    console.log(devices)
}

program()
