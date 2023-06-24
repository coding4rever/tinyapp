function generateString(length) {
    const characters = "hdfxfdxhjihidfghioehjtgjreio";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
  }

  function getUserByEmail(email, users) {
    for (const userId in users) {
      const user = users[userId];
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  function getUrlsByUserId (userID, urlDB){
    const newUrlDb = {};
    for ( const url in urlDB ) {
      if(userID === urlDB[url].userID){
        newUrlDb[url] = urlDB[url]
      }
    }
    return newUrlDb
  }

  module.exports = {generateString, getUrlsByUserId, getUserByEmail}