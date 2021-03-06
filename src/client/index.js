import 'whatwg-fetch'
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, compose} from 'redux'
import {Router, browserHistory} from 'react-router'
import thunkMiddleware from 'redux-thunk'
import Immutable from 'immutable'
import routes from './routes'
import LocalRespoistory from './common/repo/LocalRepository'
import {reducer} from './reducers/Reducer'
import {filter} from './common/repo/Data'
import _ from 'lodash'

const ONE_SECOND = 1000

const initialState = Immutable.Map()
let store = createStore(reducer, initialState, compose(
  applyMiddleware(thunkMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : (f) => f
))

const save = () => LocalRespoistory.save(filter(store.getState().toJS()))
const saveDebounced = _.debounce(save, 200, {maxWait: ONE_SECOND})

store.subscribe(() => saveDebounced())

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes}/>
  </Provider>,
  document.getElementById('root'))
