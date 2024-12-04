const ewelink = require('ewelink-api')
const config = require('./config.json')
const amberUrl = "https://api.amber.com.au/v1"
const renewablesThreshold = 50
const energyPriceHighThreshold = 20
const energyPriceLowThreshold = 13

const eweLinkConnection = new ewelink(config.ewelink.loginInfo)

function Log(message) {
    const now = new Date()
    console.log(`[${now.toLocaleString()}] ${message}`)
}

const getJSON = (path, options) => fetch(path, options).then((res) => res.json())

function makeAPIRequest(url, path, options) {
    return getJSON(`${url}/${path}`, options)
}

async function TurnEvChargerOn() {
    Log("Try turn EV charger on")
    const status = await eweLinkConnection.setDevicePowerState(config.ewelink.evChargerId, 'on')
    Log(`EV charger status: ${JSON.stringify(status)}`)
}

async function TurnEvChargerOff() {
    Log("Try turn EV charger off")
    const status = await eweLinkConnection.setDevicePowerState(config.ewelink.evChargerId, 'off')
    Log(`EV charger status: ${JSON.stringify(status)}`)
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
    return result[0]
}

function ShouldChargeEV(currentEnergyState) {
    const price = currentEnergyState.perKwh
    const renewables = currentEnergyState.renewables
    // energy is green and cheapish
    const green = renewables > renewablesThreshold && price < energyPriceHighThreshold
    // energy is really cheap (and likely fairly green)
    const cheap = price < energyPriceLowThreshold

    Log(`Current energy price: ${price}`)
    Log(`Current renewables: ${renewables}%`)
    Log(`Green: ${green}, Cheap: ${cheap}`)

    return green || cheap
}

async function ManageEVCharging() {
    Log("Manage EV charging")
    var currentEnergyState = await GetCurrentAmberPrice()
    if (ShouldChargeEV(currentEnergyState)) {
        await TurnEvChargerOn()
    } else {
        await TurnEvChargerOff()
    }
}

async function ManageHouse() {
    Log("Begin ManageHouse")
    await ManageEVCharging()

    // sleep until the next half hour
    const delay = s => new Promise(resolve => setTimeout(resolve, s * 1000))
    const secondsToWait = SecondsToNextHalfHour()
    Log(`Sleeping for ${secondsToWait / 60} minutes`)
    await delay(secondsToWait)

    ManageHouse()
}

// number of seconds until 1 minute past the next half hour
function SecondsToNextHalfHour() {
    const now = new Date()
    var mins = now.getMinutes()
    const minsToHalfHour = (60 - mins) % 30
    return (60 * minsToHalfHour) - now.getSeconds() + 60
}

ManageHouse()
