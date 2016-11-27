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
var _promise = function () {
  var defer = $.Deferred()
  defer.resolve.apply( defer, arguments )
  return defer.promise()
}


var accessToken;

// 
// data store dreamcode
// 
var store = {

  findAll : function(type) {
    if (!accessToken) return $.Deferred().reject("You need to login first");
    console.log("store.findAll", type)
    return _promise([])
  },

  // add a new or update an existing object
  save : function(object) {
    if (!accessToken) return $.Deferred().reject("You need to login first");
    console.log("store.save: ", object)
    return _promise(object)
  },

  // remove object from store
  remove : function(object) {
    if (!accessToken) return $.Deferred().reject("You need to login first");
    console.log("store.remove: ", object)
    return _promise(object)
  }
}


// 
// account dreamcode
// 
var account = {
  signUp : function( username, password ) {
    alert("You need to sign up with SAFE Launcher");
    return $.Deferred().reject(false);
  },
  signIn : function( username, password ) {
    console.log("account.signIn: ", username, password)
    App.renderUserSignedIn()
    return _promise(username)
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