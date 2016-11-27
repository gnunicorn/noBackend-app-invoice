// 
// This file implements the "Dreamcode" of the
// invoice app for the SAFE Netwok. It contains all the logic needed
// to make the static HTML app a full stack application,
// including user accounts, data synchronization and
// sending emails.
// 
// It's meant to be used as a scaffold for noBackend
// solutions, no implement its logic and making the app's
// functionality real.
// 
// See also:
//
//  - http://www.safedev.org
//  - http://tutorials.safedev.org
//  - http://api.safedev.org
// 
// to allow for a nice, chainable API, each method returns
// a promise. 



// Globals
// Here we store the access token
var accessToken;

// and define our App information for authentication
var app = {
    name: "safejs-nobackend-invoice-example",
    id: "net.maidsafe.examples.nobackend-invoice",
    version: "2016-11-27", // using the date for version
    vendor: "Benjamin Kampmann",
    permissions: ["SAFE_DRIVE_ACCESS"]
};



// If we are not hosted on SAFE
// and not running on localhost, we'll show the error message
if (document.location.protocol !== 'safe:') {
  if (document.location.hostname !== 'localhost0') {
    alert("You need to run this within the SAFE browser!");
    var errMsg = document.getElementById('redirectToSafe').innerHTML;
    document.getElementsByClassName('invoiceSheet')[0].innerHTML = errMsg;
    document.getElementById('invoiceBtn').innerHTML = '';
    throw("Unsupported Error")
  }
}


// A helper function that wraps our promises
// into a jquery-style Deferred as the API requires it
function wrapPromise(prms) {
  var defer = $.Deferred();
  prms.then(defer.resolve,
            defer.reject)
  return defer;
}


// 
// data store dreamcode
// 

// In DreamCode, every object has at least a `type` and an `id`-field. WSo we'll use those
// to organise our data, where we have one folder per `type` and then store each items as
// stringified json file under `${type}/${id}.json`. Thus we can only use the usual NFS system
// easily to provide the full API required

var store = {

  // entry point to the app: tries to fetch all data
  findAll : function(type) {
    function fetch() {

    // let's fetch the folder of `type` and read all its files
    // we assume there is nothing else in there than stuff we stored before
    return wrapPromise(safeNFS.getDir(accessToken, "" + type).then(function(dir) {
      return Promise.all(dir.files.map(function(file) {
        // then return that list json-prased objects
        return safeNFS.getFile(accessToken, type + '/' + file.name, 'text')
            .then(JSON.parse.bind(JSON));
      }));
    }, function(err) {
      // we just _assume_ the directory isn't existing yet, so we create it
      console.warn(err);
      return safeNFS.createDir(accessToken, ""+ type).then(function() { return [] });
    }));

    }

// so if it isn't logged in yet, we try to authenticate and then fetch or
// otherwise fetch directly
    if (!accessToken) return account._signIn().then(fetch);

    return fetch();
  },

  // add a new or update an existing object
  save : function(object) {
    if (!accessToken) return $.Deferred().reject("You need to login first");
    return wrapPromise(safeNFS.createOrUpdateFile(
      accessToken,
      object.type + '/' + object.id + ".json",
      JSON.stringify(object)
    ));
  }
}


// 
// account dreamcode
// 
var account = {
  // internal function as we also want to call it from the
  // Store
  _signIn: function () {
    return safeAuth.authorise(app).then(function(resp){
      accessToken = resp.token;
      App.renderUserSignedIn();
    });
  },
  signUp : function( username, password ) {
    return wrapPromise(account._signIn());
  },
  signIn : function( username, password ) {
    return account.signUp();
  },
  signOut : function() {
    accessToken = null;
    return $.Deferred().resolve(object).promise();
  }
}