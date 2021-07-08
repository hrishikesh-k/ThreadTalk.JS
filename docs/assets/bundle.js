import Lottie from 'lottie-web'
import Gumshoe from 'gumshoejs'
import * as Turbo from '@hotwired/turbo'

window.onload = () => {

  let scrollSpy
  let fired = false
  let lottiePlayers = []
  let width = window.innerWidth
  let html = document.querySelector('html')
  let article = document.querySelector('article')
  let lottieElements = Array.from(document.querySelectorAll('.lottie'))
  let copyElements = Array.from(document.querySelectorAll('.highlight'))
  let collapsableElements = Array.from(document.querySelectorAll('aside'))

  let tailwindConfig = preval`
    const config = require('tailwindcss/resolveConfig')(require('./tailwind.config.js')).theme
    module.exports = {
      screen: parseInt(config.screens.m),
      height: parseInt(config.height['20']),
      margin: parseFloat(config.margin['5'])
    }
  `
  
  Turbo.setProgressBarDelay(0)

  function manageCopy() {
    copyElements.forEach(copyElement => {
      let controlBox = copyElement.nextElementSibling
      controlBox.querySelector('div:last-of-type').onclick = () => {
        let selection = window.getSelection()
        selection.selectAllChildren(copyElement)
        document.execCommand('copy')
        let textDisplay = controlBox.querySelector('div:first-of-type p')
        let currentHTML = textDisplay.innerHTML
        textDisplay.innerHTML = 'Copied!'
        selection.empty()
        selection = null
        setTimeout(() => {
          textDisplay.innerHTML = currentHTML
          currentHTML = null
          textDisplay = null
        }, 2500)
      }
    })
  }

  function checkTheme() {
    let selectedTheme = localStorage.getItem('theme')
    if (selectedTheme) {
      setTheme(selectedTheme)
    } else {
      window.matchMedia('(prefers-color-scheme: dark)').matches ? setTheme('dark') : setTheme('light')
    }
  }

  function manageLottie() {
    lottieElements.forEach(lottie => {
      let id = parseInt(lottie.getAttribute('data-lottie'))
      let animation = Lottie.loadAnimation({
        container: lottie,
        path: '/lottie/lottie' + id + '.json'
      })
      lottiePlayers.push(animation)
      animation.addEventListener('data_ready', () => {
        lottie.querySelector('div').remove()
      })
      switch (id) {
        case 0:
          animation.playSegments([[0, 49], [50, 119]], true)
          break;
        case 3:
          animation.playSegments([[0, 20], [21, 104]], true)
          break;
        case 4:
          animation.playSegments([[0, 97], [98, 149]], true)
          break;
      }
      animation = null
      id = null
    })
  }

  function setTheme(theme) {
    let icon = document.querySelector('nav div path')
    if (theme === 'dark') {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      html.classList.remove('light')
      icon.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z')
    } else {
      html.classList.add('light')
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      icon.setAttribute('d', 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z')
    }
    icon = null
  }

  function setHeight(main) {
    new ResizeObserver(() => {
      document.querySelector('body').style.height = main.offsetHeight + 'px'
    }).observe(main)
  }

  function resizeActions() {
    if (!fired || window.innerWidth != width) {
      fired = true
      width = window.innerWidth
      article && manageScrollSpy()
      collapsableElements.length > 0 && manageCollapsableElements()
    }
  }

  function manageScrollSpy() {
    if (window.innerWidth < tailwindConfig.screen) {
      if (scrollSpy) {
        scrollSpy.destroy()
        scrollSpy = null
      }
    } else {
      scrollSpy && scrollSpy.destroy()
      scrollSpy = new Gumshoe('.toc a', {
        events: false,
        offset: (((tailwindConfig.margin * 2) + tailwindConfig.height) * window.getComputedStyle(html).fontSize.slice(0, -2))
      })
    }
  }

  function manageCollapsableElements() {
    collapsableElements.forEach(element => {
      let clickElement = element.children[0]
      if (window.innerWidth < tailwindConfig.screen) {
        clickElement.onclick = () => {
          element.classList.toggle('expanded')
        }
        element.classList.remove('expanded')
      } else {
        clickElement.onclick = null
        element.classList.add('expanded')
      }
    })
  }

  checkTheme()
  resizeActions()
  copyElements.length > 0 && manageCopy()
  setHeight(document.querySelector('main'))
  lottieElements.length > 0 && manageLottie()

  window.onload = null
  window.onresize = resizeActions

  window.matchMedia('(prefers-color-scheme: dark)').addListener(checkTheme)

  document.querySelector('nav > div').onclick = () => {
    if (html.classList.contains('dark')) {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  document.documentElement.addEventListener('turbo:load', () => {

    collapsableElements = Array.from(document.querySelectorAll('aside'))
    copyElements = Array.from(document.querySelectorAll('.highlight'))
    lottieElements = Array.from(document.querySelectorAll('.lottie'))
    article = document.querySelector('article')
    
    resizeActions()
    window.onresize = resizeActions
    copyElements.length > 0 && manageCopy()
    setHeight(document.querySelector('main'))
    lottieElements.length > 0 && manageLottie()
  
  })

  document.documentElement.addEventListener('turbo:click', () => {

    fired = false
    article = null
    copyElements.length > 0 && (copyElements = [])
    collapsableElements.length > 0 && (collapsableElements = [])

    if (scrollSpy) {
      scrollSpy.destroy()
      scrollSpy = null
    }

    if (lottieElements.length > 0) {
      lottiePlayers.forEach(player => {
        player.destroy()
      })
      lottiePlayers = []
      lottieElements = []
    }

    window.onresize = null
    
  })

  navigator.serviceWorker.register('/sw.js')

}