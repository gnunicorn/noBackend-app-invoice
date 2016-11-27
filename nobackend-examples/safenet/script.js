// 
// This file implements the "Dreamcode" of the
// invoice app. It contains all the logic needed
// to make the static HTML app a full stack application,
// including user accounts, data synchronization and
// sending emails.
// 
// It's meant to be used as a scaffold for noBackend
// solutions, no implement its logic and making the app's
// functionality real.
// 
// See also: http://nobackend.org/dreamcode.html
// 

// 
// to allow for a nice, chainable API, each method returns
// a promise. 
// 

// accept only on safe and/or localhost
if (document.location.protocol !== 'safe:') {
  if (document.location.hostname !== 'localhost') {
    alert("You need to run this within the SAFE browser!");
    document.getElementsByClassName('invoiceSheet')[0].innerHTML = document.getElementById('redirectToSafe').innerHTML;
    document.getElementsByClassName('footerBar')[0].innerHTML = '';
    throw("Unsupported Error")
  }
}


var _promise = function () {
  var defer = $.Deferred()
  defer.resolve.apply( defer, arguments )
  return defer.promise()
}

function wrapPromise(prms) {
  var defer = $.Deferred();
  prms.then(defer.resolve,
            defer.reject)
  return defer;
}


var accessToken;

// 
// data store dreamcode
// 
var store = {

  findAll : function(type) {
    function fetch() {

    return wrapPromise(safeNFS.getDir(accessToken, "" + type).then(function(dir) {
      console.log("found dir", dir)
      return Promise.all(dir.files.map(function(file) {
        console.log("found", file)
        return safeNFS.getFile(accessToken, type + '/' + file.name, 'text').then(JSON.parse.bind(JSON));
      }));
    }, function(err) {
      // we just _assume_ the directory isn't existing yet
      // create it
      console.warn(err);
      return safeNFS.createDir(accessToken, ""+ type).then(function() { return [] });
    }));

    }

    if (!accessToken) return account._signIn().then(fetch);

    return fetch();
  },

  // add a new or update an existing object
  save : function(object) {
    console.log(object)
    if (!accessToken) return $.Deferred().reject("You need to login first");
    return wrapPromise(safeNFS.createOrUpdateFile(
      accessToken,
      object.type + '/' + object.id + ".json",
      JSON.stringify(object)
    ));
  },

  // remove object from store
  remove : function(object) {
    if (!accessToken) return $.Deferred().reject("You need to login first");
    console.log("store.remove: ", object)
    return _promise(object)
  }
}

var app = {
    name: "safejs-nobackend-invoice-example",
    id: "net.maidsafe.examples.nobackend-invoice",
    version: "2016-11-27",
    vendor: "Benjamin Kampmann",
    permissions: ["SAFE_DRIVE_ACCESS"]
};


// 
// account dreamcode
// 
var account = {
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
    return _promise()
  },
  resetPassword : function( username ) {
    return $.Deferred().reject("Not Supported");
  },
  changePassword : function( current_password, new_password ) {
    return $.Deferred().reject("Not Supported");
  },
  changeUsername : function( current_password, new_username ) {
    return $.Deferred().reject("Not Supported");
  },
  destroy : function() {
    return $.Deferred().reject("Not Supported");
  },

  // to handle user account events
  on : function(event, callback) {
    console.log("account.on(\""+event+"\")", callback)
  }
}

// subscribe to account events
account.on('signin', App.renderUserSignedIn)
account.on('signout', App.renderUserSignedOut)
account.on('unauthenticated', App.renderUserAuthenticationError)


// 
// remote / sync dreamcode
// 
var remote = {
  on : function (event, callback) {
    console.log("remote.on(\""+event+"\")", callback)
  }
}
remote.on('add:invoice', App.addInvoiceFromRemote )
remote.on('remove:invoice', App.removeInvoiceFromRemote)
remote.on('update:invoice', App.updateInvoiceFromRemote)


//
// download & convert dreamcode
// 
var download = function ( what ) {
  console.log('download: ', what)
}
var convert = function ( el ) {
  console.log('convert', el)

  var to = function( filename ) {
    console.log('to', filename)
    return "converted " + el.toString() + " to " + filename
  }

  return { to: to }
}


// 
// email dreamcode
// 
var sendEmail = function(options) {
  console.log('sendEmail: ', options)
}


// 
// Question? Suggestions? Hugs? Please get in touch:
// http://nobackend.org | https://twitter.com/nobackend
// 