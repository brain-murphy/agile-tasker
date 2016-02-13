/* global angular, describe, beforeEach, it, expect, inject, dump */
var globaluid;
describe('app: app', function() {
    
    beforeEach(module('app'));
    
    
    describe('factory: FirebaseUid', function() {
        var factory = null;
        
        beforeEach(inject(function(FirebaseUid) {
            factory = FirebaseUid;
        }));
        
        it('should return a non empty string', inject(function($rootScope, $httpBackend) {
            $httpBackend.expectGET('templates/addATask.html').respond(200, '');
            $httpBackend.expectGET('templates/editTask.html').respond(200, '');
            $httpBackend.expectGET('templates/viewTask.html').respond(200, '');
            $httpBackend.expectGET('templates/priorities.html').respond(200, '');
            $httpBackend.expectGET('templates/menu.html').respond(200, '');
            var uid;
            
            factory().then(function (pUid) {
                uid = pUid;
            });
            console.log('tetst');
            $rootScope.$apply();
            console.log(uid);
            expect(uid).toBeTruthy();
        }));
    });
  
});