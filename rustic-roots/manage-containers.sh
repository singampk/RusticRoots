#!/bin/bash

# Container management script for multi-container deployment

COMPOSE_FILE="docker-compose.multi-container.yml"

show_help() {
    echo "🐳 Rustic Roots Container Management"
    echo "=================================="
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start     - Start all containers"
    echo "  stop      - Stop all containers"
    echo "  restart   - Restart all containers"
    echo "  status    - Show container status"
    echo "  logs      - Show container logs"
    echo "  update    - Update application to latest version"
    echo "  backup    - Backup database and SSL certificates"
    echo "  restore   - Restore from backup"
    echo "  health    - Check system health"
    echo "  ssl       - Check SSL certificate status"
    echo "  clean     - Clean up unused containers and images"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs app"
    echo "  $0 backup"
}

start_containers() {
    echo "🚀 Starting containers..."
    docker-compose -f $COMPOSE_FILE up -d
    echo "✅ Containers started"
    show_status
}

stop_containers() {
    echo "🛑 Stopping containers..."
    docker-compose -f $COMPOSE_FILE down
    echo "✅ Containers stopped"
}

restart_containers() {
    echo "🔄 Restarting containers..."
    docker-compose -f $COMPOSE_FILE restart
    echo "✅ Containers restarted"
    show_status
}

show_status() {
    echo "📊 Container Status:"
    docker-compose -f $COMPOSE_FILE ps
    echo ""
    echo "🌐 Service Health:"
    
    # Check database
    if docker exec rusticroots-database pg_isready -U rustic_admin >/dev/null 2>&1; then
        echo "✅ Database: Healthy"
    else
        echo "❌ Database: Not responding"
    fi
    
    # Check app
    if docker exec rusticroots-app curl -f http://localhost:3000/api/products >/dev/null 2>&1; then
        echo "✅ Application: Healthy"
    else
        echo "❌ Application: Not responding"
    fi
    
    # Check nginx
    if docker exec rusticroots-nginx nginx -t >/dev/null 2>&1; then
        echo "✅ Nginx: Healthy"
    else
        echo "❌ Nginx: Configuration error"
    fi
    
    # Check HTTPS
    if curl -f -k https://localhost >/dev/null 2>&1; then
        echo "✅ HTTPS: Working"
    else
        echo "❌ HTTPS: Not accessible"
    fi
}

show_logs() {
    local service=${1:-}
    if [ -n "$service" ]; then
        echo "📜 Logs for $service:"
        docker-compose -f $COMPOSE_FILE logs -f --tail=50 $service
    else
        echo "📜 All container logs:"
        docker-compose -f $COMPOSE_FILE logs -f --tail=20
    fi
}

update_app() {
    echo "🔄 Updating application..."
    
    # Pull latest image
    echo "📥 Pulling latest image..."
    docker pull singampk/rusticroots:latest
    
    # Restart app container
    echo "🔄 Restarting application..."
    docker-compose -f $COMPOSE_FILE up -d app
    
    echo "✅ Application updated"
    show_status
}

backup_system() {
    local backup_dir="backups/$(date +%Y%m%d-%H%M%S)"
    mkdir -p $backup_dir
    
    echo "💾 Creating system backup..."
    
    # Backup database
    echo "📊 Backing up database..."
    docker exec rusticroots-database pg_dump -U rustic_admin rustic_roots > $backup_dir/database.sql
    
    # Backup SSL certificates
    echo "🔒 Backing up SSL certificates..."
    cp -r certbot/conf $backup_dir/ssl-certificates
    
    # Backup configuration
    echo "⚙️  Backing up configuration..."
    cp .env $backup_dir/environment
    cp $COMPOSE_FILE $backup_dir/
    cp nginx/ssl-proxy.conf $backup_dir/
    
    # Create backup info
    cat > $backup_dir/backup-info.txt << EOF
Backup Created: $(date)
Domain: therusticroots.com.au
Database: PostgreSQL 15
SSL Certificates: Let's Encrypt
Application Version: singampk/rusticroots:latest
EOF
    
    echo "✅ Backup created: $backup_dir"
    echo "📁 Backup contents:"
    ls -la $backup_dir/
}

restore_system() {
    local backup_dir=${1:-}
    if [ -z "$backup_dir" ]; then
        echo "❌ Please specify backup directory"
        echo "Usage: $0 restore backups/20231201-120000"
        return 1
    fi
    
    if [ ! -d "$backup_dir" ]; then
        echo "❌ Backup directory not found: $backup_dir"
        return 1
    fi
    
    echo "🔄 Restoring from backup: $backup_dir"
    
    # Stop containers
    stop_containers
    
    # Restore database
    if [ -f "$backup_dir/database.sql" ]; then
        echo "📊 Restoring database..."
        start_containers
        sleep 10
        docker exec -i rusticroots-database psql -U rustic_admin rustic_roots < $backup_dir/database.sql
    fi
    
    # Restore SSL certificates
    if [ -d "$backup_dir/ssl-certificates" ]; then
        echo "🔒 Restoring SSL certificates..."
        cp -r $backup_dir/ssl-certificates/* certbot/conf/
    fi
    
    # Restart all containers
    start_containers
    
    echo "✅ System restored from backup"
}

check_health() {
    echo "🔍 System Health Check"
    echo "====================="
    
    show_status
    
    echo ""
    echo "💾 Disk Usage:"
    df -h | grep -E "(Filesystem|/dev/)"
    
    echo ""
    echo "🐳 Docker Resources:"
    docker system df
    
    echo ""
    echo "📊 Database Stats:"
    docker exec rusticroots-database psql -U rustic_admin -d rustic_roots -c "
        SELECT 
            schemaname,
            tablename,
            n_tup_ins as inserts,
            n_tup_upd as updates,
            n_tup_del as deletes
        FROM pg_stat_user_tables;
    " 2>/dev/null || echo "Database not accessible"
}

check_ssl() {
    echo "🔒 SSL Certificate Status"
    echo "========================"
    
    # Check certificate files
    if [ -f "certbot/conf/live/therusticroots.com.au/fullchain.pem" ]; then
        echo "✅ Certificate files found"
        
        # Check expiry
        echo ""
        echo "📅 Certificate expiry:"
        openssl x509 -in certbot/conf/live/therusticroots.com.au/fullchain.pem -noout -dates
        
        # Check validity
        echo ""
        echo "🔍 Certificate details:"
        openssl x509 -in certbot/conf/live/therusticroots.com.au/fullchain.pem -noout -subject -issuer
    else
        echo "❌ Certificate files not found"
    fi
    
    # Test HTTPS
    echo ""
    echo "🌐 HTTPS Test:"
    if curl -I https://therusticroots.com.au >/dev/null 2>&1; then
        echo "✅ HTTPS is working"
    else
        echo "❌ HTTPS connection failed"
    fi
}

clean_system() {
    echo "🧹 Cleaning up Docker system..."
    
    # Remove unused containers
    docker container prune -f
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    # Remove unused networks
    docker network prune -f
    
    echo "✅ Cleanup complete"
    
    echo ""
    echo "📊 Current disk usage:"
    docker system df
}

# Main command handling
case ${1:-} in
    start)
        start_containers
        ;;
    stop)
        stop_containers
        ;;
    restart)
        restart_containers
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs $2
        ;;
    update)
        update_app
        ;;
    backup)
        backup_system
        ;;
    restore)
        restore_system $2
        ;;
    health)
        check_health
        ;;
    ssl)
        check_ssl
        ;;
    clean)
        clean_system
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "❌ Unknown command: ${1:-}"
        echo ""
        show_help
        exit 1
        ;;
esac