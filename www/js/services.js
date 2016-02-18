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

.factory('RootFirebase', ['FIREBASE_URL', function (FIREBASE_URL) {
    return new Firebase(FIREBASE_URL);
}])

.factory('FirebaseSignIn', ['$firebaseAuth', 'NotImplementedException', 'RootFirebase', '$q',
    function ($firebaseAuth, NotImplementedException, RootFirebase, $q) {
        var auth = $firebaseAuth(RootFirebase),
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
                .then(auth.$authWithPassword)
                .then(pushUserDataIfNecessary);
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
                randomString += alphabet[randomIndex];
            }
            
            return randomString;
        }
        
        function createLocalLogin() {
            var newLoginCredentials = createLocalLoginCredentials();
            localStorage.email = newLoginCredentials.email;
            localStorage.password = newLoginCredentials.password;
            
            return auth.$createUser(newLoginCredentials);
        }
        
        function pushUserDataIfNecessary(authData) {
            var userRef = RootFirebase
                .child('users')
                .child(authData.uid);
                
            var authDataInserter = InsertThis(authData);
                
            return checkIfExists(userRef)
                .then(null, pushUserData)
                .then(authDataInserter);
        }
        
        function pushUserData(newUserRef) {
            return $q(function (resolve, reject) {
                newUserRef.set({name: 'testuserinfo'}, function (err) {
                    if (err) {
                        reject();
                    } else {
                        resolve();
                    }
                });
            });
        }
        
        function InsertThis(val) {
            return function () {
                return val;
            } 
        }
        
        
        function checkIfExists(firebaseRef) {
            return $q(function (resolve, reject) {
                firebaseRef.once('value', function (snapshot) {
                    if (snapshot.val()) {
                        resolve();
                    } else {
                        reject(firebaseRef);
                    }
                });
            });
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
        return FirebaseSignIn[DEFAULT_AUTH_METHOD]()
            .then(function (authData) {
                return authData.uid;
            });
    }
])

.factory('UserTasksFirebase', ['FirebaseUid', 'RootFirebase',
    function (FirebaseUid, RootFirebase) {
        return FirebaseUid
            .then(function (uid) {
               return RootFirebase
                .child('tasks')
                .child(uid); 
            });
    }
])

.factory('TaskFirebaseQuery', ['UserTasksFirebase',
    function (UserTasksFirebase) {
        
        function queryActiveTasks() {
            return UserTasksFirebase
                .then(function (tasksRef) {
                    return tasksRef
                        .orderByChild('active')
                        .equalTo(true);
                });
        }
        
        function queryByTaskName(taskName) {
            return UserTasksFirebase
                .then(function (tasksRef) {
                    return tasksRef
                        .orderByChild('title')
                        .startAt(taskName)
                        .limitToFirst(10);
                });
        }
        
        /*
            returns a promise that resolves to the 
            results queried from
            the active user's firebase tasks
        */
        return {
            getActiveTasks: queryActiveTasks,
            searchByName: queryByTaskName,
        }
    }
])

.factory('GetTask', ['UserTasksFirebase', '$firebaseObject',
    function (UserTasksFirebase, $firebaseObject) {
        
        function getTaskRef(taskUid) {
            return UserTasksFirebase
                .then(function (tasksRef) {
                    return tasksRef
                        .child(taskUid);
                });
        }
        
        return function (taskUid) {
            getTaskRef(taskUid)
                .then(function (taskRef) {
                    return $firebaseObject(taskRef);
                })
        }
    }
])

.factory('ActiveTasks', ['TaskFirebaseQuery', '$firebaseArray',
    function (TaskFirebaseQuery, $firebaseArray) {
        return TaskFirebaseQuery.queryActiveTasks()
            .then(function (query) {
                return $firebaseArray(query);
            })
    }
])

.factory('SearchTasksByTitle', ['TaskFirebaseQuery', '$firebaseArray',
    function (TaskFirebaseQuery, $firebaseArray) {
        return TaskFirebaseQuery.searchByName()
            .then(function (query) {
                return $firebaseArray(query);
            })
    }
]);
