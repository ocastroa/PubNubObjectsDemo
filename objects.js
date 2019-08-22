// Player enters lobby name and game starts once two players are in the same lobby
(function() {
let userInput = document.getElementById("user-input"), spaceInput = document.getElementById("space-input"),
  memberInputUsername = document.getElementById("member-input-username"), memberInputSpacename = document.getElementById("member-input-spacename"), 
  userButton =  document.getElementById("user-button"), spaceButton =  document.getElementById("space-button"), 
  memberButton =  document.getElementById("member-button"), userBox =  document.getElementById("user-box"), spaceBox =  document.getElementById("space-box"),
  memberBox =  document.getElementById("member-box"), userRemoveButton =  document.getElementById("user-remove-button"), 
  spaceRemoveButton =  document.getElementById("space-remove-button"), memberRemoveButton =  document.getElementById("member-remove-button"), 
  channel = 'objects';
    
  addUser = () => {
  }

  addSpace = () => {
  }

  addMemberToSpace = () => {
    if(memberInputSpacename.value && memberInputUsername.value){
    }
    else {
      alert('Enter both space and user field')
    }
  }
})();
  