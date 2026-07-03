import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import HeroHome from './HeroHome.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HeroHome', HeroHome)
  }
}
