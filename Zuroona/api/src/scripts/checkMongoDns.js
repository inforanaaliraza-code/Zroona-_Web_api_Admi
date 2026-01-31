#!/usr/bin/env node
/**
 * checkMongoDns.js
 * - Resolves the Atlas SRV record from MONGO_URI / MONGODB_URI
 * - Attempts a short mongoose connection for fast feedback
 * Usage: node src/scripts/checkMongoDns.js
 */

require('dotenv').config();
const dns = require('dns').promises;
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

function extractHostFromUri(u) {
  if (!u) return null;
  const m = u.match(/@([^/]+)/);
  return m ? m[1] : null;
}

async function run() {
  if (!uri) {
    console.error('✖ MONGO_URI / MONGODB_URI is not set in environment');
    process.exit(2);
  }

  const host = extractHostFromUri(uri);
  if (!host) {
    console.error('✖ Could not extract host from MONGO_URI');
    process.exit(2);
  }

  const srv = `_mongodb._tcp.${host}`;
  console.log(`Resolving SRV record for: ${srv}`);

  try {
    const records = await dns.resolveSrv(srv);
    console.log('✅ SRV records found:');
    console.table(records);
  } catch (err) {
    console.error('✖ SRV resolution failed:', err && err.code ? `${err.code} (${err.syscall || ''})` : err.message || err);
    console.log('\nTry these commands (Windows PowerShell / CMD):');
    console.log(`  Resolve-DnsName -Name "${srv}" -Type SRV`);
    console.log(`  nslookup -type=SRV ${srv} 8.8.8.8`);
  }

  console.log('\nAttempting a short mongoose.connect (5s timeout) to verify reachability...');
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000, family: 4 });
    console.log('\n✅ mongoose connected successfully (SRV appears to work)');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n✖ mongoose.connect failed:', err && err.message ? err.message : err);
    if (err && err.code && err.syscall) console.error(`   details: code=${err.code}, syscall=${err.syscall}`);
    console.log('\nIf you see `querySrv ECONNREFUSED` then SRV/DNS lookups are blocked by your network/ISP.');
    console.log('Options: set a non-SRV connection string in MONGO_FALLBACK, change your DNS resolver, or run a local MongoDB for development.');
    process.exit(3);
  }
}

run().catch((e) => {
  console.error('Unexpected error:', e);
  process.exit(99);
});
