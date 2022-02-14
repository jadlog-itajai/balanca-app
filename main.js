const { app } = require('electron')
const AutoLaunch = require('auto-launch')
const WindowManager = require('./Scripts/WindowManager.js')
const WeightAPI = require('./Scripts/WeightAPI.js')

//Main Object responsible for managing the electron windows is created
windowManager = new WindowManager()

//Called when Electron is ready
//This creates the browser windows and tray in the menu bar
app.on('ready', windowManager.createUI.bind(windowManager))
app.on('ready', () => {
    let autoLaunch = new AutoLaunch({
        name: 'Balança App',
        path: app.getPath('exe')
    })
    autoLaunch.isEnabled().then(isEnabled => {
        if (!isEnabled) autoLaunch.enable()
    })
    weightAPI = new WeightAPI()
})

//When all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
