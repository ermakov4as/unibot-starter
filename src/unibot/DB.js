const fs = require('fs')
const help = require('./../services/help')
const c = console.log


module.exports = class DB {
    constructor(conf) {
        this.globDir = conf.db_path
        this.adaptersDir = conf.db_path + '/adapters'
        help.crateIfNotExist(this.adaptersDir)
        this.usersDir = conf.db_path + '/users'
        help.crateIfNotExist(this.usersDir)
    }

    getAdapterData(adapter_name, callback) {
        if (!fs.existsSync(this.adaptersDir + '/' + adapter_name)) {
            let newAdapter = {
                name: adapter_name,
                files: {},
                users: {}
            }
            fs.writeFileSync(this.adaptersDir + '/' + adapter_name, JSON.stringify(newAdapter, false, 4))
        }
        let adapter = JSON.parse(fs.readFileSync(this.adaptersDir + '/' + adapter_name))
        callback(adapter)
    }

    getUserDataInAdapter(local_id, adapter, callback) {
        if (!(local_id in adapter.users)) {
            let newUser = {
                id: this.getStdId(adapter.name),
                adapter_name: adapter.name,
                local_id: local_id
            }
            adapter.users[local_id] = newUser.id;
            fs.writeFileSync(this.adaptersDir + '/' + adapter.name, JSON.stringify(adapter, false, 4))
            fs.writeFileSync(this.usersDir + '/' + newUser.id, JSON.stringify(newUser, false, 4))
        }
        let user = JSON.parse(fs.readFileSync(this.usersDir + '/' + adapter.users[local_id]))
        callback(user)
    }

    getUserData(local_id, adapter_name, callback) {
        this.getAdapterData(adapter_name, (adapter) => {
            this.getUserDataInAdapter(local_id, adapter, (user) => {
                user.__id = user.id
                callback(user)
            })
        })
    }

    getDataOfAllUsers(callback) {
        let usersIds = fs.readdirSync(this.usersDir)
        let users = []
        for (let id of usersIds) {
            let user = JSON.parse(fs.readFileSync(this.usersDir + '/' + id))
            user.__id = user.id
            users.push(user)
        }
        callback(users)
    }

    getStdId(adapter_name) {
        let adapter = JSON.parse(fs.readFileSync(this.adaptersDir + '/' + adapter_name))
        let ID = 1
        for (let i in adapter.users)
            ID++
        return adapter.name + ID
    }

    saveUser(user) {
        if (!user.id) {
            user.id = this.getStdId(user.adapter_name)
        }
        if (user.id != user.__id) {
            this.deleteUser(user.__id)
            this.deleteUser(user.id)
            let adapter = JSON.parse(fs.readFileSync(this.adaptersDir + '/' + user.adapter_name))
            adapter.users[user.local_id] = user.id
            fs.writeFileSync(this.adaptersDir + '/' + user.adapter_name, JSON.stringify(adapter, false, 4))
        }
        user.__id = undefined
        fs.writeFileSync(this.usersDir + '/' + user.id, JSON.stringify(user, false, 4))
    }

    deleteUser(user_id) {
        let adapter_names = fs.readdirSync(this.adaptersDir)
        for (let adapter_name of adapter_names) {
            let adapter = JSON.parse(fs.readFileSync(this.adaptersDir + '/' + adapter_name))
            for (let local_id in adapter.users)
                if (adapter.users[local_id] == user_id)
                    delete adapter.users[local_id]
            fs.writeFileSync(this.adaptersDir + '/' + adapter_name, JSON.stringify(adapter, false, 4))
        }
        if (fs.existsSync(this.usersDir + '/' + user_id))
            fs.unlinkSync(this.usersDir + '/' + user_id)
    }


    applyIDtoFiles(adapter, outputs, callback) {
        let adap = JSON.parse(fs.readFileSync(this.adaptersDir + '/' + adapter))
        for (let i in outputs)
            if ((['image', 'audio', 'video', 'file'].indexOf(outputs[i].type) + 1) && outputs[i].body in adap.files)
                outputs[i].file_id = adap.files[outputs[i].body]
        callback(outputs)
    }

    saveMediaId(adapter_name, outputs) {
        let adapter = JSON.parse(fs.readFileSync(this.adaptersDir + '/' + adapter_name))
        for (let o of outputs)
            if (['image', 'audio', 'video', 'file'].indexOf(o.type) + 1)
                adapter.files[o.body] = o.file_id
        fs.writeFileSync(this.adaptersDir + '/' + adapter_name, JSON.stringify(adapter, false, 4))
    }

    getUsersInfo(attrs, callback) {
        let ids = fs.readdirSync(this.usersDir)
        let users = []
        for (let id of ids) {
            let user = JSON.parse(fs.readFileSync(this.usersDir + '/' + id))
            let data = {}
            for (let atr of attrs) {
                if (atr in user) {
                    data[atr] = user[atr]
                }
            }
            users.push(data)
        }
        callback(users)
    }

    getUserDataById(id, callback) {
        if (!fs.existsSync(this.usersDir + '/' + id))
            return
        let user = JSON.parse(fs.readFileSync(this.usersDir + '/' + id))
        user.__id = user.id
        callback(user)
    }
}
