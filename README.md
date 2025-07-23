# How to use

## Deploy
1. clone the repo
2. install node dependencies
3. make sure bot has permission to manage server
4. create config.js and fill in Discord environment variables:
   * ``token``
   * ``guildId``
   * ``parentId``
   * ``userId``
5. start server (with ``pm2 start``)

## API
Send requests to /

### Query params
* ``id`` (required) - ID
* ``content`` (required) - text
* ``internal`` - true/false don't log to discord
* ``ping`` - true/false ping the user identified by ``userId``
