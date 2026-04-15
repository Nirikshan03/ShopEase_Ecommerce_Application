pipeline {
    agent any

    tools {
        // Assume Jenkins server has Maven and Node configured in Global Tool Configuration
        maven 'Maven 3.8.x'
        nodejs 'NodeJS 18.x'
    }

    environment {
        DOCKER_CREDS = credentials('dockerhub-credentials') // Assuming DockerHub creds are stored in Jenkins
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Build & Test Backend (Spring Boot)') {
            steps {
                dir('backend') {
                    echo 'Compiling and testing Spring Boot application...'
                    sh 'mvn clean test package -DskipTests=false'
                }
            }
        }

        stage('Build Frontend (React)') {
            steps {
                dir('frontend') {
                    echo 'Installing npm dependencies and building React application...'
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Dockerize & Push Backend') {
            steps {
                dir('backend') {
                    echo 'Building backend Docker image...'
                    sh 'docker build -t your-dockerhub-username/shopease-backend:latest .'
                    // Uncomment below to push if Jenkins is fully configured
                    // sh 'echo $DOCKER_CREDS_PSW | docker login -u $DOCKER_CREDS_USR --password-stdin'
                    // sh 'docker push your-dockerhub-username/shopease-backend:latest'
                }
            }
        }

        stage('Dockerize & Push Frontend') {
            steps {
                dir('frontend') {
                    echo 'Building frontend Docker image...'
                    sh 'docker build -t your-dockerhub-username/shopease-frontend:latest .'
                    // Uncomment below to push if Jenkins is fully configured
                    // sh 'echo $DOCKER_CREDS_PSW | docker login -u $DOCKER_CREDS_USR --password-stdin'
                    // sh 'docker push your-dockerhub-username/shopease-frontend:latest'
                }
            }
        }
    }

    post {
        success {
            echo 'ShopEase Pipeline completed successfully! ✅'
        }
        failure {
            echo 'ShopEase Pipeline failed. Check logs for details. ❌'
        }
    }
}
