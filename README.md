# home-automation
Home automation projects

## Charge EV when grid is green
`evScript.js` is a program that uses the Amber API to get the current energy status to manage the our EV charging. The EV is plugged into a power plug that can be controlled from an API. If the energy status is favourable, charging can be turned on, otherwise it can be turned off.

### Considerations

#### The car
Our electric car and its charger that we have at home, have no in built capability to manage the battery or view the charge status. So to easily gain a level of management on the charging at home, I am using a cheap 'smart' power plug that can be controlled from an app or from an API. This gives ability to simply turn the car charger on or off.

### To charge or not to charge
So far I am using a fairly simple method to decide to charge or not. That is, to charge if the current energy in the grid is green or cheap. In this case, green means that the amount of renewables is more than 50% and the price is less than 30c/kWh. Cheap means that the price is less than 15c/kWh. Most likely when the energy is that cheap, it has a fairly high renewable percentage anyway.

Use a more smooth formula

### When to check the price
Our energy price can update every 5 minutes but our electricity meter only records our usage per half hour. Therefore, we are charged for the amount of energy used in the half hour at the average price during that time. So using the current energy status to decide to charge or not is not necessarily ideal. For example, in an extreme price spike during a half hour period, I have seen the price be -5c for 5 minutes and then up to around $20 for the remainder. The car charges at 2kW so it uses 0.1kWh in 5 minutes. If it charged for 5 minutes when the price was very cheap but the average price for the half hour period was $20, that would be $2 for very minimal benefit. Luckily a spike like this is rare so far.

Considering that it is only a small risk something like this might happen and the grid seems pretty stable when the percentage of renewables is high, so far I am checking the current price every 30 minutes and then turning the charger on or off. I also am able to turn the charger off from my phone if I notice the energy price spiking. In future, I think it would be an improvement to check the predicted price and renewable level just before the half hour starts and use the prediction to decide to charge or not. Perhaps also in conjunction with regular price checking.

### Is it possible to find the car charge level? OBD scanner


## Retract awning in high wind
