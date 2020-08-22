# API FOR CURRENCY EXCHANGE (NODE JS)

This is an app for see currencies exchange. In this case, USD base is taken to give value to BTC, DASH, ETH and others more.

Some values are token of database.

### Installing

```
npm i
```

## Getting Started

```
npm run start:dev

This app running on port 3002 by default
```

### Prerequisites

Nest Js 6.7.2+
Jest 24.9.0+
Swagger 4.5.12+
Postgres 8.3.2+

## Running the tests

```
npm run test

```

## Available on heroku

```
https://coin-market-dev.herokuapp.com

```

## APIS Utils

```
https://poloniex.com

```

```
https://api.exchangeratesapi.io

```

```
https://free.currconv.com/api/v7

```

## Swagger URL

To see swaggers, only you need to go to 

```
https://coin-market-dev.herokuapp.com/documentation 

```

## SERVICES

```
GET /coins/marketCoinUSD

Give BTC , ETH, DASH, PTR (Petros), BS (Bolívares) and Euro values based on USD Dolar

```

```
GET /coins/currencies

Give All currencies for convert availables  

```

```
PUT /coins

Admin can update any currency exchange.

```


```
POST /coins/convertCurrency

Convert currency from ONE to ANOTHER.

```

More services you can see on swaggers