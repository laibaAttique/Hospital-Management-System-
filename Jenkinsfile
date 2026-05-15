pipeline {
  agent any

  tools {
    nodejs 'NodeJS-18'
  }

  environment {
    DOCKER_IMAGE_BACKEND = 'hospital-backend'
    DOCKER_IMAGE_FRONTEND = 'hospital-frontend'
    DOCKER_IMAGE_SELENIUM = 'hospital-selenium-tests'
  }

  stages {

    stage('Code Build') {
      steps {
        echo 'Cloning repository and installing dependencies...'

        checkout scm

        dir('backend') {
          sh 'npm install'
        }

        dir('frontend') {
          sh 'npm install'
          sh 'npm run build'
        }

        echo 'Code Build completed successfully.'
      }
    }

    stage('Unit Testing') {
      steps {
        echo 'Running unit tests...'

        dir('backend') {
          sh 'npm test'
        }

        echo 'Unit Testing completed.'
      }
    }

    stage('Containerized Deployment') {
      steps {
        echo 'Building and deploying Docker containers...'

        sh 'docker-compose down || true'
        sh 'docker-compose build'
        sh 'docker-compose up -d db backend frontend'

        echo 'Application deployed successfully in containers.'
      }
    }

    stage('Containerized Selenium Testing') {
      steps {
        echo 'Building Selenium Docker image and running tests...'

        sh 'docker build -t $DOCKER_IMAGE_SELENIUM ./selenium-tests'

        sh '''
          docker run --rm \
            --network hospital-management-system-_default \
            $DOCKER_IMAGE_SELENIUM
        '''

        echo 'Selenium tests completed.'
      }
    }

  }

  post {
    success {
      echo 'Pipeline completed successfully! All stages passed.'
    }

    failure {
      echo 'Pipeline failed. Please review the logs above.'
    }

    always {
      echo 'Pipeline execution finished.'
    }
  }
}