# unibot
## Build image
```make build```
## Run
```make run```
## Remove image
```make rm_image```
## Config file
./conf/conf_file_name.js
```
module.exports = {
    logFile: //path to log file,
    adapters: {
        // fb: 'FB_TOKEN', 
        // vk: 'VK_TOKEN',
        // tg: 'TG_TOKEN'
    },
    testModule: 'tgTest',
    db: './db/db_dir_name',
    hookPort: //port
}
```
