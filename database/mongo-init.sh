set -e

mongosh <<EOF
use admin

db.createUser({
  user: '$MONGODB_INIT_ADMIN_USERNAME',
  pwd: '$MONGODB_INIT_ADMIN_PASSWORD',
  roles: [{ role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase"]
})
use $MONGODB_INIT_DATABASE_NAME
EOF