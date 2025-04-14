export const logToFile = async (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

export const readLogs = async () => {
  console.log('Lecture des logs indisponible sur le Web.');
  return '';
};
