(function() {
  let userInput = document.getElementById("user-input"), spaceInput = document.getElementById("space-input"),
    memberInputUsername = document.getElementById("member-input-username"), memberInputSpacename = document.getElementById("member-input-spacename"), 
    userBox =  document.getElementById("user-box"), spaceBox =  document.getElementById("space-box"),
    memberBox =  document.getElementById("member-box"), channel = 'objects';

  let users = [];
  let spaces = [];
  let members = [];

  // Init PubNub
  let pubnub = new PubNub({
    publishKey : 'INSERT_PUB_KEY',
    subscribeKey : 'INSERT_SUB_KEY',
    ssl: true
  });

  // Listen to messages that arrive in the channel
  pubnub.addListener({
    message: function(msg) {
      if(msg.message.userInput){
        users.unshift(msg.message.userInput);
        userBox.innerHTML =  (''+msg.message.userInput)+ '<br>' + userBox.innerHTML;
      }

      else if(msg.message.spaceInput){
        spaces.unshift(msg.message.spaceInput);
        spaceBox.innerHTML =  (''+msg.message.spaceInput)+ '<br>' + spaceBox.innerHTML;
      }

      else if(msg.message.memberInputSpacename){
        members.unshift({
          'space_name' : msg.message.memberInputSpacename,
          'user_name' : msg.message.memberInputUsername,
        });
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
  addUserInfo = (e) => {
    if((e.keyCode || e.charCode) === 13){
      publish({
        userInput: userInput.value
      });
      userInput.value = '';
    }
  }

  userInput.addEventListener('keypress', addUserInfo);

  // Add space
  addSpaceInfo = (e) => {
    if((e.keyCode || e.charCode) === 13){
      publish({
        spaceInput: spaceInput.value
      });
      spaceInput.value = '';
    }
  }

  spaceInput.addEventListener('keypress', addSpaceInfo);

  // Add user to a space
  addMemberToSpace = (e) => {
    if((e.keyCode || e.charCode) === 13){
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
  }

  memberInputUsername.addEventListener('keypress', addMemberToSpace);

  removeUser = () =>{
    if(userBox.innerHTML.length === 0) return;
    users = users.slice(1);
    userBox.innerHTML = '';
    for(let x = users.length - 1; x >= 0; x--){ // start from end of array
			userBox.innerHTML = (''+ users[x]) + '<br>' + userBox.innerHTML;
		}
  }

  removeSpace = () => {
    if(spaceBox.innerHTML.length === 0) return;
    spaces = spaces.slice(1);
    spaceBox.innerHTML = '';
    for(let x = spaces.length - 1; x >= 0; x--){ // start from end of array
			spaceBox.innerHTML = (''+ spaces[x]) + '<br>' + spaceBox.innerHTML;
		}
  }

  removeMember = () => {
    members = members.slice(1);
    memberBox.innerHTML = '';

    for(let x = members.length - 1; x >= 0; x--){ // start from end of array
      let obj = members[x];
      let keyOne = obj[Object.keys(obj)[0]]; // get first value of object
      let keyTwo = obj[Object.keys(obj)[1]]; // get second value of object
			memberBox.innerHTML = (''+ keyOne) + ': ' + (''+ keyTwo) + '<br>' + memberBox.innerHTML;
		}
  }

})();
  