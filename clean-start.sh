#!/bin/bash

echo "🧹 DollarDollar - Clean Docker Start"
echo "===================================="
echo ""
echo "⚠️  WARNING: This will DELETE all existing data!"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "1️⃣  Stopping all containers..."
docker-compose down

echo ""
echo "2️⃣  Removing all volumes (this deletes the database)..."
docker-compose down -v

echo ""
echo "3️⃣  Removing any orphan containers..."
docker-compose down --remove-orphans

echo ""
echo "4️⃣  Cleaning up Docker system (optional - removes unused data)..."
read -p "Do you want to prune Docker system? (yes/no): " prune

if [ "$prune" = "yes" ]; then
    docker system prune -f
    echo "✅ Docker system pruned"
fi

echo ""
echo "5️⃣  Building fresh containers..."
docker-compose build --no-cache

echo ""
echo "6️⃣  Starting all services..."
docker-compose up -d

echo ""
echo "7️⃣  Waiting for database to be ready..."
sleep 5

echo ""
echo "8️⃣  Running database migrations..."
docker-compose exec backend flask db upgrade 2>/dev/null || echo "Note: Migration command not available or already up to date"

echo ""
echo "✅ Clean start complete!"
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   Database: localhost:5432"
echo ""
echo "📝 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop everything:"
echo "   docker-compose down"
echo ""
