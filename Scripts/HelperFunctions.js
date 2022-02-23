class Helper {
    //This is necessary for determinig if it is a build or a dev app
    static isDev() {
        return process.mainModule.filename.indexOf('app.asar') === -1
    }

    static getVersion() {
        return require('../package.json').version
    }
}

module.exports = Helper
