// Player enters lobby name and game starts once two players are in the same lobby
(function() {
let userInput = document.getElementById("user-input"), spaceInput = document.getElementById("space-input"),
  memberInputUsername = document.getElementById("member-input-username"), memberInputSpacename = document.getElementById("member-input-spacename"), 
  userButton =  document.getElementById("user-button"), spaceButton =  document.getElementById("space-button"), 
  memberButton =  document.getElementById("member-button"), userBox =  document.getElementById("user-box"), spaceBox =  document.getElementById("space-box"),
  memberBox =  document.getElementById("member-box"), userRemoveButton =  document.getElementById("user-remove-button"), 
  spaceRemoveButton =  document.getElementById("space-remove-button"), memberRemoveButton =  document.getElementById("member-remove-button"), 
  channel = 'objects';

  let pubnub = new PubNub({
    publishKey : 'INSERT_PUB_KEY',
    subscribeKey : 'INSERT_SUB_KEY',
    ssl: true
  });

  // Listen to messages that arrive in the channel
  pubnub.addListener({
    message: function(msg) {
      if(msg.message.userInput){
        console.log(msg.message)
        userBox.innerHTML =  (''+msg.message.userInput)+ '<br>' + userBox.innerHTML;
      }

      else if(msg.message.spaceInput){
        console.log(msg.message.spaceBox)
        spaceBox.innerHTML =  (''+msg.message.spaceInput)+ '<br>' + spaceBox.innerHTML;
      }

      else if(msg.message.memberInputSpacename){
        console.log(msg.message)
        memberBox.innerHTML =  (''+msg.message.memberInputSpacename)+ ': ' + (''+msg.message.memberInputUsername) +'<br>' + memberBox.innerHTML;
      }
    }
  });

  // Subscribe to a channel
  pubnub.subscribe({channels: [channel]}); 

  // Helper function to publish messages to channel
  publish = (data) => {
    pubnub.publish({
      channel: channel,
      message: data
    })
  }	

  // Add user
  addUser = () => {
    publish({
      userInput: userInput.value
    })
    userInput.value = '';
  }

  // Add space
  addSpace = () => {
    publish({
      spaceInput: spaceInput.value
    })
    spaceInput.value = '';
  }

  // Add user to a space
  addMemberToSpace = () => {
    // Input fields cannot be empty
    if(memberInputSpacename.value && memberInputUsername.value){
      publish({
        memberInputSpacename: memberInputSpacename.value,
        memberInputUsername: memberInputUsername.value
      });
      memberInputSpacename.value = '';
      memberInputUsername.value = '';
    }
    else {
      alert('Enter both space and user field')
    }
  }
})();
  