import CoinbaseCommerce from "coinbase-commerce-node";

const { Client, resources } = CoinbaseCommerce;
const { Charge } = resources;

Client.init(process.env.COINBASE_API_KEY);

export async function createCharge(chargeData) {
  try {
    const charge = await Charge.create(chargeData);
    return charge;
  } catch (error) {
    console.error("Error creating Coinbase charge:", error);
    throw error;
  }
}
