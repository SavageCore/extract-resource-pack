const path = require('path');
const url = require('url');

const {
	app,
	BrowserWindow
} = require('electron');

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 350,
		height: 210,
		frame: true,
		backgroundColor: '#212121',
		show: false
	});
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
	mainWindow.setMaximizable(false);
	mainWindow.setMenu(null);
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});
