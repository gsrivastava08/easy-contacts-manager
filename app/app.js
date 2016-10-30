var app = angular.module('ContactsApp', ['blockUI']);

app.run(function(){
  $('[data-toggle="tooltip"]').tooltip();
  $("#updateDate").datepicker({
    autoclose: true,
    endDate: '0d',
    clearBtn: true
  });

})

app.config(function(blockUIConfig) {
  blockUIConfig.autoBlock = false;
});

app.constant('config', {
  clientId : '654918895383-cahnslo33le0qvbj3cu06amct9giv2kk.apps.googleusercontent.com',
  apiKey : 'AIzaSyB7DSEcRRSS9xomKmyuG4Ubgz-qd2yhUpw',
  scopes : ['https://www.google.com/m8/feeds','https://www.googleapis.com/auth/userinfo.profile']
});
