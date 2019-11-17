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
                basepanel: {
                    header: [],
                    body: [
                        this.messageList, $$([
                            this.inputField,
                            $button('>>').eclick(e => {
                                this.addMessage(this.inputField.value);
                            })
                        ]).addClass('inputfield'),
                    ],
                },
            },
        });

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
                height: '100vh',
                backgroundColor: '#eee',
                _leftpanel: {},
                _basepanel: {
                    _header: {
                        height: '3rem',
                        backgroundColor: '#99f'
                    },
                    _body: {
                        _messagelist:{
                            height: 'calc(100vh - 54px - 3rem)',
                            'overflow-y': 'scroll',
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