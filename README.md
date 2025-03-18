# TicketHub - A Lightweight Ticketing Tool for Developers and Support Teams at AT&T

TicketHub is a streamlined ticketing tool built with Next.js, Docker, and Kubernetes. It seamlessly integrates with MongoDB and leverages environment variables for flexible configuration.

## 🚀 Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** (v18 or later)
- **Docker**
- **Kubernetes** (Minikube)
- **kubectl**

## 📥 Getting Started

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/dikshapadi/ticketing-tool.git
cd ticketing-tool
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Run the Application Locally

```sh
npm run dev
```

Now, open your browser and visit [http://localhost:3000](http://localhost:3000) to access the application.

## 🐳 Dockerizing the Application

### 4️⃣ Build and Push the Docker Image

```sh
docker build -t tickethub .
docker tag tickethub:latest <your-dockerhub-username>/<repository-name>:latest
docker push <your-dockerhub-username>/<repository-name>:latest
```

## ☸️ Deploying to Kubernetes

### 5️⃣ Deploy on Kubernetes

```sh
kubectl create deployment tickethub --image=<your-dockerhub-username>/<repository-name>:latest
kubectl expose deployment tickethub --type=NodePort --port=3000
```

### 6️⃣ Apply Secrets and Deployment Configuration

Ensure you have the `secret.yaml` and `deployment.yaml` files as specified in the GitHub repository. Then apply them:

```sh
kubectl apply -f secret.yaml
kubectl apply -f deployment.yaml
```

### 7️⃣ Access the Application

Retrieve the service URL using Minikube:

```sh
minikube service tickethub --url
```

Open the generated URL in your browser, and TicketHub is ready to use! 🎉



