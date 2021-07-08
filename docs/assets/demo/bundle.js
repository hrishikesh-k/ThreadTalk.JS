import ThreadTalkJS from 'threadtalkjs'

window.onload = () => {
  
  new ThreadTalkJS({
    dateFormat: 'en-IN',
    title: document.title.split('|')[0].trim().toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (spaces, firstCharacters) => firstCharacters.toUpperCase())
  })
  
  window.onload = null

}