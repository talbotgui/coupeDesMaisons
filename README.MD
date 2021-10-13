# 1. Introduction à l'application


# 2. Guide du développeur

## 2.1. Clone du dépôt
Dans ce dépôt, pour gérer les clefs présentes dans le fichier environment.ts, est utilisé [transcrypt|https://github.com/elasticdog/transcrypt]. Ainsi un submodule est présent dans le dépôt. Pour cloner le dépôt, il faut donc exécuter la commande :
```
git clone --recurse-submodules https://github.com/talbotgui/coupeDesMaisons.git
```

# 2.2. Capitalisation côté Firebase

En plus du code, côté Firebase, des actions sont nécessaires pour initialiser une telle application :
* accéder à la console Firebase : https://console.firebase.google.com
* créer un projet CoupeDesMaisons
* dans le projet, créer une application CoupeDesMaisons
* initialiser Firestore (notamment en définissant le lieu de stockage) via le guide
* définir les règles d'accès à la base de données dans Cloud Firestore > Règles avec la configuration suivante :
```
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
* Créer les collections "adultes", "groupes", "decisions" et "baremes"

