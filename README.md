# Projet Services Web - Analyse de Cryptomonnaies
**Étudiant :** Thierry POUPON

## Architecture des Services

Le projet utilise une architecture microservices où chaque composant est conteneurisé avec Docker. 

### Services Orchestrés
Le service **crypto-analyzer-docker** orchestre le démarrage automatique des services principaux via son `docker-compose.yml` :

```yaml
# crypto-analyzer-docker/docker-compose.yml
include:
  - path: ../crypto-analyzer-news-store/docker-compose.yml
    name: news-store
  - path: ../crypto-analyzer-analysis/docker-compose.yml
    name: analyzer
  - path: ../crypto-analyzer-frontend/docker-compose.yml
    name: frontend
  - path: ../crypto-analyzer-authentication/docker-compose.yml
    name: auth
```

Pour démarrer les services principaux :
```bash
cd crypto-analyzer-docker
docker-compose up -d
```

### Services à Lancer Manuellement
Certains services nécessitent un lancement manuel pour plus de flexibilité :

1. **crypto-analyzer-metrics-dashboard** (Port: 3007)
   ```bash
   cd crypto-analyzer-metrics-dashboard
   docker-compose up -d
   ```
   - Dashboard de monitoring indépendant
   - Permet une surveillance dédiée des services

2. **crypto-analyzer-notification** (Port: 3011)
   ```bash
   cd crypto-analyzer-notification
   docker-compose up -d
   ```
   - Gestion des notifications en temps réel
   - Service optionnel selon les besoins

3. **crypto-analyzer-news-scraper** (Port: 3003)
   ```bash
   cd crypto-analyzer-news-scraper
   docker-compose up -d
   ```
   - Service de scraping des actualités
   - Lancé séparément pour contrôler la charge du scraping

## Services développés

### Services Crypto
1. **crypto-analyzer-frontend** ([GitHub](https://github.com/thierryherrmann/crypto-analyzer-frontend))
   - Interface utilisateur React/Next.js pour l'analyse des cryptomonnaies
   - Port: 3005

2. **crypto-analyzer-analysis** ([GitHub](https://github.com/thierryherrmann/crypto-analyzer-analysis))
   - Service d'analyse et de traitement des données crypto
   - Port: 3002

3. **crypto-analyzer-authentication** ([GitHub](https://github.com/zkerkeb-class/autenthication-service-thpGitHub)
   - Service de gestion d'authentification
   - Port: 3006

4. **crypto-analyzer-news-scraper** ([GitHub](https://github.com/thierryherrmann/crypto-analyzer-news-scraper))
   - Service de scraping des actualités crypto
   - Port: 3003

5. **crypto-analyzer-news-store** ([GitHub](https://github.com/zkerkeb-class/bdd-services-thpGitHub)
   - Service de stockage des actualités
   - Port: 3004

6. **crypto-analyzer-metrics-dashboard** ([GitHub](https://github.com/zkerkeb-class/metrics-service-thpGitHub)
   - Dashboard de monitoring des services
   - Port: 3007

7. **crypto-analyzer-docker** ([GitHub](https://github.com/thierryherrmann/crypto-analyzer-docker))
   - Service principal d'orchestration Docker
   - Gère le démarrage coordonné de tous les services
   - Configure les réseaux et volumes partagés
   - Point d'entrée unique pour déployer l'application

8. **crypto-analyzer-notification** ([GitHub](https://github.com/zkerkeb-class/notification-mail-sms-service-thpGitHub)
   - Service de gestion des notifications
   - Port: 3011

### Service de Paiement
- **payment-services** ([GitHub](https://github.com/zkerkeb-class/payment-services-thpGitHub)
   - Service de gestion des paiements
   - Port: 3010

---

# Crypto Analyzer - Interface Frontend

## 📊 Vue d'ensemble

Application d'analyse de sentiments pour les cryptomonnaies, utilisant une architecture microservices. L'application collecte et analyse les actualités pour fournir des recommandations d'investissement basées sur l'analyse des sentiments.

## 🏗️ Architecture des Services

### Frontend (Port: 3000)
- Interface utilisateur React/Next.js
- Visualisation des analyses avec graphiques
- Communication avec le service d'analyse

### Services Backend

#### 1. Data Collector Service (Port: 3001)
- Collecte des actualités crypto
- Sources : CryptoPanic API
- Stockage dans MongoDB
- Endpoint principal : `/api/search`

#### 2. Crypto Analyzer Service (Port: 3002)
- Analyse des sentiments des actualités
- Génération des recommandations
- Calcul des statistiques
- Endpoint principal : `/api/crypto/analyze/:cryptocurrency`

#### 3. Database Service (Port: 27018)
- MongoDB
- Collections :
  * `searchresults` : Actualités collectées
  * `analysis` : Résultats d'analyses

## 🔧 Configuration

### Prérequis
- Docker & Docker Compose
- Node.js 18+
- MongoDB

### Variables d'Environnement
```env
# Frontend
NEXT_PUBLIC_ANALYZER_URL=http://localhost:3002

# Data Collector
MONGODB_URI=mongodb://<username>:<password>@mongodb:27018/searchResults?authSource=admin
CRYPTOPANIC_API_KEY=<your_cryptopanic_api_key>

# Crypto Analyzer
MONGODB_URI=mongodb://<username>:<password>@mongodb:27018/searchResults?authSource=admin
PORT=3002

# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password123
```

# Frontend Environment Variables

Les variables d'environnement sont configurées dans le `docker-compose.yml` :

```yaml
environment:
  - NEXT_PUBLIC_API_URL=http://crypto-analyzer-analysis:3002
  - NEXT_PUBLIC_AUTH_URL=http://localhost:3006
  - NEXT_PUBLIC_FRONTEND_URL=http://localhost:3005
```

Note : Les variables MongoDB mentionnées précédemment sont utilisées par les services backend (data-collector et crypto-analyzer), pas par le frontend.

## 🌐 Réseau Docker

Tous les services sont connectés via le réseau Docker `crypto_network` :

```yaml
networks:
  crypto_network:
    name: crypto_network
    external: true
```

### Configuration des Services dans le Réseau

1. Créer le réseau (uniquement lors de la première installation) :
```bash
# Vérifier si le réseau existe déjà
docker network ls | grep crypto_network

# Si le réseau n'existe pas, le créer
docker network create crypto_network
```

2. Connexion des services :
```yaml
services:
  frontend:
    networks:
      - crypto_network
  
  data-collector:
    networks:
      - crypto_network
  
  crypto-analyzer:
    networks:
      - crypto_network
  
  mongodb:
    networks:
      - crypto_network
```

## 🚀 Démarrage

1. Vérifier/Créer le réseau Docker (première installation uniquement) :
```bash
# Vérifier si le réseau existe
docker network ls | grep crypto_network

# Créer le réseau si nécessaire
docker network create crypto_network
```

2. Lancer MongoDB :
```bash
cd database-mongo-service
docker-compose up -d
```

3. Lancer le Data Collector :
```bash
cd data-collector-service
docker-compose up -d
```

4. Lancer l'Analyzer :
```bash
cd mcp-crypto-analyzer-service
docker-compose up -d
```

5. Lancer le Frontend :
```bash
cd crypto-analyzer-frontend
docker-compose up -d
```

## 📊 Fonctionnalités

### Analyse des Cryptomonnaies
- Saisie du nom de la crypto (ex: bitcoin, ethereum)
- Affichage des statistiques :
  * Nombre total d'articles
  * Articles positifs/négatifs/neutres
  * Niveau de confiance
- Graphique de répartition des sentiments
- Recommandation (Buy/Sell/Hold)

### Données Collectées
- Actualités des dernières 24h
- Sources multiples via CryptoPanic
- Analyse de sentiment par article
- Stockage persistant dans MongoDB

## 🔄 Flux de Données

1. L'utilisateur saisit une cryptomonnaie
2. Le frontend contacte le service d'analyse
3. Le service d'analyse :
   - Récupère les données du collector
   - Analyse les sentiments
   - Calcule les statistiques
   - Génère une recommandation
4. Le frontend affiche les résultats

## 🛠️ Maintenance

### Logs
- Chaque service a son propre système de logs
- Stockés dans `/logs/combined.log` et `/logs/error.log`
- Format : Winston logger avec niveaux (info, warn, error)

### Monitoring
- Vérifier les logs des services
- Surveiller l'espace MongoDB
- Vérifier la connexion réseau entre les services

## 🔒 Sécurité

- Authentification MongoDB
- Variables d'environnement pour les secrets
- CORS configuré sur les API
- Réseau Docker isolé