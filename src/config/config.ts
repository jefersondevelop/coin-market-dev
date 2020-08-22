require('dotenv').config();
export function getEnviromentConfig(){

    return Object.assign({
        "PORT": process.env.PORT,
        "POSTGRES_HOST": process.env.POSTGRES_HOST,
        "POSTGRES_PORT": process.env.POSTGRES_PORT,
        "POSTGRES_USER": process.env.POSTGRES_USER,
        "POSTGRES_PASSWORD": process.env.POSTGRES_PASSWORD,
        "POSTGRES_DATABASE": process.env.POSTGRES_DATABASE,
        "COIN_MARKET_URL": process.env.COIN_MARKET_URL,
        "COIN_EUR_MARKET_URL": process.env.COIN_EUR_MARKET_URL,
        "COIN_CONVERTER_URL": process.env.COIN_CONVERTER_URL,
        "COIN_CONVERTER_API_KEY": process.env.COIN_CONVERTER_API_KEY
    })

}