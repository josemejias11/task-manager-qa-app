#!/bin/bash
# SQLite database backup script

set -e

# Configuration
DB_PATH="${DB_PATH:-./data/tasks.db}"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/tasks_backup_$TIMESTAMP.db"

echo "📦 SQLite Database Backup"
echo "========================="

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
  echo "❌ Database not found at: $DB_PATH"
  exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create backup
echo "📋 Backing up database..."
echo "   Source: $DB_PATH"
echo "   Destination: $BACKUP_FILE"

cp "$DB_PATH" "$BACKUP_FILE"

# Verify backup
if [ -f "$BACKUP_FILE" ]; then
  BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo "✅ Backup successful! Size: $BACKUP_SIZE"
  echo ""

  # List recent backups
  echo "📁 Recent backups:"
  ls -lht "$BACKUP_DIR" | head -6

  # Cleanup old backups (keep last 10)
  echo ""
  echo "🧹 Cleaning up old backups (keeping last 10)..."
  cd "$BACKUP_DIR"
  ls -t tasks_backup_*.db | tail -n +11 | xargs -r rm
  echo "✅ Cleanup complete"

else
  echo "❌ Backup failed!"
  exit 1
fi

echo ""
echo "💡 To restore a backup:"
echo "   cp $BACKUP_FILE $DB_PATH"
