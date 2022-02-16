const { app, MenuItem, Menu, dialog } = require('electron')
const AutoLaunch = require('auto-launch')
const ApplicationManager = require('./Scripts/ApplicationManager.js')
const WeightAPI = require('./Scripts/WeightAPI.js')

//Main Object responsible for managing the electron windows is created
const applicationManager = new ApplicationManager()

//Called when Electron is ready
//This creates the browser windows and tray in the menu bar
app.on('ready', applicationManager.createUI.bind(applicationManager))
app.on('ready', async () => {
    let autoLaunch = new AutoLaunch({
        name: 'Balança App',
        path: app.getPath('exe')
    })
    autoLaunch.isEnabled().then(isEnabled => {
        if (!isEnabled) autoLaunch.enable()
    })
    let weightAPI = new WeightAPI()

    let menu = applicationManager.getMenuTemplate()
    menu.insert(
        menu.items.length - 1,
        new MenuItem({
            label: 'Testar Comunicação com a Balança',
            click: function () {
                dialog.showMessageBox({
                    type: 'info',
                    buttons: ['OK'],
                    title: 'Teste de Comunicação',
                    message: `Peso atual da Balança: ${weightAPI.getWeight()}`
                })
            }
        })
    )
    menu.insert(menu.items.length - 1, new MenuItem({ type: 'separator' }))

    weightAPI.getPorts().then(ports => {
        if (ports.length > 0) {
            menu.insert(
                menu.items.length - 1,
                new MenuItem({
                    label: 'Alterar Porta Serial',
                    type: 'submenu',
                    submenu: ports.map(port => {
                        return {
                            label: port.friendlyName,
                            type: 'radio',
                            checked: port.path == 'COM1',
                            click: () => {
                                weightAPI.stop()
                                weightAPI = new WeightAPI(port.path)
                            }
                        }
                    })
                })
            )
            applicationManager.tray.destroy()
            applicationManager.createTray(menu)
        }
    })
})

//When all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
