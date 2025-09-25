# Réservations — Notes de conception

## 🚧 En cours de développement / réflexions

### Architecture technique

- **Frontend** : Angular 19 (hébergé chez OVH)  
- **Backend** : API REST développée avec Java Spring Boot (JDK 17)  
  - Packagée dans des conteneurs Docker  
  - Déployée sur Render.com  
- **Base de données** : PostgreSQL  

### Modélisation des données

- Conception complète du **MCD** (entités & relations)  
- Transformation en **MLD** avec définition des tables nécessaires  
- Objectif : gestion claire des réservations, des participations et des invités  

### Rôles et permissions

- **User (joueur)**  
  - Réserver un court (public ou privé)  
  - Ajouter des invités  
  - Rejoindre une réservation publique et y ajouter des invités  

- **Manager**  
  - Créer des lieux et y associer des courts  
  - Gérer les réservations/participations liées aux courts dont il est responsable  

- **Admin**  
  - Accès complet à toutes les fonctionnalités  

### CI/CD

- Définition de fichiers `Dockerfile` pour le build  
- Mise en place d’un pipeline **CI/CD** (déclenché sur `push` vers `main`)  
- Déploiement automatisé des conteneurs Docker sur **Render.com**

---

✍️ *Ces notes résument l’état actuel de la réflexion et de la conception autour du module de réservations.*
