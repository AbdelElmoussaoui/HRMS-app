pipeline {
    agent any
    
    tools {
        jdk 'jdk17'
        maven 'Maven3'
    }
    
    environment {
        SCANNER_HOME = tool 'SonarQube-scanner'
    }
    
    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'main',
                credentialsId: 'd28854da-3d91-43f6-a07c-451ea3cc5f5f',
                url: 'https://github.com/AbdelElmoussaoui/HRMS-app.git'
            }
        }
        
        stage('OWASP Scanner') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --format XML --format HTML --failOnCVSS 7', odcInstallation: 'DPCheck'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
            
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        $SCANNER_HOME/bin/sonar-scanner \
                        -Dsonar.projectName=HRMS-app \
                        -Dsonar.java.binaries=. \
                        -Dsonar.projectKey=HRMS-app
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        
        stage('Build') {
            steps {
                sh "mvn clean package -DskipTests=true -f hrms/pom.xml"
            }
        }
        
        stage('Docker Build & Push') {
            parallel {
                stage('Backend') {
                    steps {
                        script {
                            def imageName = "abdelazizelmoussaoui/hrms-app"
                            withDockerRegistry(credentialsId: '3dd31233-a3a4-49d0-9560-da4957b6f877') {
                                sh "docker build -t ${imageName}:latest -f hrms/Dockerfile hrms/"
                                sh "docker push ${imageName}:latest"
                            }
                        }
                    }
                }
                stage('Frontend') {
                    steps {
                        script {
                            def imageName = "abdelazizelmoussaoui/hrms-frontend"
                            withDockerRegistry(credentialsId: '3dd31233-a3a4-49d0-9560-da4957b6f877') {
                                sh "docker build -t ${imageName}:latest -f hrms-ui/Dockerfile hrms-ui/"
                                sh "docker push ${imageName}:latest"
                            }
                        }
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline terminé avec succès !'
        }
        failure {
            echo 'Pipeline échoué !'
        }
    }
}
