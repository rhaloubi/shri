Cost-Minimized DevOps Roadmap

1. CI with GitHub Actions + SonarQube

Run Go tests and Next.js lint/tests in CI.

SonarQube: use SonarCloud free tier (no need to self-host).

Build Docker images for each service

👉 No cost here (GitHub Actions free minutes + SonarCloud free tier).

2. Registry for Docker Images

Options:

Use Docker Hub Free (limit: 200 pulls/day).

Or use ECR (Elastic Container Registry) if you want it integrated with AWS (costs ~$0.10/GB-month + transfer).

👉 If you want to cut cost to the minimum → start with Docker Hub. Later, switch to ECR if needed.

3. Terraform for Infra

Minimal AWS resources:

VPC → 2 public subnets, 2 private subnets.

EKS → smallest managed cluster (1 node group, t3.small or t3.medium spot instances).

Ingress with the api gatway → handles ingress traffic with 1 public load balancer.

4. Kubernetes Deployment

Each Go service → 1 Deployment + 1 Service.

Next.js → containerized (can serve static with Nginx, or run SSR if needed).

API Gateway → Nginx / Traefik as reverse proxy

5. Observability

Grafana can add cost if hosted. To minimize:

Use kube-state-metrics + metrics-server (free, light).

For dashboards:

Run Grafana OSS inside cluster (small pod, free).

Or skip Grafana and check via kubectl top pods.

👉 Optional. Add Grafana later only if needed.

6. Blue/Green Deployment (Zero Cost)

No need for fancy tools. You can:

Run 2 deployments (blue + green) with different labels.

Service selector points to blue by default.

When green is ready, patch Service to point to green.

👉 Done with kubectl patch. No AWS add-on needed.

🔹 Minimal Tech Choices (Low-Cost Setup)

CI/CD: GitHub Actions

Code Quality: SonarCloud free tier

Registry: Docker Hub (or ECR if you want AWS-native)

secrets :Sealed Secrets for every service

Infra: Terraform → VPC + EKS only

Ingress: agi gateway

Gateway: Use Ingress (skip AWS API Gateway)

Monitoring: Optional Grafana OSS inside cluster (free)

Blue/Green: Native Kubernetes Deployment + Service switching

🔹 Simplified Workflow (End-to-End)

Push code → GitHub Actions

Run tests (Go + Next.js)

Sonar scan

Build + push Docker images to registry

Deploy to EKS via GitHub Actions

Update k8s manifests with new image tag

Apply with kubectl or helm upgrade

Traffic Management (Blue/Green)

Deploy new version with version: green

Wait for readiness

Switch Service selector from blue → green
