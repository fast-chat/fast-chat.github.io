IndexView {
    constructor () {
        console.log('..init IndexView()')
        this.messageList = $$({messagelist:''});
        this._interval = null;
        this.inputField = $input().events({
            onkeyup: evt => {
                if (evt.key === 'Enter') {
                    // console.log('Enter', this.onAddMessage)
                    if(this.onAddMessage) {
                        this.onAddMessage({
                            message: this.inputField.value
                        });
                    } 
                    // this.addMessage(this.inputField.value);
                };
            },
        });
        
        this.view({
            container: {
                leftpanel: [],
                basepanel: $$([
                    {h1_header:'header'},
                    this.messageList,
                    $$([
                        this.inputField,
                        $button('>>').eclick(e => {
                            if(this.onAddMessage) {
                                this.onAddMessage({
                                    message: this.inputField.value
                                });
                            } 
                            // this.addMessage(this.inputField.value);
                            this.inputField.focus()
                        })
                    ]).addClass('inputfield'),
                ]).addClass('wrapper'),
            },
        });

        window.onresize = update.bind(this);
        document.body.addEventListener("touchstart", () => {
            if(this._interval) {
                clearInterval(this._interval);
            } 
        }, false);
        setTimeout(update.bind(this), 300);
    }
    public addMessage(message) {
        if(message === '') return;
        
        this.messageList.add($$({
            message: message
        }));
        this.inputField.value = '';
        update.call(this);
    }
    
    private update() {
        document.body.style.minHeight = 	window.innerHeight + 'px';
        document.body.style.height = 	window.innerHeight + 'px';
        if(this._interval) {
            clearInterval(this._interval);
        };
        this._interval = setInterval(() => {
            var t = this.messageList.scrollTop;
            this.messageList.scrollTop += 4;
            // console.log('anim')
            if(t === this.messageList.scrollTop) {
                clearInterval(this._interval);
            };
        } , 1000/60)
        // this.messageList.scrollTop = this.messageList.scrollHeight;
        
    }
    private setCSS() {
        $.LCSS({
            _message: {
                animationDuration: '0.3s',
                animationName: 'show',
                padding: '0.5rem',
                margin: '0.5rem',
                borderRadius: '3px',
                boxShadow: '1px 1px 5px -4px #000',
                backgroundColor: '#fff',
            },
            _container: {
                padding: 0,
                margin: 0,
                height: '100%',
                backgroundColor: '#eee',
                display: 'flex',
                justifyContent: 'normal',
                flexDirection: 'column',
                alignItems: 'inherit',
                _leftpanel: {
                    display: 'none'
                },
                _basepanel: {
                    padding: 0,
                    margin: 0,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    
                    _wrapper: {
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        maxHeight: '100%',
                        margin: 0,
                        padding: 0,
                        _header: {
                            height: '3rem',
                            backgroundColor: '#99f',
                            margin: '0rem',
                            textAlign: 'center',
                        },
                        _messagelist:{
                            display: 'block',
                            flex: '1 1 auto',
                            'overflow-y': 'auto',
                            minHeight: '0px',
                            paddingBottom: '15px',
                            boxSizing: 'border-box',
                        },
                        _inputfield: {
                            backgroundColor: '#fff',
                            display: 'flex',
                            padding: '0.5rem',
                            input: {
                                flex: 1,
                                padding: '0.5rem',
                            },
                            button: {
                                border: 0,
                                padding: '0.5rem',
                                backgroundColor: '#99f',
                                minWidth: '50px',
                            },
                        },
                    },
                
                },
            },
        })
    }
    public view(obj) {
        setCSS();
        $body.cls().add($$(obj));
    }
}