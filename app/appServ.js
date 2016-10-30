app.factory('ContactsServ', ["$q", "$timeout", "config", "$http", function($q, $timeout, config, $http){

  var ContactsServ = {};

  ContactsServ.token = null;

  ContactsServ.contactsData = null;

  ContactsServ.userInfo = null;

  ContactsServ.contactStats = {all: 0, mobile: 0, email: 0, deleated: 0};

  ContactsServ.initUserAuth = function(){
    var deferred = $q.defer();

    gapi.client.setApiKey(config.apiKey);

    gapi.auth.authorize({
      client_id: config.clientId,
      scope: config.scopes,
      immediate: false
    }, function(dt){
        ContactsServ.token = dt.access_token;
        deferred.resolve();
    });

    return deferred.promise;
  }


  ContactsServ.getUserInfo = function(){
    return $http.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+ContactsServ.token).then(function(data){
      ContactsServ.userInfo = data.data;
    })
  }


  ContactsServ.loadContacts = function(){
    return $http.get('https://www.google.com/m8/feeds/contacts/default/full?alt=json&access_token=' +ContactsServ.token + '&max-results=1000&v=3.0').then(function(data){
      ContactsServ.contactsData = ContactsServ.processList(data.data.feed.entry);
    })
  }

  ContactsServ.processList = function(list){
    var processed_list = [];
    var item = {};
    ContactsServ.contactStats = {all: 0, mobile: 0, email: 0, deleated: 0};
    list.forEach(function(data){
      item.name = data.title.$t;
      item.phoneDisplay = (data.gd$phoneNumber && data.gd$phoneNumber.length > 0) ? data.gd$phoneNumber[0].$t : null;
      item.phoneList = (data.gd$phoneNumber && data.gd$phoneNumber.length > 1) ? data.gd$phoneNumber : null;
      item.email = (data.gd$email && data.gd$email.length > 0) ? data.gd$email[0].address : null;
      item.updated = (data.updated && data.updated.$t) ? data.updated.$t : null;
      item.isSelected = false;
      item.id = data.id.$t.substring(data.id.$t.indexOf('/base/')+6, data.id.$t.length);
      ContactsServ.contactStats.all += 1;
      if(item.phoneDisplay)
        ContactsServ.contactStats.mobile += 1;
      if(item.email)
        ContactsServ.contactStats.email += 1;

      processed_list.push(angular.copy(item));
    })
    return processed_list;
  }


  ContactsServ.deleteContact = function(obj){
    var deferred = $q.defer();
    gapi.client.request({
    method : 'DELETE',
    path:'m8/feeds/contacts/default/full/'+obj.id,
    headers: {'If-Match':'*'},
    callback : function(data) {
      deferred.resolve();
    }
  });
  return deferred.promise;
}

  return ContactsServ;
}])
