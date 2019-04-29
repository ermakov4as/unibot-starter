const c = console.log

module.exports = class State {
    constructor(name) {
        this.name = name
        this.Fsx = (user, commit) => commit(user)
        this.actions = []
    }

    addFsx(Fsx) {
        this.Fsx = Fsx
        return this
    }

    onCommand(command, Hsx) {
        this.actions.push({
            type: 'command',
            body: command,
            Hsx: Hsx
        })
        return this
    }

    onText(Hsx) {
        this.actions.push({
            type: 'text',
            body: true,
            Hsx: Hsx
        })
        return this
    }

    onButton(body, Hsx) {
        this.actions.push({
            type: 'text',
            body: body,
            Hsx: Hsx
        })
        return this
    }

    onImage(Hsx) {
        this.actions.push({
            type: 'image',
            body: true,
            Hsx: Hsx
        })
        return this
    }

    onAudio(Hsx) {
        this.actions.push({
            type: 'audio',
            body: true,
            Hsx: Hsx
        })
        return this
    }

    onVideo(Hsx) {
        this.actions.push({
            type: 'video',
            body: true,
            Hsx: Hsx
        })
        return this
    }

    onFile(Hsx) {
        this.actions.push({
            type: 'file',
            body: true,
            Hsx: Hsx
        })
        return this
    }
}