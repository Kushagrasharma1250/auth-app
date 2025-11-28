#!/bin/bash

mkdir -p /tmp/mongodb/data
mkdir -p /tmp/mongodb/logs

echo "Starting MongoDB..."
mongod --dbpath /tmp/mongodb/data --logpath /tmp/mongodb/logs/mongod.log --fork --quiet

sleep 2

if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB failed to start"
    exit 1
fi

echo "Starting Node.js server..."
npm run dev
