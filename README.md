# 3c_bot_regulator
Watches for your open deals on 3comma and when one is closed, it adds the realized profit to the bot's capital

Installation
--

Copy the repository or clone it on a unix machine. Then do `npm install` to install the depencencies.

How it works
--

There is no option today to tell 3comma bot to reinvest the profits in the bot's capital. This simple tool uses 3comma API to accomplish this task. It monitors open deals and once one is closed it updates the bot's settings adding the realized profits to the bot's capital. If the profit is negative (a loss) it will substract it instead.

Configuration
--

Use config.js to put your api key/secret and to set the interval at which 3comma is probed by this tool.
