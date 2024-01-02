const { Client } = require('pg');
const readline = require('readline');


const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'uno',
  password: '1',
  port: 5432,
};

async function executeQuery(config, query) {
  const client = new Client(config);

  try {
    await client.connect();

    const start = Date.now();
    const result = await client.query(query);
    const end = Date.now();
    const elapsedTime = end - start;

    return elapsedTime;
  } finally {
    await client.end();
  }
}


async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Ingrese el valor de n (número de ejecuciones): ', async (answer) => {
    const n = parseInt(answer, 10);

    if (isNaN(n) || n <= 0) {
      console.error('Ingrese un valor válido para n.');
      rl.close();
      process.exit(1);
    }

    try {
      let totalElapsedTime = 0;

      for (let i = 0; i < n; i++) {
        const elapsedTime = await executeQuery(config, 'SELECT 1');
        totalElapsedTime += elapsedTime;
      }

      const averageElapsedTime = totalElapsedTime / n;
      console.log(`Promedio del tiempo transcurrido por cada ejecución: ${averageElapsedTime} ms`);

    } catch (error) {
      console.error('Error al ejecutar el programa:', error);
    } finally {
      rl.close();
    }
  });
}

main();
