pipeline {
  agent any

  environment {
    REGISTRY = 'docker.io'
    IMAGE_NAME = 'tu-usuario/nest-devops-lab'
    IMAGE_TAG = "${env.BUILD_NUMBER ?: 'latest'}"
  }

  stages {
    stage('Clonar repositorio') {
      steps {
        checkout scm
      }
    }

    stage('Construir imagen Docker') {
      steps {
        sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
      }
    }

    stage('Publicar imagen en registro') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-credentials',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin ${REGISTRY}"
          sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
        }
      }
    }
  }
}
