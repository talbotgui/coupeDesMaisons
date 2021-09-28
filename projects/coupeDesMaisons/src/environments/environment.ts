// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  collections: {
    adultes: 'adultes-dev',
    groupes: 'groupes-dev',
    baremes: 'baremes-dev',
    decisions: 'decisions-dev'
  },
  firebase: {
    apiKey: "AIzaSyB1LpicPdqSYHF-Q6wmuBrhILyLdzQxQqM",
    authDomain: "coupedesmaisons.firebaseapp.com",
    projectId: "coupedesmaisons",
    storageBucket: "coupedesmaisons.appspot.com",
    messagingSenderId: "553864926573",
    appId: "1:553864926573:web:e24ac6cb68bbef752fb664",
  }
};
