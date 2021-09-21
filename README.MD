En plus du code, côté Firebase, des actions sont nécessaires pour initialiser l'application :
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