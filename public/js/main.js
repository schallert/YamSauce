var SauceApp = function (currentUser) {
  var log = function (d) { }

  var globalUsers = new UserCollection();
  SauceUtil.init(currentUser, globalUsers);

  SauceApp.masterGroups = new GroupCollection();

  SauceApp.masterGroups.on("change",function(){
    var allRead = true;
    SauceApp.masterGroups.each(function(group){

      if(group.get("unreadCount") != 0) allRead = false;
    });
    if(allRead) { $("#empty-inbox").show(); }
  },this);

  SauceUtil.getInboxMessages(function (msgData) {
    var inboxThreads = new ThreadCollection();

    SauceUtil.extractGlobalUsers(msgData.references);

    var messages = msgData.messages;
    SauceUtil.addMessagesToThreads(messages, inboxThreads);

    var threaded_extended = msgData.threaded_extended;
    SauceUtil.addCommentsToThreads(threaded_extended, inboxThreads);
    
    $("#loading-message").hide();
    //Testing Creating Thread Views and Such
    var testGroup = new GroupModel({
        id : 0,
        name : "Inbox Messages",
        threads : inboxThreads
    });

    SauceApp.masterGroups.add(testGroup);

    var testGroupView = new GroupView({group: testGroup});
    testGroupView.render();
  });

  SauceUtil.getTopGroups(function (groupsData) {
    _.each(groupsData, function (groupData) {
      var groupThreads = new ThreadCollection();

      // For the current group, grab its messages, add them to threads
      SauceUtil.getGroupMessages(groupData.id, function (msgData) {
        // THIS ENTIRE FUNCTION DOESN'T TRIGGER UNTIL
        // THE API CALL FOR GETTING MESSAGES FROM A GROUP RETURNS

        SauceUtil.extractGlobalUsers(msgData.references);

        var messages = msgData.messages;
        SauceUtil.addMessagesToThreads(messages, groupThreads);

        var threaded_extended = msgData.threaded_extended;
        SauceUtil.addCommentsToThreads(threaded_extended, groupThreads);

        // Create the group model and add it to topGroups collection
        var group = new GroupModel({
          id: groupData.id
          , name: groupData.full_name
          , threads: groupThreads
        });

        $("#loading-message").hide();

        SauceApp.masterGroups.add(group);

        var groupView = new GroupView({ group: group });
        groupView.render();
      });
    });
  });

  $(document).keydown(function (e) {
    if (e.keyCode == 80 || e.keyCode == 79) {
      var user = globalUsers.models[_.random(0, globalUsers.length)];

      var faceBox = $('<div/>', {
        class: 'faceBox'
      }).css("left", _.random(100, $('body').width() - 100));

      var hat = $('<img/>', {
        class: 'hat'
        , src: 'http://1.bp.blogspot.com/-5QhgdSm4VrU/Tu1_FdGUbbI/AAAAAAAAAZg/hiq91OLnFL0/s320/santa-hat.png'
      });

      var faceImage = $('<img/>', {
        class: 'faceImage'
        // , src: e.keyCode == 80 ? user.mugshot_url : 'https://mug0.assets-yammer.com/mugshot/images/150x150/QhmmjfSfRQFQxfr9sPx2MG6c0301HHmn'
        , src: e.keyCode == 80 ? user.mugshot_url : '/img/pisoni.jpg'
      });
      hat.appendTo(faceBox);
      faceImage.appendTo(faceBox);

      $('body').prepend(faceBox);
      faceBox.animate({ top: "1000px" }, 5000, function () {
        faceBox.remove();
      });
    }
  });

  // SauceUtil.getCurrentUser(log);
  // SauceUtil.getTopGroups(log);
  // SauceUtil.getInboxMessages(log);
  // SauceUtil.getGroupMessages(1201487, log);
  // SauceUtil.postGroupMessage(1201487, null, "sauceTest", log);
  // SauceUtil.postGroupMessage(1201487, 309226587, "format test @shilal1", log);
  // SauceUtil.getUserGroups(log);
}

yam.config({
  appId: 'GUxLUf5ujCfUT7CJ3qTg'
});

yam.getLoginStatus(
  function(response) {
    if (response.authResponse) {
      yam.request({
        url: "https://www.yammer.com/api/v1/users/current.json"
        , method: "GET"
        , data: {
          include_top_groups: true,
        }
        , success: function (user) {
          SauceApp(user);
        }
        , error: function (err) {
          console.error(err);
        }
      });
    }
    else {
      yam.login(function (response) { //prompt user to login and authorize your app, as necessary
        if (response.authResponse) {
          // console.dir(response); //print user information to the console
        }
      });
    }
  }
);