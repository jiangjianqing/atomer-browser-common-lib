//注意:jquery中对于event.data的处理与下面的不兼容,不可以两者混合使用

var trigger = function (eventType, element, options) {
    //use lazy-load
    if (document.createEvent) {

        trigger = function (eventType, element, options) {
            var evt;
            var bubbles = options && 'bubbles' in options ? options['bubbles'] : true,
                cancelable = options && 'cancelable' in options ? options['cancelable'] : true;

            try{
                options['bubbles'] = bubbles;
                options['cancelable'] = cancelable;
                evt = new Event(eventType,options); //some properties must configed by new Event;
            }catch (err){
                //var evt = new CustomEvent('build', { 'detail': elem.dataset.time });
                evt = document.createEvent('Event');
                evt.initEvent(eventType, bubbles, cancelable);
                //deprecate document.createEvent(eventCategory);
            }

            var descriptor;
            //Object.assign(evt,options); //invalid
            for (var key in options){

                if(key.toLowerCase() === 'data'){
                    evt.data = options[key];
                }else{

                    if (evt[key] !== undefined){
                        descriptor = Object.getOwnPropertyDescriptor(evt,key);
                        if(!descriptor || !descriptor.writable){
                            continue;
                        }
                    }
                    evt[key] = options[key];
                }
            }

            return element.dispatchEvent(evt);
        }

    } else {
        trigger = function (eventType, element, data) {
            // Welcome IE
            var evt = document.createEventObject();
            evt.data = data;
            return element.fireEvent('on' + eventType, evt);
        }

    }

    return trigger.apply(null,arguments);
};

module.exports = trigger;