# Deployment Guide

This guide covers deploying the University Web Application to production environments on AWS and GCP.

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [AWS Deployment](#aws-deployment)
- [GCP Deployment](#gcp-deployment)
- [Post-Deployment](#post-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)

## Pre-Deployment Checklist

Before deploying to production, ensure you have:

- [ ] Domain name configured
- [ ] SSL/TLS certificates obtained
- [ ] SSO/SAML provider configured (Okta/Azure AD)
- [ ] Database backup strategy defined
- [ ] Disaster recovery plan documented
- [ ] Security audit completed
- [ ] Load testing performed
- [ ] All environment variables configured
- [ ] Secrets stored in secure vault
- [ ] CI/CD pipeline tested
- [ ] Monitoring and alerting configured

## AWS Deployment

### Architecture Overview

```
Route 53 → CloudFront → ALB → ECS/EKS → RDS + ElastiCache
```

### Step 1: Setup AWS Infrastructure

#### 1.1 VPC and Networking

```bash
# Using Terraform (recommended)
cd infrastructure/terraform/aws
terraform init
terraform plan -var-file="production.tfvars"
terraform apply -var-file="production.tfvars"
```

Manual setup:
- Create VPC with CIDR 10.0.0.0/16
- Create 2 public subnets (for ALB, NAT)
- Create 2 private subnets (for ECS/EKS)
- Create 2 isolated subnets (for RDS)
- Setup Internet Gateway
- Setup NAT Gateways (one per AZ)
- Configure route tables

#### 1.2 RDS PostgreSQL

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier university-app-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.4 \
  --master-username postgres \
  --master-user-password 'SECURE_PASSWORD' \
  --allocated-storage 100 \
  --storage-type gp3 \
  --storage-encrypted \
  --multi-az \
  --vpc-security-group-ids sg-xxxxx \
  --db-subnet-group-name university-db-subnet-group \
  --backup-retention-period 30 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "Mon:04:00-Mon:05:00" \
  --enable-cloudwatch-logs-exports '["postgresql"]'
```

Import schema:

```bash
psql -h university-app-db.xxxxx.us-east-1.rds.amazonaws.com \
     -U postgres -d postgres \
     -f infrastructure/database/schema.sql
```

#### 1.3 ElastiCache Redis

```bash
# Create Redis cluster
aws elasticache create-replication-group \
  --replication-group-id university-redis \
  --replication-group-description "University App Redis" \
  --engine redis \
  --cache-node-type cache.t3.medium \
  --num-cache-clusters 2 \
  --automatic-failover-enabled \
  --multi-az-enabled \
  --cache-subnet-group-name university-redis-subnet-group \
  --security-group-ids sg-xxxxx \
  --snapshot-retention-limit 5 \
  --snapshot-window "02:00-03:00"
```

#### 1.4 ECS Cluster (Option A)

```bash
# Create ECS cluster
aws ecs create-cluster \
  --cluster-name university-app-production \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy \
    capacityProvider=FARGATE,weight=1,base=1 \
    capacityProvider=FARGATE_SPOT,weight=4

# Create task definitions
aws ecs register-task-definition \
  --cli-input-json file://infrastructure/aws/backend-task-definition.json

aws ecs register-task-definition \
  --cli-input-json file://infrastructure/aws/frontend-task-definition.json
```

#### 1.5 EKS Cluster (Option B - Recommended)

```bash
# Create EKS cluster
eksctl create cluster \
  --name university-app-production \
  --region us-east-1 \
  --version 1.28 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 10 \
  --managed \
  --vpc-private-subnets subnet-xxxxx,subnet-yyyyy \
  --vpc-public-subnets subnet-zzzzz,subnet-wwwww

# Configure kubectl
aws eks update-kubeconfig \
  --region us-east-1 \
  --name university-app-production

# Apply Kubernetes manifests
kubectl apply -f infrastructure/kubernetes/namespace.yaml
kubectl apply -f infrastructure/kubernetes/secrets.yaml
kubectl apply -f infrastructure/kubernetes/backend-deployment.yaml
kubectl apply -f infrastructure/kubernetes/frontend-deployment.yaml
kubectl apply -f infrastructure/kubernetes/services.yaml
kubectl apply -f infrastructure/kubernetes/ingress.yaml
```

#### 1.6 Application Load Balancer

```bash
# Create target groups
aws elbv2 create-target-group \
  --name university-backend-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxxxx \
  --health-check-path /api/v1/health \
  --health-check-interval-seconds 30 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3

aws elbv2 create-target-group \
  --name university-frontend-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxxxx \
  --health-check-path / \
  --health-check-interval-seconds 30

# Create load balancer
aws elbv2 create-load-balancer \
  --name university-app-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxx \
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4

# Create listeners
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:... \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

#### 1.7 CloudFront Distribution

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://infrastructure/aws/cloudfront-config.json
```

#### 1.8 S3 Buckets

```bash
# Create S3 buckets
aws s3 mb s3://university-app-assets-prod --region us-east-1
aws s3 mb s3://university-app-backups-prod --region us-east-1
aws s3 mb s3://university-app-logs-prod --region us-east-1

# Configure versioning
aws s3api put-bucket-versioning \
  --bucket university-app-assets-prod \
  --versioning-configuration Status=Enabled

# Configure lifecycle policies
aws s3api put-bucket-lifecycle-configuration \
  --bucket university-app-backups-prod \
  --lifecycle-configuration file://infrastructure/aws/s3-lifecycle.json
```

### Step 2: Configure Secrets

```bash
# Store secrets in AWS Secrets Manager
aws secretsmanager create-secret \
  --name university-app/production/db-password \
  --secret-string "SECURE_DB_PASSWORD"

aws secretsmanager create-secret \
  --name university-app/production/jwt-private-key \
  --secret-string "$(cat private.key)"

aws secretsmanager create-secret \
  --name university-app/production/saml-cert \
  --secret-string "$(cat saml-cert.pem)"
```

### Step 3: Deploy Application

#### Using GitHub Actions (Recommended)

1. Configure GitHub secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`

2. Push to main branch:

```bash
git push origin main
```

The CI/CD pipeline will automatically:
- Run tests
- Build Docker images
- Push to ECR
- Deploy to ECS/EKS
- Run health checks

#### Manual Deployment

```bash
# Build and push images
docker build -t university-backend:latest ./backend
docker tag university-backend:latest xxxxx.dkr.ecr.us-east-1.amazonaws.com/university-backend:latest
docker push xxxxx.dkr.ecr.us-east-1.amazonaws.com/university-backend:latest

# For ECS
aws ecs update-service \
  --cluster university-app-production \
  --service backend-service \
  --force-new-deployment

# For EKS
kubectl set image deployment/backend \
  backend=xxxxx.dkr.ecr.us-east-1.amazonaws.com/university-backend:latest

kubectl rollout status deployment/backend
```

### Step 4: Configure DNS

```bash
# Create Route 53 hosted zone
aws route53 create-hosted-zone \
  --name university-app.com \
  --caller-reference $(date +%s)

# Create A record pointing to CloudFront
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch file://infrastructure/aws/route53-records.json
```

## GCP Deployment

### Architecture Overview

```
Cloud DNS → Cloud CDN → Cloud Load Balancer → GKE → Cloud SQL + Memorystore
```

### Step 1: Setup GCP Infrastructure

```bash
# Set project
gcloud config set project university-app-prod

# Enable required APIs
gcloud services enable \
  container.googleapis.com \
  sqladmin.googleapis.com \
  redis.googleapis.com \
  compute.googleapis.com

# Create VPC
gcloud compute networks create university-vpc \
  --subnet-mode=custom

# Create subnets
gcloud compute networks subnets create university-subnet \
  --network=university-vpc \
  --region=us-central1 \
  --range=10.0.0.0/24
```

### Step 2: Create GKE Cluster

```bash
# Create GKE cluster
gcloud container clusters create university-app-production \
  --region us-central1 \
  --num-nodes 1 \
  --node-locations us-central1-a,us-central1-b \
  --machine-type n1-standard-2 \
  --enable-autoscaling \
  --min-nodes 2 \
  --max-nodes 10 \
  --enable-autorepair \
  --enable-autoupgrade

# Get credentials
gcloud container clusters get-credentials university-app-production \
  --region us-central1
```

### Step 3: Create Cloud SQL

```bash
# Create Cloud SQL instance
gcloud sql instances create university-db \
  --database-version=POSTGRES_15 \
  --tier=db-custom-2-7680 \
  --region=us-central1 \
  --network=university-vpc \
  --availability-type=REGIONAL \
  --backup-start-time=03:00 \
  --maintenance-window-day=SUN \
  --maintenance-window-hour=04

# Create database
gcloud sql databases create university_app \
  --instance=university-db

# Import schema
gcloud sql import sql university-db \
  gs://university-app-scripts/schema.sql \
  --database=university_app
```

### Step 4: Create Memorystore Redis

```bash
# Create Redis instance
gcloud redis instances create university-redis \
  --size=2 \
  --region=us-central1 \
  --redis-version=redis_7_0 \
  --tier=standard
```

### Step 5: Deploy Application

```bash
# Apply Kubernetes manifests
kubectl apply -f infrastructure/kubernetes/
```

## Post-Deployment

### 1. Verify Deployment

```bash
# Check service health
curl https://your-domain.com/api/v1/health

# Check database connectivity
kubectl exec -it $(kubectl get pod -l app=backend -o jsonpath='{.items[0].metadata.name}') \
  -- psql -h DB_HOST -U postgres -d university_app -c "SELECT 1"

# Check Redis connectivity
kubectl exec -it $(kubectl get pod -l app=backend -o jsonpath='{.items[0].metadata.name}') \
  -- redis-cli -h REDIS_HOST ping
```

### 2. Run Database Migrations

```bash
# For ECS
aws ecs run-task \
  --cluster university-app-production \
  --task-definition backend-migration \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx],securityGroups=[sg-xxxxx]}"

# For EKS/GKE
kubectl run migration-job \
  --image=university-backend:latest \
  --restart=Never \
  --command -- npm run migration:run
```

### 3. Configure Monitoring

```bash
# AWS CloudWatch
aws logs create-log-group --log-group-name /university-app/production

# Set up alarms
aws cloudwatch put-metric-alarm \
  --alarm-name high-error-rate \
  --alarm-description "Triggers when error rate exceeds 5%" \
  --metric-name Errors \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold
```

### 4. Test Failover

```bash
# Test database failover
aws rds failover-db-cluster --db-cluster-identifier university-db

# Test Redis failover
aws elasticache test-failover \
  --replication-group-id university-redis \
  --node-group-id 0001
```

### 5. Load Testing

```bash
# Using Apache Bench
ab -n 10000 -c 100 https://your-domain.com/api/v1/health

# Using k6
k6 run --vus 100 --duration 30s infrastructure/tests/load-test.js
```

## Monitoring & Maintenance

### Daily Checks

- [ ] Review error logs
- [ ] Check system metrics (CPU, memory, disk)
- [ ] Verify backup completion
- [ ] Review security alerts

### Weekly Tasks

- [ ] Review audit logs
- [ ] Check for security updates
- [ ] Analyze performance metrics
- [ ] Review cost reports

### Monthly Tasks

- [ ] Security audit
- [ ] Disaster recovery drill
- [ ] Review and rotate secrets
- [ ] Update dependencies

### Quarterly Tasks

- [ ] Comprehensive security assessment
- [ ] Review and update documentation
- [ ] Capacity planning review
- [ ] Performance optimization review

## Rollback Procedures

### ECS/EKS Rollback

```bash
# ECS - Rollback to previous task definition
aws ecs update-service \
  --cluster university-app-production \
  --service backend-service \
  --task-definition backend:PREVIOUS_REVISION

# EKS - Rollback deployment
kubectl rollout undo deployment/backend
kubectl rollout undo deployment/frontend
```

### Database Rollback

```bash
# Restore from automated backup
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier university-db-restored \
  --db-snapshot-identifier rds:university-db-2024-01-01-03-00

# Point-in-time recovery
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier university-db \
  --target-db-instance-identifier university-db-pit-restore \
  --restore-time 2024-01-01T12:00:00Z
```

## Troubleshooting

### Issue: High latency

1. Check CloudWatch/Stackdriver metrics
2. Review database slow query logs
3. Check Redis hit rate
4. Verify CDN cache hit ratio
5. Review application logs for bottlenecks

### Issue: Database connection errors

1. Check security group rules
2. Verify connection string
3. Check RDS instance status
4. Review database logs
5. Verify connection pool settings

### Issue: Service unavailable

1. Check ALB/Load Balancer health
2. Verify target health in target groups
3. Check ECS task/K8s pod status
4. Review application logs
5. Verify DNS resolution

## Security Considerations

1. **Enable encryption**: At rest and in transit
2. **Regular updates**: Keep all components updated
3. **Access control**: Use IAM roles, not access keys
4. **Audit logging**: Enable CloudTrail/Cloud Audit Logs
5. **Secrets rotation**: Rotate credentials regularly
6. **Network isolation**: Use private subnets for app/data tiers
7. **WAF rules**: Configure Web Application Firewall
8. **DDoS protection**: Enable AWS Shield/Cloud Armor

## Cost Optimization

1. Use Reserved Instances for predictable workloads
2. Enable auto-scaling to match demand
3. Use Spot Instances for non-critical workloads
4. Implement S3 lifecycle policies
5. Right-size your instances based on metrics
6. Use CloudFront/Cloud CDN to reduce origin load
7. Clean up unused resources regularly
8. Review and optimize data transfer costs

## Support

For production issues:
- Create incident in monitoring system
- Contact on-call engineer
- Escalate to development team if needed
- Document issues and resolutions
