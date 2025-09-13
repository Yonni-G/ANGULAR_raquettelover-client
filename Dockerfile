# Étape 1 : build Angular dans un conteneur Node
FROM node:18 AS build
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le code source Angular
COPY . .

# Builder l'application en mode production
RUN npm run build -- --configuration=prod

# Étape 2 : servir les fichiers statiques avec nginx
FROM nginx:alpine
COPY --from=build /app/dist/raquettelover-client/browser /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
