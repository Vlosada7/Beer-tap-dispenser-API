
# Beer tap dispenser API


Anyone who goes to a festival at least one time knows how difficult is to grab some drinks from the bars. They are crowded and sometimes queues are longer than the main artist we want to listen to!

That's why some promoters are developing an MVP for some new festivals. Bar counters where you can go and serve yourself a beer. This will help make the waiting time much faster, making festival attendees happier and concerts even more crowded, avoiding delays!

How it works?

The aim of this API is to allow organizers to set up these bar counters allowing the attendees self-serving.

So, once an attendee wants to drink a beer (0,0º, we are not promoting any kind of alcohol consumption! 👀) they just need to open the tap! The API will start counting how much flow comes out and, depending on the price, calculate the total amount of money.

You could find the whole description of the API and send some requests to a mock server at this URL



## Tech Stack

**Back-end:** Node, Express, MongoDB, Javascript, jest and Supertest


## Features


Admins will create the dispenser by specifying a flow_volume. This config will help to know how many liters of beer come out per second and be able to calculate the total spend.

Every time an attendee opens the tap of a dispenser to puts some beer, the API will receive a change on the corresponding dispenser to update the status to open. With this change, the API will start counting how much time the tap is open and be able to calculate the total price later

Once the attendee closes the tap of a dispenser, as the glass is full of beer, the API receives a change on the corresponding dispenser to update the status to close. At this moment, the API will stop counting and mark it closed.

At the end of the event, the promoters will want to know how much money they make with this new approach. So, we have to provide some information about how many times a dispenser was used, for how long, and how much money was made with each service.

⚠️ The promoters could check how much money was spent on each dispenser while an attendee is taking beer! So you have to control that by calculating the time diff between the tap opening and the request time


## Installation

```bash
  1. Clone the repository
  2. In the beerTap folder run 'npm i'
  3. To run the server 'npm start'
  4. The application will be available at 'http://localhost:3000'
  5. To run the tests first start the server and then 'npm test'
```
    