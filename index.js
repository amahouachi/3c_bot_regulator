const config= require('./config.json');
const threeCommasAPI = require('3commas-api-node')

const client= new threeCommasAPI({
  apiKey: config.key,
  apiSecret: config.secret
});
const activeDealIds= {};

function getRequiredDataForBotUpdate(bot){
  return {
    name: bot.name,
    pairs: bot.pairs,
    take_profit: parseFloat(bot.take_profit),
    safety_order_volume: parseFloat(bot.safety_order_volume),
    martingale_volume_coefficient: parseFloat(bot.martingale_volume_coefficient),
    martingale_step_coefficient: parseInt(bot.martingale_step_coefficient),
    max_safety_orders: parseInt(bot.max_safety_orders),
    active_safety_orders_count: parseInt(bot.active_safety_orders_count),
    safety_order_step_percentage: parseFloat(bot.safety_order_step_percentage),
    take_profit_type: bot.take_profit_type,
    strategy_list: bot.strategy_list,
    bot_id: bot.id
  };

}
setInterval(async () => {
  try{
    for(const id of Object.keys(activeDealIds)){
      console.log(`Fetching active deal ${id}`);
      let deal= await client.getDeal(id);
      if(deal['finished?']){
        console.log(`Deal is finished`);
        console.log(`Updating base order volume to ${deal.sold_volume}`);
        let bot= await client.botShow(deal.bot_id);
        let data= getRequiredDataForBotUpdate(bot);
        data.base_order_volume= parseFloat(deal.sold_volume);
        await client.botUpdate(data);
        delete activeDealIds[id]
      }else{
        console.log(`Deal is still active`);
      }
    }
    console.log("Fetching active deals");
    let activeDeals= await client.getDeals({scope: 'active', limit: 100});
    console.log(`Found ${activeDeals.length} active deals`);
    for(const deal of activeDeals){
      if(! (deal.id in activeDealIds)){
        console.log(`Starting monitoring active deal ${deal.id}`);
        activeDealIds[deal.id]= 1;
      }else{
        console.log(`Ignoring active deal ${deal.id}`);
      }
    }
  }catch (e) {
    console.error(e);
  }
}, config.interval);
