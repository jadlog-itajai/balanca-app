require('dotenv').config()
const { app, MenuItem, Menu, dialog } = require('electron')
const AutoLaunch = require('auto-launch')
const ApplicationManager = require('./Scripts/ApplicationManager.js')
const WeightAPI = require('./Scripts/WeightAPI.js')
const Store = require('electron-store')
const store = new Store()

//Main Object responsible for managing the electron windows is created
const applicationManager = new ApplicationManager()
let weightAPI = null

//Called when Electron is ready
//This creates the browser windows and tray in the menu bar
app.on('ready', applicationManager.createUI.bind(applicationManager))
app.on('ready', async () => {
    const serialPath = store.get('serialPath')
    if (process.env.NODE_ENV != 'development') {
        let autoLaunch = new AutoLaunch({
            name: 'Balança App',
            path: app.getPath('exe')
        })
        autoLaunch.isEnabled().then(isEnabled => {
            if (!isEnabled) autoLaunch.enable()
        })
    }

    weightAPI = serialPath ? new WeightAPI(serialPath) : new WeightAPI()

    let menu = applicationManager.getMenuTemplate()

    weightAPI.getPorts().then(ports => {
        if (ports.length > 0) {
            addCommunicationTestMenuItem(menu)
            menu.insert(
                menu.items.length - 1,
                new MenuItem({
                    label: 'Alterar Porta Serial',
                    type: 'submenu',
                    submenu: ports.map(port => {
                        return {
                            label: `Porta ${port.path}`,
                            type: 'radio',
                            checked: serialPath ? port.path == serialPath : port.path == 'COM1',
                            click: () => {
                                store.set('serialPath', port.path)
                                weightAPI.stop()
                                weightAPI = new WeightAPI(port.path)
                            }
                        }
                    })
                })
            )
        } else {
            menu.insert(
                menu.items.length - 1,
                new MenuItem({
                    label: 'Nenhuma Porta Serial Encontrada',
                    enabled: false
                })
            )
        }
        applicationManager.tray.destroy()
        applicationManager.createTray(menu)
    })
})

//When all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

function addCommunicationTestMenuItem(menu) {
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
}
