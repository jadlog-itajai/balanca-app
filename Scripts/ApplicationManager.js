const { app, Tray, nativeImage, Menu } = require('electron')
const helper = require('./HelperFunctions.js')
const path = require('path')

class ApplicationManager {
    constructor() {
        //Iconpath different in Build
        let imgPath = helper.isDev() ? './Assets/Icon.png' : path.join(process.resourcesPath, 'Icon.png')
        this.icon = nativeImage.createFromPath(imgPath)
    }

    createUI() {
        if (process.platform == 'darwin') app.dock.hide()
        this.createTray()
    }

    getMenuTemplate() {
        let template = Menu.buildFromTemplate([
            {
                label: `Serviço da Balança JADLOG - v${helper.getVersion()}`,
                enabled: false
            },
            { type: 'separator' },
            {
                label: 'Sair',
                click: function () {
                    app.quit()
                }
            }
        ])
        return template
    }

    createTray(menu) {
        this.tray = new Tray(this.icon)
        let contextMenu = menu ? menu : this.getMenuTemplate()

        this.tray.setToolTip('Serviço da Balança JADLOG')
        this.tray.setContextMenu(contextMenu)
    }
}

module.exports = ApplicationManager
