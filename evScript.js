const ewelink = require('ewelink-api')
const config = require('./config.json')

async function TurnEvChargerOn() {
    const connection = new ewelink(config.ewelink.loginInfo)
    console.log(config.ewelink.evChargerId)
    const devices = await connection.getDevices()
    console.log(devices)
    const evState = await connection.getDevicePowerState(config.ewelink.evChargerId)

    console.log(evState)

    const status = await connection.setDevicePowerState(config.ewelink.evChargerId, 'on');
    console.log(status);
}

TurnEvChargerOn()
