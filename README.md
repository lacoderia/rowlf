# Rowlf

This web app allows clients to customize tiles.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Rowlf's repository contains an angular project running on node. To prevent version incompatibilities, the following steps should be followed:

1. Download and install node v10.12.0. The installation file can be found at [https://nodejs.org/download/release/v10.12.0/](https://nodejs.org/download/release/v10.12.0/)
2. Install npm v6.4.1
3. Install bower as root
```
sudo npm install -g bower
```
4. Accept Xcode license to have access to compiling tools.

### Installing

1. Clone github repository
2. Delete node_modules folder
3. Install bower components as root
```
sudo bower install –-allow-root
```
4. Change `/rowlf/app/bower_components` folder permissions
```
chown -R <user>:staff bower_components
```
5. Install node dependencies as user
```
npm install
```

## Running the App

1. Run the development build script on cli as user
```
npm run-script start
```
2. Open `http://localhost:3000/` on a browser


## Deployment

Steps to follow to deploy this on a live system:

1. Update the production environment url in `app.module.js` file

app.module.js
```
constant('AUTH_API_URL_BASE', 'http://servicios.coderia.mx:8081')
constant('API_URL_BASE', 'http://servicios.coderia.mx/8081')
```

2. Update the version number in `/rowlf/app/routes/index.js` file

index.js
```
res.render('index', { title: 'Design Studio', version: '2.0' });
```

This change will force browsers to reload all scripts

## Additional Notes

* Bower y node libraries inside `/usr/local/lib/node_modules/` must have root access
