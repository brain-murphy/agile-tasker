/* global angular, Firebase */
angular.module('app.services', ['firebase'])

.constant('FIREBASE_URL', 'https://agiletasker.firebaseio.com/')

.constant('DEFAULT_AUTH_METHOD', 'local')

.factory('NotImplementedException', function () {

        function NotImplementedException(message) {
            this.name = 'NotImplementedException';
            this.message = message;
        }
        NotImplementedException.prototype = new Error();
        NotImplementedException.prototype.constructor = NotImplementedException;
        
        return NotImplementedException;
})

.factory('RootFirebaseRef', ['FIREBASE_URL', function (FIREBASE_URL) {
    return new Firebase(FIREBASE_URL);
}])

.factory('FirebaseSignIn', ['$firebaseAuth', 'NotImplementedException', 'RootFirebaseRef', '$q',
    function ($firebaseAuth, NotImplementedException, RootFirebaseRef, $q) {
        var auth = $firebaseAuth(RootFirebaseRef),
            currentSignOnMethod;
        
        function signInWithFacebook() {
            currentSignOnMethod = 'facebook';
            throw new NotImplementedException('facebook auth not implemented');
        }
        
        function signInWithGithub() {
            currentSignOnMethod = 'github';
            throw new NotImplementedException('Github auth not implemented');
        }
        
        function useLocalSignIn() {
            currentSignOnMethod = 'local';
            return $q(function (resolve, reject) {
                if (isSignedInLocally()) {
                    resolve(auth.$getAuth());
                } else {
                    resolve(signInLocally());
                }
            })
        }
        
        function isSignedInLocally() {
            return auth.$getAuth() && auth.$getAuth().provider === 'password';
        }
        
        function signInLocally() {
            return getLocalLoginCredentials()
                .then(auth.$authWithPassword);
        }
        
        function hasSignedInLocally() {
            return localStorage.email && localStorage.password;
        }
        
        function getLocalLoginCredentials() {
            if (hasSignedInLocally()) {
                return $q.when(readCredentialsFromLocalStorage());
                
            } else {  
                return createLocalLogin()
                    .then(function () {
                        return readCredentialsFromLocalStorage();
                    });
            }
        }
        
        function readCredentialsFromLocalStorage() {
            return {
                email: localStorage.email,
                password: localStorage.password
            }
        }
        
        function createLocalLoginCredentials() {  
            return {
                email: randomString() + '@fake.agiletasker.com',
                password: randomString()
            }
        }
        
        function randomString() {
            var alphabet = 'abcdefghijklmnopqrstuvwxyz',
                randomString = '',
                randomIndex;
                
            for (var i = 0; i < 10; i++) {
                randomIndex = Math.floor(Math.random() * alphabet.length);
                randomString[i] = alphabet[randomIndex];
            }
            
            return randomString;
        }
        
        function createLocalLogin() {
            var newLoginCredentials = createLocalLoginCredentials();
            localStorage.email = newLoginCredentials.email;
            localStorage.password = newLoginCredentials.password;
            
            return auth.$createUser(newLoginCredentials);
        }
        
        return {
            facebook: signInWithFacebook,
            github: signInWithGithub,
            local: useLocalSignIn,
            currentMethod: currentSignOnMethod
        }
    }
])

.factory('FirebaseUid', ['FirebaseSignIn', 'DEFAULT_AUTH_METHOD',
    function (FirebaseSignIn, DEFAULT_AUTH_METHOD) {
         
        return function getUid() {
            return FirebaseSignIn[DEFAULT_AUTH_METHOD]()
                .then(function (authData) {
                    console.log(authData.uid);
                    return authData.uid;
                });
        }
        
    }
]);

