import * as _ from 'lodash-es'
import {
    addEvent,
    getScrollTop,
    getScrollEventTarget,
    getVisibleHeight,
    getElementTop
} from '../helper'

function checkIfNeedsMoreContent(el, options) {
    let {
        distance,
        disabled
    } = options
    let scrollEventTarget = getScrollEventTarget(el)
    if (disabled) return false //eslint-disable-line
    let viewportScrollTop = getScrollTop(scrollEventTarget)
    let viewportBottom = viewportScrollTop + getVisibleHeight(scrollEventTarget)
    if (scrollEventTarget === el) {
        return (scrollEventTarget.scrollHeight - viewportBottom) <= distance
    } else {
        let elBottom = getElementTop(el) - getElementTop(scrollEventTarget) + el.offsetHeight + viewportScrollTop
        return (viewportBottom + distance) >= elBottom
    }
}
export default class InfiniteScroll {
    constructor(options) {
        options = _.merge({
            distance: 10,
            el: document.body,
            loadMore: function() {
                console.log('load more!')
            },
            disabled: false
        }, options || {})
        addEvent(getScrollEventTarget(options.el), 'scroll', _.throttle(e => {
            if (checkIfNeedsMoreContent(options.el, options)) {
                options.loadMore.call(this, e)
            }
        }, 300))
    }
}
