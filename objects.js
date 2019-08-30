(function() {
  // Store user names, space names, and memberships to arrays for later retrieval
  let users = [];
  let spaces = [];
  let members = [];

  let userInput = document.getElementById("user-input"), spaceInput = document.getElementById("space-input"),
  memberInputUsername = document.getElementById("member-input-username"), memberInputSpacename = document.getElementById("member-input-spacename"), 
  userBox =  document.getElementById("user-box"), spaceBox =  document.getElementById("space-box"),
  memberBox =  document.getElementById("member-box"), membershipBox = document.getElementById("membership-box"), spaceIdInput =  document.getElementById('space-id-input'), channel = 'objects';

  // Fetch data from objects to display on screen
  document.addEventListener("DOMContentLoaded", function() {
    // Get user objects. Set max number of results returned to 5
    pubnub.getUsers(
      {
          limit: 5
      },
      function(status, response) {
        let spaceData = response.data;

        for(let x = 0; x < spaceData.length; x++){
          let userId = spaceData[x]['id']; // Get userId
          let userName = spaceData[x]['name']; // Get username

          // Add to the beginning of users array
          users.unshift({
            user_id: userId,
            user_input: userName
          });

          // Display users on screen
          userBox.innerHTML =  (''+userId)+ ': ' + (''+userName) +  '<br>' + userBox.innerHTML;

          // Get the user space memberships
          pubnub.getMemberships(
            {
                userId: userId
            },
            function(status, response) {
              // Check if the user is a member of a space
              if(response.data.length > 0){
                let membershipData = response.data;
                for(let x = 0; x < membershipData.length; x++){
                  let spaceNameId = membershipData[x]['id']; // Get userId
        
                  members.unshift({ // Add to members array
                    'space_id' : spaceNameId,
                    'user_id' : userId,
                  });
                  // Display on screen
                  memberBox.innerHTML =  (''+spaceNameId)+ ': ' + (''+userId) +'<br>' + memberBox.innerHTML;
                }
              }
          });
        }
      }
    );

    // Get space objects.Set max number of results returned to 5
    pubnub.getSpaces(
      {
          limit: 5
      },
      function(status, response) {
        let spaceData = response.data;
        for(let x = 0; x < spaceData.length; x++){
          let spaceId = spaceData[x]['id'];// get space id
          let spaceName = spaceData[x]['name']; // get space name

          spaces.unshift({ //add to spaces array
            space_id : spaceId,
            space_input : spaceName
          });

          // Display on screen
          spaceBox.innerHTML =  (''+spaceId)+ ': ' + (''+spaceName) + '<br>' + spaceBox.innerHTML;
      }
    });
  });

  // Init PubNub
  let pubnub = new PubNub({
    publishKey : 'INSERT_PUB_KEY',
    subscribeKey : 'INSERT_SUB_KEY',
    ssl: true
  });

  // Subscribe to a channel
  pubnub.subscribe({
    channels: [channel]
  }); 

  // Add user
  addUserInfo = (e) => {
    // When user presses the 'Enter' key
    if((e.keyCode || e.charCode) === 13){
      /* 
       Generate random number for the user Id.
       Note: Id must be unique and might typically be the users UUID 
      */
      let randNum = Math.floor(Math.random() * 50);
      let userId = `${userInput.value}-${randNum}`;
    
      pubnub.createUser(
        {
          id: userId,
          name: userInput.value
        },
        function(status, response) {
          users.unshift({
            user_id : userId,
            user_input : userInput.value
          });
          // Display on screen
          userBox.innerHTML =  (''+ userId)+ ': ' + (''+ userInput.value) +  '<br>' + userBox.innerHTML;
          userInput.value = '';
      });
    }
  }

  userInput.addEventListener('keypress', addUserInfo);

  // Add space
  addSpaceInfo = (e) => {
    if((e.keyCode || e.charCode) === 13){
      let spaceId = `${spaceInput.value}_id`;

      pubnub.createSpace(
        {
          id: spaceId,
          name: spaceInput.value
        },
        function(status, response) {
          if(status.error){
            alert('Error: A space with that name already exists')
            return;
          }
          spaces.unshift({
            space_id : spaceId,
            space_input : spaceInput.value
          });
          spaceBox.innerHTML =  (''+ spaceId)+ ': ' + (''+ spaceInput.value) + '<br>' + spaceBox.innerHTML;
          spaceInput.value = '';
        });
    }
  }

  spaceInput.addEventListener('keypress', addSpaceInfo);

  // Add user to a space
  addUserToSpace = (e) => {
    if((e.keyCode || e.charCode) === 13){
      // Check that both input fields are not empty
      if(memberInputSpacename.value && memberInputUsername.value){
        pubnub.joinSpaces(
          {
          userId: memberInputUsername.value, // Get user
          spaces: [
            {
              id: memberInputSpacename.value // Join to this space
            }
          ]
        },
        function(status, response) {
          if(status.error){
            alert('Error: Check that space-id and user-id is correct')
            return;
          }
          members.unshift({
            'space_id' : memberInputSpacename.value, 
            'user_id' : memberInputUsername.value,
          });
          memberBox.innerHTML =  (''+ memberInputSpacename.value) + ': ' + (''+ memberInputUsername.value) +'<br>' + memberBox.innerHTML;
          memberInputSpacename.value = '';
          memberInputUsername.value = '';  
        });
      } 
      else {
        alert('Enter both space and user field')
      }
    }
  }

  memberInputUsername.addEventListener('keypress', addUserToSpace);

  // Get members from space
  getMembersFromSpace = (e) => {
    if((e.keyCode || e.charCode) === 13){
      // Remove previous results from the screen
      membershipBox.innerHTML = '';

      pubnub.getMembers(
        {
            spaceId: spaceIdInput.value,
            limit: 5
        },
        function(status, response) {
         let members = response.data;
         if(response.data.length === 0){
          alert('Error: Member(s) not found')
          return;
        }
        
         // Iterate the array and get the user id for each object
         for(let x = 0; x < members.length; x++){
            let userId = members[x]['id'];
            // Get the username with the user id
            pubnub.getUser(
              {
                  userId: userId
              },
              function(status, response) {
               // Display username on screen
               membershipBox.innerHTML =  (''+ response.data['name'])+ '<br>' + membershipBox.innerHTML;
               spaceIdInput.value = '';       
              }
          );
         }
      });
    }
  }

  spaceIdInput.addEventListener('keypress', getMembersFromSpace);
 
  // Remove user
  removeUser = () =>{
    //get user id from the first element of the array
    let userId = users[0]["user_id"];

    //remove user from user objects
    pubnub.deleteUser(userId, function(status, response) { 
      console.log(response);
    });

    // Remove the first element from the users array
    users = users.slice(1);
    userBox.innerHTML = '';

    for(let x = users.length - 1; x >= 0; x--){ // start from end of array     
      let userId = users[x]['user_id']; // get user id
      let userValue = users[x]['user_input']; // get user value
      userBox.innerHTML =  (''+userId)+ ': ' + (''+userValue) +  '<br>' + userBox.innerHTML;
		}
  }

  // Remove space
  removeSpace = () => {
     //get space id from the first element of the array
    let spaceId = spaces[0]['space_id'];
    //remove space from space objects
    pubnub.deleteSpace(spaceId, function(status, response) {
      console.log(response);
    });

    // Remove the first element from the spaces array
    spaces = spaces.slice(1);
    spaceBox.innerHTML = '';

    for(let x = spaces.length - 1; x >= 0; x--){ // start from end of array
      let spaceId = spaces[x]['space_id'];// get space id
      let spaceValue = spaces[x]['space_input']; // get space value
      spaceBox.innerHTML =  (''+spaceId)+ ': ' + (''+spaceValue) +  '<br>' + spaceBox.innerHTML;
		}
  }

  // Remove user from a space
  removeFromSpace = () => {
    //get user id from the first element of the array
    let userId = members[0]['user_id'];
    //get space id from the first element of the array
    let spaceId = members[0]['space_id'];
    
    // Remove user from space objects
    pubnub.leaveSpaces(
      {
        userId: userId,
        spaces: [
          spaceId
        ]
      },
      function(status, response) {
        // Remove the first element from the members array
        members = members.slice(1);
        memberBox.innerHTML = '';
    
        for(let x = members.length - 1; x >= 0; x--){ // start from end of array
          let spaceId = members[x]['space_id']; // get space id
          let userId = members[x]['user_id']; // get user id
          memberBox.innerHTML = (''+ spaceId) + ': ' + (''+ userId) + '<br>' + memberBox.innerHTML;
        }
      }
    );
  }
})();
  