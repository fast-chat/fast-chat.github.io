import index.leftpanel<LoginView>;

IndexView {
    $$.avatar = str => {
        return $div(str.split('')[0].toUpperCase() || 'A', {'data-title': str})
            .css({
                'background-color': '#'+str.hash(6)
            }).addClass('iconavatar');
    };
    constructor () {
        console.log('..init IndexView()');

        this.loginView = new LoginView();

        this.messageList = $$({messagelist:''});
        this._interval = null;
        this.inputField = $input().events({
            onkeyup: evt => {
                if (evt.key === 'Enter') {
                   this.sendMessage();
                };
            },
        });
        
        this.view({
            container: {
                leftpanel: [
                    this.loginView.view
                ],
                basepanel: $$([
                    {h1_header:'FAST CHAT'},
                    this.messageList,
                    $$([
                        this.inputField,
                        $button('>>').eclick(e => {
                            this.sendMessage();
                            this.inputField.focus();
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
    public sendMessage() {
        if(this.onAddMessage) {
            this.onAddMessage({
                message: this.inputField.value,
                name: this.loginView.loginField.value || 'Guest'
            });
        } 
    }
    public addMessage(message) {
        if(!message || message === '') return;
        try {
            message = JSON.parse(message);
            if (message.message === '') return;
        } catch (e) {

        } 
        console.log(message)
        this.messageList.add($$([
            {avatar: message.name || 'Guest'},
            {message: message.message} 
        ]).addClass('messagecontainer'));
        this.inputField.value = '';
        update.call(this);
    }
    
    private update() {
        document.body.style.minHeight = window.innerHeight + 'px';
        document.body.style.height = window.innerHeight + 'px';
        if(this._interval) {
            clearInterval(this._interval);
        };
        this._interval = setInterval(() => {
            var t = this.messageList.scrollTop;
            this.messageList.scrollTop += 40;

            if(t === this.messageList.scrollTop) {
                clearInterval(this._interval);
            };
        } , 1000/60)
    }
    private setCSS() {
        $.LCSS({
            _iconavatar: {
                backgroundColor: '#adc4e1',
                fontSize: '24pt',
                padding: '0',
                width: '50px',
                height: '50px',
                textAlign: 'center',
                borderTopRightRadius: '1rem',
                borderBottomLeftRadius: '1rem',
                border: '5px solid rgba(0,0,0,0.3)',
                display: 'inline-block',
                Before:{
                    content: 'attr(data-title)',
                    position: 'absolute',
                    fontSize: '9pt',
                    backgroundColor: '#fff',
                    padding: '2px 4px',
                    marginLeft: '42px',
                    marginTop: '0px',
                    color: '#999',
                } 
            },
            _messagecontainer: {
                padding: '0.5rem',
                position: 'relative',
            },
            _message: {
                animationDuration: '0.3s',
                animationName: 'show',
                padding: '0.5rem',
                borderRadius: '3px',
                boxShadow: '1px 1px 5px -4px #000',
                backgroundColor: '#fff',
                display: 'inline-block',
                margin: '0 0 0 -0.5rem',
            },
            _container: {
                padding: 0,
                margin: 0,
                height: '100%',
                backgroundColor: '#eee',
                display: 'flex',
                justifyContent: 'normal',
                flexDirection: 'row',
                alignItems: 'inherit',
                _leftpanel: {
                    backgroundColor: '#222',
                    display: 'block',
                    minWidth: '250px',
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
            '@media (min-height: 680px)': '{.container { flexDirection : column; } }'
        })
    }
    public view(obj) {
        setCSS();
        $body.cls().add($$(obj));
    }
}