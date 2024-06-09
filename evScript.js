const ewelink = require('ewelink-api')
const config = require('./config.json')
const amberUrl = "https://api.amber.com.au/v1"

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

// TurnEvChargerOn()

const getJSON = (path, options) => fetch(path, options).then((res) => res.json());

function makeAPIRequest(url, path, options) {
    return getJSON(`${url}/${path}`, options);
  }

//   return this.makeAPIRequest('admin/quiz/new', {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${getLoggedInUserToken()}`,
//       accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       name: quizName,
//     }),
//   });

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
    return result
}

GetCurrentAmberPrice()
