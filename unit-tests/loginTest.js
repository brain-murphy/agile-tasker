/* global angular, describe, beforeEach, it, expect, inject */
describe('app: app', function() {
    
    beforeEach(module('app'));
    
    describe('factory: FirebaseUid', function() {
        var factory = null;
        
        beforeEach(inject(function(FirebaseUid) {
            factory = FirebaseUid;
        }));
        
        it('should return a non empty string', function() {
            factory().then(function (uid) {
                expect(uid).toBeTruthy();
            });
        });
    });
  
});