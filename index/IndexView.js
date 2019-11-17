IndexView {
    constructor () {
        console.log('..init IndexView()')
        this.messageList = $$({messagelist:''});
        this.inputField = $input().events({
            onkeyup: evt => {
                if (evt.key === 'Enter') {
                    console.log('Enter')
                    this.addMessage(this.inputField.text());
                };
            },
        });
        
        this.view({
            container: {
                leftpanel: [],
                basepanel: $$([
                    {h1_:'header'},
                    this.messageList,
                    $$([
                        this.inputField,
                        $button('>>').eclick(e => {
                            this.addMessage(this.inputField.value);
                        })
                    ]).addClass('inputfield'),
                ]).addClass('wrapper'),
            },
        });

        window.onresize = update.bind(this);
        setTimeout(update.bind(this), 300);
    }
    public addMessage(message) {
        if(message === '') return;
        this.messageList.add($$({
            message: message
        }))
        this.inputField.value = '';
        update.call(this);
    }
    private update() {
        document.body.style.minHeight = 	window.innerHeight + 'px';
        document.body.style.height = 	window.innerHeight + 'px';
    
        this.messageList.scrollTop = this.messageList.scrollHeight;
    }
    private setCSS() {
        $.LCSS({
            _message: {
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
                    _header: {
                        height: '3rem',
                        backgroundColor: '#99f'
                    },
                    _wrapper: {
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        maxHeight: '100%',
                        margin: 0,
                        padding: 0,
                        _messagelist:{
                            display: 'block',
                            // display: 'flex',
                            // flexDirection: 'column',
                            // justifyContent: 'flex-end',

                            // height: 'calc(100vh - 54px - 3rem)',
                            // height: '100%',
                            
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