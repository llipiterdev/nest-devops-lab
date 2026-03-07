pipeline {
  agent { label 'minikube' }

  environment {
    IMAGE_NAME = 'nest-devops-lab'
    IMAGE_TAG = "${env.BUILD_NUMBER ?: 'latest'}"
  }

  stages {
    stage('Clonar repositorio') {
      steps {
        checkout scm
      }
    }

    stage('Construir imagen Docker en Minikube') {
      steps {
        sh '''
          eval $(minikube docker-env)
          docker build -t nest-devops-lab:${IMAGE_TAG} .
          docker tag nest-devops-lab:${IMAGE_TAG} nest-devops-lab:latest
        '''
      }
    }

    stage('Desplegar en Kubernetes') {
      steps {
        sh '''
          kubectl apply -f k8s/
          kubectl rollout status deployment/nest-devops-lab --timeout=120s
        '''
      }
    }
  }
}