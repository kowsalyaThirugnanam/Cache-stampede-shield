import { NodeCacheShield } from './lib.js';

// Initialize the shield in-memory for this local test
const shield = new NodeCacheShield();

// Simulating a slow database function that takes 2 seconds
const slowDatabaseQuery = async (): Promise<{ status: string; timestamp: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: "Success", timestamp: Date.now() });
    }, 2000);
  });
};

async function runLocalTest() {
  console.log("--- START: Firing 5 database requests at the exact same millisecond ---");

  // Fire 5 simultaneous calls
  const [res1, res2, res3, res4, res5] = await Promise.all([
    shield.fetch("dashboard_metrics", slowDatabaseQuery, 10),
    shield.fetch("dashboard_metrics", slowDatabaseQuery, 10),
    shield.fetch("dashboard_metrics1", slowDatabaseQuery, 10),
    shield.fetch("dashboard_metrics", slowDatabaseQuery, 10),
    shield.fetch("dashboard_metrics1", slowDatabaseQuery, 10)
  ]);

  console.log("\n--- END: All requests completed ---");
  console.log("Request 1 returned timestamp:", res1.timestamp);
  console.log("Request 2 returned timestamp:", res2.timestamp);
  console.log("Request 3 returned timestamp:", res3.timestamp);
  console.log("Request 4 returned timestamp:", res4.timestamp);
  console.log("Request 5 returned timestamp:", res5.timestamp);
}

runLocalTest();