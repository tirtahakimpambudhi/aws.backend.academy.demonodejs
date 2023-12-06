// process.js
import process from 'node:process';

/**
 * Get current process memory usage statistics
 * @returns {Object} Object containing memory usage statistics
 * @property {Array<{size: string, unit: string}>} heapTotal - Total size of the heap
 * @property {Array<{size: string, unit: string}>} heapUsed - Actually used heap size
 * @property {Array<{size: string, unit: string}>} external - Memory used by C++ objects bound to JavaScript objects
 * @property {Array<{size: string, unit: string}>} rss - Resident Set Size, total memory allocated for the process
 * @property {Array<{size: string, unit: string}>} arrayBuffers - Memory allocated for ArrayBuffers and SharedArrayBuffers
 * @example
 * const usage = getUsage();
 * console.log('Heap Used:', usage.heapUsed[0].size, usage.heapUsed[0].unit);
 * console.log('RSS:', usage.rss[0].size, usage.rss[0].unit);
 */
const getUsage = () => {
  const memoryUsage = process.memoryUsage();
  return {
    heapTotal: [
      {
        size: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
        unit: 'MB'
      }
    ],
    heapUsed: [
      {
        size: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
        unit: 'MB'
      }
    ],
    external: [
      {
        size: (memoryUsage.external / 1024 / 1024).toFixed(2),
        unit: 'MB'
      }
    ],
    rss: [
      {
        size: (memoryUsage.rss / 1024 / 1024).toFixed(2),
        unit: 'MB'
      }
    ],
    arrayBuffers: [
      {
        size: (memoryUsage.arrayBuffers / 1024 / 1024).toFixed(2),
        unit: 'MB'
      }
    ]
  };
};

export { getUsage };
