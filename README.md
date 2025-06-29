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
MONGODB_URI=mongodb://admin:password123@mongodb:27018/searchResults?authSource=admin
CRYPTOPANIC_API_KEY=votre_clé_api

# Crypto Analyzer
MONGODB_URI=mongodb://admin:password123@mongodb:27018/searchResults?authSource=admin
PORT=3002

# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password123
```

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