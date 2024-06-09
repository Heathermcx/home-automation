const ewelink = require('ewelink-api')
const config = require('./config.json')
const amberUrl = "https://api.amber.com.au/v1"
const renewablesThreshold = 50
const energyPriceHighThreshold = 30
const energyPriceLowThreshold = 15

const eweLinkConnection = new ewelink(config.ewelink.loginInfo)

const getJSON = (path, options) => fetch(path, options).then((res) => res.json());

function makeAPIRequest(url, path, options) {
    return getJSON(`${url}/${path}`, options);
}

async function TurnEvChargerOn() {
    console.log("Turn EV charger on")
    //const evState = await connection.getDevicePowerState(config.ewelink.evChargerId)
    const status = await eweLinkConnection.setDevicePowerState(config.ewelink.evChargerId, 'on');
    console.log(status);
}

async function TurnEvChargerOff() {
    console.log("Turn Ev Charger Off")
    const status = await eweLinkConnection.setDevicePowerState(config.ewelink.evChargerId, 'off');
    console.log(status);
}

async function GetCurrentAmberPrice() {
    const result = await makeAPIRequest(
        amberUrl,
        `sites/${config.amber.siteId}/prices/current?resolution=30`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${config.amber.apiToken}`,
                accept: 'application/json',
            }
        }
    )
    console.log(result)
    return result[0]
}

function ShouldCharge(currentEnergyState) {
    const price = currentEnergyState.perKwh
    const renewables = currentEnergyState.renewables
    console.log("price " + price)
    console.log("renewable " + renewables)
    // energy is green and cheapish
    const green = renewables > renewablesThreshold && price < energyPriceHighThreshold
    // energy is really cheap
    const cheap = price < energyPriceLowThreshold
    console.log("Green: " + green + " Cheap: " + cheap)
    return green || cheap
}

async function ManageEVCharging() {
    var currentEnergyState = await GetCurrentAmberPrice();
    if (ShouldCharge(currentEnergyState)) {
        TurnEvChargerOn();
    } else {
        TurnEvChargerOff();
    }
}

ManageEVCharging()
