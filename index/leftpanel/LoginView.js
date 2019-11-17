LoginView {
    constructor () {
        this.loginField = $input({placeholder: 'Login'});
        this.view = $$([
            ['User name:'],
            this.loginField,
            // $input({placeholder: 'Password', type: 'password'}),
            // $button('Sig in').eclick(e => {
            //     alert('hello '+this.loginField);
            // })
        ]).addClass('loginpanel');
        $.LCSS({
            _loginpanel: {
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                '& > *': {
                    padding: '0.5rem',
                    margin: '0.5rem',
                },
                input: {
                    border: 0,
                },
                button: {
                    border: 0,
                    borderRadius: '4px',
                } 
            } 
        })
    }
}