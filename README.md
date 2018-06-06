Ravencore
=======

This is Under's fork of Bitpay's Bitcore that uses Ravencoin 0.15.2. It has a limited segwit support.

It is HIGHLY recommended to use https://github.com/underdarkskies/ravencore-deb to build and deploy packages for production use.

----
Getting Started
=====================================
Deploying Ravencore full-stack manually:
----
````
##(add Unders key)##
$gpg --keyserver hkp://pgp.mit.edu:80 --recv-key B3BD190C
$sudo apt-get update
$sudo apt-get -y install libevent-dev libboost-all-dev libminiupnpc10 libzmq5 software-properties-common curl git build-essential libzmq3-dev
$sudo add-apt-repository ppa:bitcoin/bitcoin
$sudo apt-get update
$sudo apt-get -y install libdb4.8-dev libdb4.8++-dev
$curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
##(restart your shell/os)##
$nvm install stable
$nvm install-latest-npm
$nvm use stable
##(install mongodb)##
$sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
$echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
$sudo apt-get update
$sudo apt-get install -y mongodb-org
$sudo systemctl enable mongod.service
##(install ravencore)##
$git clone https://github.com/underdarkskies/ravencore.git
$npm install -g ravencore --production
````
Copy the following into a file named ravencore-node.json and place it in ~/.ravencore/ (be sure to customize username values(without angle brackets<>) and/or ports)
````json
{
  "network": "livenet",
  "port": 3001,
  "services": [
    "ravend",
    "web",
    "insight-api",
    "insight-ui"
  ],
  "allowedOriginRegexp": "^https://<yourdomain>\\.<yourTLD>$",
  "messageLog": "",
  "servicesConfig": {
    "web": {
      "disablePolling": true,
      "enableSocketRPC": false
    },
    "insight-ui": {
      "routePrefix": "",
      "apiPrefix": "api"
    },
    "insight-api": {
      "routePrefix": "api",
      "coinTicker" : "https://api.coinmarketcap.com/v1/ticker/ravencoin/?convert=USD",
      "coinShort": "RVN",
	    "db": {
		  "host": "127.0.0.1",
		  "port": "27017",
		  "database": "raven-api-livenet",
		  "user": "",
		  "password": ""
	  }
    },
    "ravend": {
      "sendTxLog": "/home/<yourusername>/.ravencore/pushtx.log",
      "spawn": {
        "datadir": "/home/<yourusername>/.ravencore/data",
        "exec": "/home/<yourusername>/ravencore/node_modules/ravencore-node/bin/ravend",
        "rpcqueue": 1000,
        "rpcport": 8766,
        "zmqpubrawtx": "tcp://127.0.0.1:28332",
        "zmqpubhashblock": "tcp://127.0.0.1:28332"
      }
    }
  }
}
````
Quick note on allowing socket.io from other services. 
- If you would like to have a seperate services be able to query your api with live updates, remove the "allowedOriginRegexp": setting and change "disablePolling": to false. 
- "enableSocketRPC" should remain false unless you can control who is connecting to your socket.io service. 
- The allowed OriginRegexp does not follow standard regex rules. If you have a subdomain, the format would be(without angle brackets<>):
````
"allowedOriginRegexp": "^https://<yoursubdomain>\\.<yourdomain>\\.<yourTLD>$",
````

To setup unique mongo credentials:
````
$mongo
>use raven-api-livenet
>db.createUser( { user: "test", pwd: "test1234", roles: [ "readWrite" ] } )
````
(then add these unique credentials to your ravencore-node.json)

Copy the following into a file named raven.conf and place it in ~/.ravencore/data
````json
server=1
whitelist=127.0.0.1
txindex=1
addressindex=1
timestampindex=1
spentindex=1
zmqpubrawtx=tcp://127.0.0.1:28332
zmqpubhashblock=tcp://127.0.0.1:28332
rpcport=8766
rpcallowip=127.0.0.1
rpcuser=ravencoin
rpcpassword=local321 #change to something unique
uacomment=ravencore-sl

mempoolexpiry=72 # Default 336
rpcworkqueue=1100
maxmempool=2000
dbcache=1000
maxtxfee=1.0
dbmaxfilesize=64
````
Launch your copy of ravencore:
````
$ravencored
````
You can then view the Ravencoin block explorer at the location: `http://localhost:3001`

Create an Nginx proxy to forward port 80 and 443(with a snakeoil ssl cert)traffic:
----
````
$sudo apt-get install -y nginx
````
copy the following into a file named "nginx-ravencore" and place it in /etc/nginx/sites-available/
````
server {
    listen 80;
    listen 443 ssl;
        
    include snippets/snakeoil.conf;
    root /home/ravencore/www;
    access_log /var/log/nginx/ravencore-access.log;
    error_log /var/log/nginx/ravencore-error.log;
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 10;
        proxy_send_timeout 10;
        proxy_read_timeout 100; # 100s is timeout of Cloudflare
        send_timeout 10;
    }
    location /robots.txt {
       add_header Content-Type text/plain;
       return 200 "User-agent: *\nallow: /\n";
    }
    location /ravencore-hostname.txt {
        alias /var/www/html/ravencore-hostname.txt;
    }
}
````
Then enable your site:
````
$cd /etc/nginx/sites-enabled
$sudo ln -s ../sites-available/nginx-ravencore .
$sudo rm default
$sudo rm ../sites-available/default
$sudo printf "[Service]\nExecStartPost=/bin/sleep 0.1\n" | sudo tee /etc/systemd/system/nginx.service.d/override.conf
$sudo systemctl daemon-reload
$sudo service nginx restart
````
Upgrading Ravencore full-stack manually:
----
- This will leave the local blockchain copy intact:
Shutdown the ravencored application first, and backup your unique raven.conf and ravencore-node.json
````
$cd ~/
$rm -rf .npm .node-gyp ravencore
$rm .ravencore/data/raven.conf .ravencore/ravencore-node.json
$git clone https://github.com/underdarkskies/ravencore.git
$npm install -g ravencore --production
````
(recreate your unique raven.conf and ravencore-node.json)

- This will redownload a new blockchain copy:
(Some updates may require you to reindex the blockchain data. If this is the case, redownloading the blockchain only takes 20 minutes)
Shutdown the ravencored application first, and backup your unique raven.conf and ravencore-node.json
````
$cd ~/
$rm -rf .npm .node-gyp ravencore
$rm -rf .ravencore
$git clone https://github.com/underdarkskies/ravencore.git
$npm install -g ravencore --production
````
(recreate your unique raven.conf and ravencore-node.json)

Undeploying Ravencore full-stack manually:
----
````
$nvm deactivate
$nvm uninstall stable
$rm -rf .npm .node-gyp ravencore
$rm .ravencore/data/raven.conf .ravencore/ravencore-node.json
````

## Applications

- [Node](https://github.com/underdarkskies/ravencore-node) - A full node with extended capabilities using Ravencoin Core
- [Insight API](https://github.com/underdarkskies/insight-api) - A blockchain explorer HTTP API
- [Insight UI](https://github.com/underdarkskies/insight) - A blockchain explorer web user interface
- (to-do) [Wallet Service](https://github.com/underdarkskies/ravencore-wallet-service) - A multisig HD service for wallets
- (to-do) [Wallet Client](https://github.com/underdarkskies/ravencore-wallet-client) - A client for the wallet service
- (to-do) [CLI Wallet](https://github.com/underdarkskies/ravencore-wallet) - A command-line based wallet client
- (to-do) [Angular Wallet Client](https://github.com/underdarkskies/angular-ravencore-wallet-client) - An Angular based wallet client
- (to-do) [Copay](https://github.com/underdarkskies/copay) - An easy-to-use, multiplatform, multisignature, secure ravencoin wallet

## Libraries

- [Lib](https://github.com/underdarkskies/ravencore-lib) - All of the core Ravencoin primatives including transactions, private key management and others
- (to-do) [Payment Protocol](https://github.com/underdarkskies/ravencore-payment-protocol) - A protocol for communication between a merchant and customer
- [P2P](https://github.com/underdarkskies/ravencore-p2p) - The peer-to-peer networking protocol
- (to-do) [Mnemonic](https://github.com/underdarkskies/ravencore-mnemonic) - Implements mnemonic code for generating deterministic keys
- (to-do) [Channel](https://github.com/underdarkskies/ravencore-channel) - Micropayment channels for rapidly adjusting ravencoin transactions
- [Message](https://github.com/underdarkskies/ravencore-message) - Ravencoin message verification and signing
- (to-do) [ECIES](https://github.com/underdarkskies/ravencore-ecies) - Uses ECIES symmetric key negotiation from public keys to encrypt arbitrarily long data streams.

## Security

We're using Ravencore in production, but please use common sense when doing anything related to finances! We take no responsibility for your implementation decisions.

## Contributing

Please send pull requests for bug fixes, code optimization, and ideas for improvement. For more information on how to contribute, please refer to our [CONTRIBUTING](https://github.com/underdarkskies/ravencore/blob/master/CONTRIBUTING.md) file.

To verify signatures, use the following PGP keys:
- @underdarkskies: http://pgp.mit.edu/pks/lookup?op=get&search=0x009BAB88B3BD190C `EE6F 9673 1EF6 ED85 B12B  0A3F 009B AB88 B3BD 190C`

## License

Code released under [the MIT license](https://github.com/underdarkskies/ravencore/blob/master/LICENSE).
