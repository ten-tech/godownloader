import RNFS from 'react-native-fs';

const LOG_DIR = RNFS.DocumentDirectoryPath + '/logs';
const LOG_FILE = LOG_DIR + '/app_logs.txt';

export const logToFile = async (message) => {
  try {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    const dirExists = await RNFS.exists(LOG_DIR);
    if (!dirExists) {
      await RNFS.mkdir(LOG_DIR);
    }

    await RNFS.appendFile(LOG_FILE, logMessage);
  } catch (error) {
    console.error('Erreur de log:', error);
  }
};

export const readLogs = async () => {
  try {
    const logs = await RNFS.readFile(LOG_FILE);
    return logs;
  } catch (error) {
    console.error('Erreur lecture logs:', error);
    return '';
  }
};
