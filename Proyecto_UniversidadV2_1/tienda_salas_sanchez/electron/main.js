import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// PROBLEMA: En los Módulos ES (usando 'import'), la variable global '__filename' (ruta completa del archivo)
// no existe por defecto, a diferencia del sistema antiguo CommonJS ('require').
// SOLUCIÓN: Usamos 'import.meta.url' para obtener la URL del módulo y la convertimos a una ruta de sistema.
//tiene como propósito principal obtener la ruta exacta del archivo que se está ejecutando en ese momento
const __filename = fileURLToPath(import.meta.url);
// 2. OBTENCIÓN DE LA RUTA DEL DIRECTORIO
//
// PROPÓSITO: Necesitamos una referencia fija a la carpeta donde se encuentra este script ('main.js').
// Esta referencia ('__dirname'), es decir pasaremos como argumenteo la ruta obtenida anteriormente
//  esto se usará para construir rutas a otros archivos del proyecto
// (como '../dist/index.html') de manera que funcionen en cualquier sistema operativo (Windows, Mac, Linux).
// ACCIÓN: Usamos la función 'dirname' del módulo 'path' para extraer la parte del directorio
// de la ruta de archivo que acabamos de obtener en la línea anterior.
const __dirname = path.dirname(__filename);
function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      // ✅ MEJORA DE SEGURIDAD 1: Deshabilita el acceso directo de Node.js al renderer
      nodeIntegration: false,
      // ✅ MEJORA DE SEGURIDAD 2: Aísla el código web del código de Electron
      contextIsolation: true,
      // Opcional: Se usaría para exponer APIs seguras (IPC)
      // preload: path.join(__dirname, 'preload.cjs'),
    }
  });
  if (process.env.NODE_ENV === 'development') {
    // Modo Desarrollo: Carga desde el servidor Vite y añade el hash para la ruta inicial
    win.loadURL('http://localhost:5173/#/admin');
  } else {
    // ✅ CORRECCIÓN DE RUTA: Carga el archivo local (file://) Y añade el hash #/admin
    // Esto asegura que el HashRouter de React arranque en la página correcta en producción.
    win.loadURL(`file://${path.join(__dirname, '../dist/index.html')}#/admin`);
     
  }
}

// --- Ciclo de Vida de la Aplicación ---
app.whenReady().then(createWindow);


app.on('window-all-closed', () => {
  // Cierra la aplicación si no es macOS
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  // En macOS, si no hay ventanas, crea una nueva al hacer clic en el Dock
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

