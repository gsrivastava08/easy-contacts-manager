app.controller('ContactsCtrl', ['$scope', 'ContactsServ', 'blockUI' ,function($scope, ContactsServ, blockUI){

  $scope.screen = 'authScreen';
  $scope.hasData = false;
  $scope.userInfo = null;
  $scope.states = null;
  $scope.filteredContactList = [];
  $scope.activeClass = 'all';
  $scope.btnSelectAll = false;
  $scope.updateDate = null;

  $scope.initAuth = function(){
    $scope.screen = 'loadingScreen';
    ContactsServ.initUserAuth().then($scope.loadContacts, function(){
      alert('Something went wrong. Please try again later.')
    });
  }



  $scope.loadContacts = function(){
    $scope.getUserInfo();
    ContactsServ.loadContacts().then(function(){
        $scope.hasData = true;
        blockUI.stop();
        $scope.states = ContactsServ.contactStats;
        $scope.getFilteredList();
    })
  }

  $scope.getFilteredList = function(filter){
    $scope.activeClass = (!filter) ? 'all' : filter;
    $scope.btnSelectAll = false;
    $scope.updateDate = '';
    $scope.selectAll();
    if(!filter || filter == "all"){
          $scope.filteredContactList = ContactsServ.contactsData;
    }
    else if(filter == 'mobile'){
      $scope.filteredContactList = ContactsServ.contactsData.filter(function(item){
        return item.phoneDisplay != null;
      })
    }else if(filter == 'email'){
      $scope.filteredContactList = ContactsServ.contactsData.filter(function(item){
        return item.email != null;
      })
    }
  }

  $scope.getUserInfo = function(){
    ContactsServ.getUserInfo().then(function(){
      $scope.userInfo = ContactsServ.userInfo;
    })
  }

  $scope.deleteContacts = function(){
    var deleteList = $scope.filteredContactList.filter(function(item){
      return item.isSelected;
    })
    if(deleteList.length > 0)
      alertify.confirm("Are you sure you want to delete "+deleteList.length+" contact(s) ?", function (e) {
        if (e) {
          blockUI.start("Please wait...");
          $scope.initDelete(deleteList);
        }
      });
  }

  $scope.initDelete = function(list){
    if(list.length > 0){
      ContactsServ.deleteContact(list.pop()).then(function(){
        $scope.initDelete(list);
      })
    }else{
      blockUI.stop();
      alertify.success("Contacts deleated successfull !!!");
      $scope.loadContacts();
    }
  }

  $scope.notImplemented = function(){
    alertify.error("Feature not implemented yet.");
  }

  $scope.selectAll = function(){
    $scope.filteredContactList.forEach(function(item){
      item.isSelected = $scope.btnSelectAll;
    })
  }

  $scope.refresh = function(){
    blockUI.start("Please wait...");
    $scope.loadContacts();
  }

  $scope.dateChanged = function(){
    if(moment($scope.updateDate, "MM/DD/YYYY", true).isValid()){
      $scope.filteredContactList = ContactsServ.contactsData.filter(function(item){
        return moment(item.updated).format('MM/DD/YYYY') == $scope.updateDate;
      })
    }
  }

  $scope.logout = function(){
    $scope.token = null;
    ContactsServ.token = null;
    $scope.hasData = false;
    $scope.screen = 'authScreen';
  }

  $('#updateDate').datepicker()
    .on('clearDate', function(e) {
      $scope.$apply(function(){
        $scope.getFilteredList();
      });
    });

}])
