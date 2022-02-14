const { app, BrowserWindow, Tray, nativeImage, Menu } = require('electron')
const helper = require('./HelperFunctions.js')
const path = require('path')

class WindowManager {
    constructor() {
        //Iconpath different in Build
        let imgPath = helper.isDev() ? './Assets/Icon.png' : path.join(process.resourcesPath, 'Icon.png')
        this.icon = nativeImage.createFromPath(imgPath)
    }

    createUI() {
        if (process.platform == 'darwin') app.dock.hide()
        this.createTray()
    }

    createTray() {
        this.tray = new Tray(this.icon)

        let contextMenu = Menu.buildFromTemplate([
            {
                label: 'Serviço da Balança JADLOG',
                enabled: false
            },
            { type: 'separator' },
            {
                label: 'Conecte a balança na porta COM1',
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

        this.tray.setToolTip('Serviço da Balança JADLOG')
        this.tray.setContextMenu(contextMenu)
    }
}

module.exports = WindowManager
